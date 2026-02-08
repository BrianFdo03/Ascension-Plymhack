import React from 'react';
import { X, ArrowRight } from 'lucide-react';
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

interface RouteDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    route: RouteData | null;
    isLoaded: boolean;
}

const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({ isOpen, onClose, route, isLoaded }) => {

    if (!isOpen || !route) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono font-bold text-lg text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                                #{route.routeNumber}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                                ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}
                            `}>
                                <span className={`w-1.5 h-1.5 rounded-full 
                                    ${route.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}
                                `}></span>
                                {route.status}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {route.origin} <ArrowRight size={20} className="text-slate-400" /> {route.destination}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column: Route Details */}
                        <div className="space-y-6">

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-sm text-slate-500 mb-1">Total Stops</div>
                                    <div className="text-2xl font-bold text-slate-900">{route.stops.length}</div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-sm text-slate-500 mb-1">Est. Duration</div>
                                    <div className="text-2xl font-bold text-slate-900">-- min</div>
                                </div>
                            </div>

                            {/* Stops List */}
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Route Stops</h3>
                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                    {/* Start Point */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-blue-500 bg-white"></div>
                                        <div className="text-sm font-medium text-slate-900">{route.origin}</div>
                                        <div className="text-xs text-slate-500">Start Point</div>
                                    </div>

                                    {/* Intermediate Stops */}
                                    {route.stops.map((stop, index) => (
                                        <div key={index} className="relative">
                                            <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300"></div>
                                            <div className="text-sm text-slate-700">{stop.name}</div>
                                            <div className="text-xs text-slate-400">Rs. {stop.price}</div>
                                        </div>
                                    ))}

                                    {/* End Point */}
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-slate-900 bg-white"></div>
                                        <div className="text-sm font-medium text-slate-900">{route.destination}</div>
                                        <div className="text-xs text-slate-500">End Point</div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Map Preview */}
                        <div className="h-[300px] lg:h-auto min-h-[300px] rounded-xl overflow-hidden border border-slate-200">
                            <RouteMapPreview
                                startPoint={route.originCoords}
                                endPoint={route.destinationCoords}
                                stops={route.stops.filter(s => s.lat && s.lng).map(s => ({ lat: s.lat!, lng: s.lng! })) as { lat: number; lng: number }[]}
                                isLoaded={isLoaded}
                            />
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default RouteDetailsModal;
