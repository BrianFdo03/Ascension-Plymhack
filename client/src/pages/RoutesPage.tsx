import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Pencil,
    Trash2,
    MapPin,
    ArrowRight
} from 'lucide-react';
import { useJsApiLoader } from '@react-google-maps/api';
import Layout from "../components/layout/Layout";
import AddRouteModal from '../components/routes/AddRouteModal';
import RouteDetailsModal from '../components/routes/RouteDetailsModal';

// Define the shape of a Route object
interface BusRoute {
    id: string;
    routeNumber: string;
    origin: string;
    originCoords: { lat: number; lng: number };
    destination: string;
    destinationCoords: { lat: number; lng: number };
    stop_count_display?: number; // legacy, can remove if unused
    stopsList: { name: string; price: string; lat: number; lng: number }[]; // For details modal
    status: 'Active' | 'Inactive';
}

const libraries: ("places")[] = ["places"];

const RoutesPage: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
        libraries,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
    const [editingRoute, setEditingRoute] = useState<BusRoute | null>(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
    const [stopsFilter, setStopsFilter] = useState<'Any' | 'Short' | 'Medium' | 'Long'>('Any');

    // Mock Data for Routes
    const [routes, setRoutes] = useState<BusRoute[]>([
        {
            id: '1',
            routeNumber: '17',
            origin: 'Panadura',
            originCoords: { lat: 6.7115, lng: 79.9074 },
            destination: 'Kandy',
            destinationCoords: { lat: 7.2906, lng: 80.6337 },
            stopsList: [
                { name: "Moratuwa", price: "50", lat: 6.7744, lng: 79.8816 },
                { name: "Colombo Fort", price: "120", lat: 6.9319, lng: 79.8478 },
                { name: "Paliyagoda", price: "150", lat: 6.9649, lng: 79.8863 },
                { name: "Kellaniya", price: "160", lat: 6.9555, lng: 79.9175 },
                { name: "Kadawatha", price: "200", lat: 7.0016, lng: 79.9515 }
            ],
            status: 'Active'
        },
        {
            id: '2',
            routeNumber: '138',
            origin: 'Pettah',
            originCoords: { lat: 6.9366, lng: 79.8449 },
            destination: 'Homagama',
            destinationCoords: { lat: 6.8412, lng: 80.0034 },
            stopsList: [],
            status: 'Active'
        },
        {
            id: '3',
            routeNumber: '01',
            origin: 'Colombo',
            originCoords: { lat: 6.9271, lng: 79.8612 },
            destination: 'Kandy',
            destinationCoords: { lat: 7.2906, lng: 80.6337 },
            stopsList: [],
            status: 'Active'
        },
        // ... add more mocked coords/stops if needed for other routes to look good
    ]);

    // Derived Filtered Routes
    const filteredRoutes = routes.filter(route => {
        // Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch =
            route.routeNumber.toLowerCase().includes(query) ||
            route.origin.toLowerCase().includes(query) ||
            route.destination.toLowerCase().includes(query);

        // Status Filter
        const matchesStatus = statusFilter === 'All' || route.status === statusFilter;

        // Stops Filter (Short < 5, Medium 5-15, Long > 15)
        let matchesStops = true;
        const stopsCount = route.stopsList.length;
        if (stopsFilter === 'Short') matchesStops = stopsCount < 5;
        else if (stopsFilter === 'Medium') matchesStops = stopsCount >= 5 && stopsCount <= 15;
        else if (stopsFilter === 'Long') matchesStops = stopsCount > 15;

        return matchesSearch && matchesStatus && matchesStops;
    });

    // Handler for Deleting a route
    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this route?')) {
            setRoutes(routes.filter(route => route.id !== id));
        }
    };

    const handleViewDetails = (route: BusRoute) => {
        // Transform BusRoute to match RouteDetailsModal's expected RouteData format
        // Note: RouteDetailsModal expects stops to have optional lat/lng, but our mock has required.
        // Typescript might complain if we don't map explicitly or if types don't align perfectly.
        // Let's rely on structural typing or simple casting if needed, but manual variable is safer.
        setSelectedRoute(route);
        setViewModalOpen(true);
    };

    const handleEditRoute = (route: BusRoute) => {
        setEditingRoute(route);
        setIsModalOpen(true);
    };

    const handleAddNewRoute = () => {
        setEditingRoute(null);
        setIsModalOpen(true);
    };

    const toggleStatusFilter = () => {
        if (statusFilter === 'All') setStatusFilter('Active');
        else if (statusFilter === 'Active') setStatusFilter('Inactive');
        else setStatusFilter('All');
    };

    const toggleStopsFilter = () => {
        if (stopsFilter === 'Any') setStopsFilter('Short');
        else if (stopsFilter === 'Short') setStopsFilter('Medium');
        else if (stopsFilter === 'Medium') setStopsFilter('Long');
        else setStopsFilter('Any');
    };

    return (
        <Layout title="Routes Management">
            <div className="flex-1 bg-[#F1F5F9] font-sans text-slate-900">
                {/* 1. Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Routes</h1>
                        <p className="text-slate-500 text-sm mt-1">Manage your fleet destinations and schedules.</p>
                    </div>

                    <button
                        onClick={handleAddNewRoute}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                        Add Route
                    </button>
                </div>

                {/* 2. Content Card (The White Area) */}
                <div className="px-8 pb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">

                        {/* Toolbar: Search & Filters */}
                        <div className="p-5 flex flex-col sm:flex-row gap-4 border-b border-slate-100">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search routes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={toggleStatusFilter}
                                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors
                                        ${statusFilter !== 'All' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    <Filter size={18} />
                                    <span>Status: {statusFilter}</span>
                                </button>
                                <button
                                    onClick={toggleStopsFilter}
                                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors
                                        ${stopsFilter !== 'Any' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                                    `}
                                >
                                    <span>Stops: {stopsFilter}</span>
                                </button>
                            </div>
                        </div>

                        {/* 3. The Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-6 py-4 font-semibold">Destination (A → B)</th>
                                        <th className="px-6 py-4 font-semibold">Route No</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredRoutes.map((route) => (
                                        <tr key={route.id} className="group hover:bg-blue-50/30 transition-colors">

                                            {/* Destination Column */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100/50 flex items-center justify-center text-blue-600">
                                                        <MapPin size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                                                            {route.origin}
                                                            <ArrowRight size={14} className="text-slate-400" />
                                                            {route.destination}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{route.stopsList.length} stops</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Route Number Column */}
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded text-sm">
                                                    #{route.routeNumber}
                                                </span>
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                                                    ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}
                                                `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full
                                                        ${route.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-500'}
                                                    `}></span>
                                                    {route.status}
                                                </span>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewDetails(route)}
                                                        className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditRoute(route)}
                                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                        title="Edit Route"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(route.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Route"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
            <AddRouteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                    if (editingRoute) {
                        // Update existing route
                        setRoutes(routes.map(r => r.id === editingRoute.id ? {
                            ...r,
                            routeNumber: data.routeNumber,
                            origin: data.origin,
                            originCoords: data.originCoords!,
                            destination: data.destination,
                            destinationCoords: data.destinationCoords!,
                            status: data.status as 'Active' | 'Inactive',
                            stopsList: data.stops.map(s => ({
                                name: s.name,
                                price: s.price,
                                lat: s.lat!,
                                lng: s.lng!
                            }))
                        } : r));
                    } else {
                        // Add new route
                        const newRoute: BusRoute = {
                            id: (routes.length + 1).toString(),
                            routeNumber: data.routeNumber,
                            origin: data.origin,
                            originCoords: data.originCoords!,
                            destination: data.destination,
                            destinationCoords: data.destinationCoords!,
                            status: data.status as 'Active' | 'Inactive',
                            stopsList: data.stops.map(s => ({
                                name: s.name,
                                price: s.price,
                                lat: s.lat!,
                                lng: s.lng!
                            }))
                        };
                        setRoutes([...routes, newRoute]);
                    }
                    setIsModalOpen(false);
                    setEditingRoute(null);
                }}
                isLoaded={isLoaded}
                routeToEdit={editingRoute ? {
                    routeNumber: editingRoute.routeNumber,
                    origin: editingRoute.origin,
                    originCoords: editingRoute.originCoords,
                    destination: editingRoute.destination,
                    destinationCoords: editingRoute.destinationCoords,
                    status: editingRoute.status,
                    stops: editingRoute.stopsList
                } : undefined}
            />

            <RouteDetailsModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                route={selectedRoute ? {
                    routeNumber: selectedRoute.routeNumber,
                    origin: selectedRoute.origin,
                    originCoords: selectedRoute.originCoords,
                    destination: selectedRoute.destination,
                    destinationCoords: selectedRoute.destinationCoords,
                    status: selectedRoute.status,
                    stops: selectedRoute.stopsList
                } : null}
                isLoaded={isLoaded}
            />
        </Layout>
    );
};

export default RoutesPage;