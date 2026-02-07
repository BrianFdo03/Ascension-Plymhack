import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Pencil,
    Trash2,
    MapPin,
    ArrowRight
} from 'lucide-react';
import Layout from "../components/layout/Layout";

// Define the shape of a Route object
interface BusRoute {
    id: string;
    routeNumber: string;
    origin: string;
    destination: string;
    stops: number;
    status: 'Active' | 'Inactive';
}

const RoutesPage: React.FC = () => {
    // Mock Data for Routes
    const [routes, setRoutes] = useState<BusRoute[]>([
        { id: '1', routeNumber: '17', origin: 'Panadura', destination: 'Kandy', stops: 24, status: 'Active' },
        { id: '2', routeNumber: '138', origin: 'Pettah', destination: 'Homagama', stops: 18, status: 'Active' },
        { id: '3', routeNumber: '01', origin: 'Colombo', destination: 'Kandy', stops: 12, status: 'Active' },
        { id: '4', routeNumber: '87', origin: 'Colombo', destination: 'Jaffna', stops: 45, status: 'Inactive' },
        { id: '5', routeNumber: '122', origin: 'Pettah', destination: 'Avissawella', stops: 32, status: 'Inactive' },
    ]);

    // Handler for Deleting a route
    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this route?')) {
            setRoutes(routes.filter(route => route.id !== id));
        }
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

                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
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
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                    <Filter size={18} />
                                    <span>All Status</span>
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                    <span>Any Stops</span>
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
                                    {routes.map((route) => (
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
                                                        <div className="text-xs text-slate-500">{route.stops} stops</div>
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
                        ${route.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                        'bg-slate-100 text-slate-600'
                                                    }
                      `}>
                                                    <span className={`w-1.5 h-1.5 rounded-full 
                          ${route.status === 'Active' ? 'bg-emerald-500' :
                                                            'bg-slate-500'
                                                        }
                        `}></span>
                                                    {route.status}
                                                </span>
                                            </td>

                                            {/* Actions Column */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit Route">
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

                        {/* Pagination Footer (Optional visual match) */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                            <span>Showing 1-5 of 24 routes</span>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">Previous</button>
                                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default RoutesPage;