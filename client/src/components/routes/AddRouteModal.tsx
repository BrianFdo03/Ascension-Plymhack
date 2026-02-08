import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';
import LocationPicker, { type LocationData } from '../common/LocationPicker';
import RouteMapPreview from './RoutePreview';

interface StopData {
    name: string;
    price: string;
    lat?: number;
    lng?: number;
}

interface RouteData {
    routeNumber: string;
    origin: string;
    originCoords: { lat: number; lng: number } | null;
    destination: string;
    destinationCoords: { lat: number; lng: number } | null;
    status: string;
    stops: StopData[];
}

interface AddRouteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (routeData: RouteData) => void;
}

const libraries: ("places")[] = ["places"];

const AddRouteModal: React.FC<AddRouteModalProps> = ({ isOpen, onClose, onSave }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [startPoint, setStartPoint] = useState("");
    const [startCoords, setStartCoords] = useState<{ lat: number, lng: number } | null>(null);

    const [endPoint, setEndPoint] = useState("");
    const [endCoords, setEndCoords] = useState<{ lat: number, lng: number } | null>(null);

    const [routeNumber, setRouteNumber] = useState("");
    const [status, setStatus] = useState("Active");
    const [stops, setStops] = useState<StopData[]>([]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            routeNumber,
            origin: startPoint,
            originCoords: startCoords,
            destination: endPoint,
            destinationCoords: endCoords,
            status,
            stops: stops.filter(s => s.name.trim() !== ""), // Filter out empty stops
        });
        // Reset form or handle closing in parent
        onClose();
    };

    const addStop = () => {
        setStops([...stops, { name: "", price: "" }]);
    };

    const removeStop = (index: number) => {
        const newStops = [...stops];
        newStops.splice(index, 1);
        setStops(newStops);
    };

    const updateStopName = (index: number, value: string) => {
        const newStops = [...stops];
        newStops[index].name = value;
        setStops(newStops);
    };

    const updateStopPrice = (index: number, value: string) => {
        const newStops = [...stops];
        newStops[index].price = value;
        setStops(newStops);
    };

    const updateStopLocation = (index: number, data: LocationData) => {
        const newStops = [...stops];
        newStops[index].name = data.address;
        newStops[index].lat = data.lat;
        newStops[index].lng = data.lng;
        setStops(newStops);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Add New Route</h2>
                        <p className="text-slate-500 text-sm mt-1">Add a new route to your fleet. Click save when you're done.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="add-route-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Row 1: Start & End Points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <LocationPicker
                                label="Start Point"
                                placeholder="Search start location"
                                value={startPoint}
                                onChange={setStartPoint}
                                onLocationSelect={(data) => {
                                    setStartPoint(data.address);
                                    setStartCoords({ lat: data.lat, lng: data.lng });
                                }}
                                isLoaded={isLoaded}
                            />
                            <LocationPicker
                                label="End Point"
                                placeholder="Search end location"
                                value={endPoint}
                                onChange={setEndPoint}
                                onLocationSelect={(data) => {
                                    setEndPoint(data.address);
                                    setEndCoords({ lat: data.lat, lng: data.lng });
                                }}
                                isLoaded={isLoaded}
                            />
                        </div>

                        {/* Row 2: Route No & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Route Number</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 177"
                                    value={routeNumber}
                                    onChange={(e) => setRouteNumber(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 3: Sub Bus Stops */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-slate-700">Sub Bus Stops & Prices</label>
                                <button
                                    type="button"
                                    onClick={addStop}
                                    className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <Plus size={16} />
                                    Add Stop
                                </button>
                            </div>

                            {stops.length === 0 && (
                                <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm">
                                    No sub stops added. Click "Add Stop" to add one.
                                </div>
                            )}

                            <div className="space-y-3">
                                {stops.map((stop, index) => (
                                    <div key={index} className="flex items-end gap-3 group animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex-[2]">
                                            <LocationPicker
                                                label={`Stop ${index + 1}`}
                                                placeholder={`Search stop ${index + 1}...`}
                                                value={stop.name}
                                                onChange={(value) => updateStopName(index, value)}
                                                onLocationSelect={(data) => updateStopLocation(index, data)}
                                                isLoaded={isLoaded}
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="text-sm font-medium text-slate-700 block">Price (Rs)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                value={stop.price}
                                                onChange={(e) => updateStopPrice(index, e.target.value)}
                                                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeStop(index)}
                                            className="mb-1 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all h-[42px] flex items-center justify-center border border-transparent hover:border-red-100"
                                            title="Remove Stop"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Route Map Visualization */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Route Preview</label>
                            <RouteMapPreview
                                startPoint={startCoords}
                                endPoint={endCoords}
                                stops={stops.filter(s => s.lat && s.lng).map(s => ({ lat: s.lat!, lng: s.lng! }))}
                                isLoaded={isLoaded}
                            />
                        </div>


                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="add-route-form"
                        className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Save Route
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddRouteModal;
