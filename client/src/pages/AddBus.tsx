import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Bus, User, MapPin, Search, Filter, Plus, Edit2, Trash2, X, Clock } from 'lucide-react';

interface BusData {
    id: string;
    numberPlate: string;
    driver: string;
    route: string;
    routeNo: string;
    departureTime: string;
    status: 'Active' | 'Inactive' | 'Maintenance';
}

const MOCK_DRIVERS = [
    { id: '1', name: 'Sunil Perera', license: 'B1234567' },
    { id: '2', name: 'Wimal Kumara', license: 'B9876543' },
    { id: '3', name: 'Nimal Silva', license: 'B5556667' },
];

const MOCK_ROUTES = [
    { id: 'r1', number: '138', path: 'Pettah - Homagama' },
    { id: 'r2', number: '01', path: 'Colombo - Kandy' },
    { id: 'r3', number: '87', path: 'Colombo - Jaffna' },
    { id: 'r4', number: '122', path: 'Pettah - Avissawella' },
];

const MOCK_BUSES: BusData[] = [
    { id: '1', numberPlate: 'WP NB-1234', driver: 'Sunil Perera', route: 'Pettah - Homagama', routeNo: '#138', departureTime: '08:30 AM', status: 'Active' },
    { id: '2', numberPlate: 'WP CAA-5678', driver: 'Wimal Kumara', route: 'Colombo - Kandy', routeNo: '#01', departureTime: '10:00 AM', status: 'Active' },
    { id: '3', numberPlate: 'WP KA-9012', driver: 'Nimal Silva', route: 'Colombo - Jaffna', routeNo: '#87', departureTime: '06:00 AM', status: 'Maintenance' },
    { id: '4', numberPlate: 'WP QB-3456', driver: 'Sunil Perera', route: 'Pettah - Avissawella', routeNo: '#122', departureTime: '03:00 PM', status: 'Inactive' },
];

const AddBus = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter] = useState<string>('All Status');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        numberPlate: '',
        driverId: '',
        routeId: '',
        departureTime: ''
    });

    const filteredBuses = MOCK_BUSES.filter(bus => {
        const matchesSearch = bus.numberPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bus.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
            bus.route.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || bus.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Maintenance':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Inactive':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert(`Successfully added bus: ${formData.numberPlate}\nDeparture Time: ${formData.departureTime}`);
        setFormData({ numberPlate: '', driverId: '', routeId: '', departureTime: '' });
        setShowAddModal(false);
    };

    return (
        <Layout title="Vehicles Management">
            {/* Modal Backdrop */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Add New Bus</h3>
                                <p className="text-sm text-gray-500 mt-1">Enter bus details to add to your fleet</p>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-6">
                                {/* Number Plate */}
                                <div className="relative group">
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                        Number Plate
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Bus size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. WP NB-1234"
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            value={formData.numberPlate}
                                            onChange={(e) => setFormData({ ...formData, numberPlate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Driver Selection */}
                                    <div className="group">
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Assigned Driver
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <select
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
                                                value={formData.driverId}
                                                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                                            >
                                                <option value="">Select a driver</option>
                                                {MOCK_DRIVERS.map(driver => (
                                                    <option key={driver.id} value={driver.id}>
                                                        {driver.name} ({driver.license})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Route Selection */}
                                    <div className="group">
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Assigned Route
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <MapPin size={18} className="text-gray-400" />
                                            </div>
                                            <select
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none"
                                                value={formData.routeId}
                                                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                                            >
                                                <option value="">Select a route</option>
                                                {MOCK_ROUTES.map(route => (
                                                    <option key={route.id} value={route.id}>
                                                        {route.number} - {route.path}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Departure Time */}
                                <div className="relative group">
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                        Departure Time
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Clock size={18} className="text-gray-400" />
                                        </div>
                                        <input
                                            type="time"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                                            value={formData.departureTime}
                                            onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Plus size={20} />
                                    Add Bus
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">Vehicles</h2>
                            <p className="text-sm text-gray-500">Manage your fleet destinations and schedules.</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                        >
                            <Plus size={18} />
                            Add Bus
                        </button>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search buses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            <Filter size={16} />
                            {statusFilter}
                        </button>
                        <button className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                            Any Route
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Number Plate
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Driver
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Route
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Route No
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Departure Time
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBuses.map((bus) => (
                                <tr key={bus.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                                <Bus size={18} className="text-blue-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{bus.numberPlate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-900">{bus.driver}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-900">{bus.route}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-gray-900">{bus.routeNo}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Clock size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">{bus.departureTime}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(bus.status)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${bus.status === 'Active' ? 'bg-green-500' : bus.status === 'Maintenance' ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                                            {bus.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing 1-5 of {MOCK_BUSES.length} buses
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddBus;