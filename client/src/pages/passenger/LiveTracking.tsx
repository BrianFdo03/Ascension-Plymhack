import { useState, useEffect } from 'react';
import PassengerLayout from '../../components/passenger/PassengerLayout';
import { MapPin, Bus, Clock, Users, TrendingUp } from 'lucide-react';
import GoogleMap from '../../components/common/GoogleMap';
import { trackingService } from '../../services/passengerService';

interface LiveBus {
    id: string;
    routeNo: string;
    currentLocation: string;
    nextStop: string;
    eta: string;
    passengers: number;
    capacity: number;
    speed: string;
}

const LiveTracking = () => {
    const [selectedRoute, setSelectedRoute] = useState<string>('');
    const [liveBuses, setLiveBuses] = useState<LiveBus[]>([]);
    const [busLocations, setBusLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLiveBuses();
        fetchBusLocations();
    }, []);

    const fetchLiveBuses = async () => {
        setLoading(true);
        try {
            const response = await trackingService.getAllLiveBuses();
            const buses = response.data.map((bus: any) => ({
                id: bus._id,
                routeNo: bus.routeNo,
                currentLocation: bus.currentLocation?.name || 'Unknown',
                nextStop: bus.nextStop || 'Unknown',
                eta: bus.eta || 'N/A',
                passengers: bus.passengers || 0,
                capacity: bus.capacity || 50,
                speed: bus.speed || '0 km/h'
            }));
            setLiveBuses(buses);
        } catch (error) {
            console.error('Error fetching live buses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBusLocations = async () => {
        try {
            const response = await trackingService.getBusLocations();
            const locations = response.data.map((bus: any) => ({
                lat: bus.lat,
                lng: bus.lng,
                label: bus.label
            }));
            setBusLocations(locations);
        } catch (error) {
            console.error('Error fetching bus locations:', error);
        }
    };

    const getOccupancyColor = (passengers: number, capacity: number) => {
        const percentage = (passengers / capacity) * 100;
        if (percentage >= 80) return 'text-red-600 bg-red-50';
        if (percentage >= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

    return (
        <PassengerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Live Bus Tracking</h1>
                    <p className="text-gray-500 mt-1">Track buses in real-time and see their current locations</p>
                </div>

                {/* Map Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Live Map</h2>
                                <p className="text-sm text-gray-500 mt-1">Real-time bus locations</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedRoute}
                                    onChange={(e) => setSelectedRoute(e.target.value)}
                                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                >
                                    <option value="">All Routes</option>
                                    <option value="138">Route 138</option>
                                    <option value="01">Route 01</option>
                                    <option value="87">Route 87</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <GoogleMap
                        center={{ lat: 6.9271, lng: 79.8612 }}
                        markers={busLocations.length > 0 ? busLocations : [{ lat: 6.9271, lng: 79.8612, label: 'Colombo' }]}
                        zoom={12}
                        height="500px"
                    />
                </div>

                {/* Live Buses List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Bus size={20} className="text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Buses on Route</h2>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading buses...</div>
                        ) : liveBuses.length > 0 ? (
                            liveBuses.map((bus) => (
                            <div key={bus.id} className="p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                            {bus.routeNo}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MapPin size={16} className="text-blue-600" />
                                                <span className="font-bold text-gray-900">{bus.currentLocation}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="text-gray-700">{bus.nextStop}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    ETA: {bus.eta}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp size={14} />
                                                    {bus.speed}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className={`px-4 py-2 rounded-lg font-semibold ${getOccupancyColor(bus.passengers, bus.capacity)}`}>
                                            <div className="flex items-center gap-2">
                                                <Users size={16} />
                                                <span>{bus.passengers}/{bus.capacity}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {Math.round((bus.passengers / bus.capacity) * 100)}% Full
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">No buses available</div>
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Occupancy Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div>
                                <div className="font-semibold text-green-700">Available</div>
                                <div className="text-xs text-green-600">Less than 50% full</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div>
                                <div className="font-semibold text-yellow-700">Moderate</div>
                                <div className="text-xs text-yellow-600">50% - 80% full</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div>
                                <div className="font-semibold text-red-700">Crowded</div>
                                <div className="text-xs text-red-600">More than 80% full</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PassengerLayout>
    );
};

export default LiveTracking;
