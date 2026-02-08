import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PassengerLayout from '../../components/passenger/PassengerLayout';
import { Search, MapPin, Clock, Navigation, TrendingUp, Star } from 'lucide-react';
import GoogleMap from '../../components/common/GoogleMap';
import { routeService, trackingService } from '../../services/passengerService';
import type { Route } from '../../services/passengerService';

interface BusRoute {
    id: string;
    routeNo: string;
    from: string;
    to: string;
    duration: string;
    nextBus: string;
    fare: string;
    rating: number;
}

const PassengerDashboard = () => {
    const navigate = useNavigate();
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [searchResults, setSearchResults] = useState<BusRoute[]>([]);
    const [popularRoutes, setPopularRoutes] = useState<BusRoute[]>([]);
    const [busLocations, setBusLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch popular routes on component mount
    useEffect(() => {
        fetchPopularRoutes();
        fetchBusLocations();
    }, []);

    const fetchPopularRoutes = async () => {
        try {
            const response = await routeService.getPopularRoutes();
            const routes = response.data.map((route: Route) => ({
                id: route._id,
                routeNo: route.routeNo,
                from: route.from,
                to: route.to,
                duration: route.duration,
                nextBus: '5 min', // This should come from live bus data
                fare: `Rs. ${route.fare}`,
                rating: route.rating
            }));
            setPopularRoutes(routes);
        } catch (error) {
            console.error('Error fetching popular routes:', error);
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

    const handleSearch = async () => {
        if (startPoint || endPoint) {
            setLoading(true);
            try {
                const response = await routeService.searchRoutes(startPoint, endPoint, 'rating');
                const routes = response.data.map((route: Route) => ({
                    id: route._id,
                    routeNo: route.routeNo,
                    from: route.from,
                    to: route.to,
                    duration: route.duration,
                    nextBus: '5 min',
                    fare: `Rs. ${route.fare}`,
                    rating: route.rating
                }));
                setSearchResults(routes);
            } catch (error) {
                console.error('Error searching routes:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleBookSeats = (route: BusRoute) => {
        navigate('/passenger/book-seats', { 
            state: { 
                routeNo: route.routeNo,
                from: route.from,
                to: route.to,
                fare: parseInt(route.fare.replace(/\D/g, '')),
                duration: route.duration
            } 
        });
    };

    return (
        <PassengerLayout>
            <div className="space-y-6">
                {/* Hero Section with Search - Centered */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Find Your Perfect Journey</h1>
                        <p className="text-lg text-blue-100 mb-6">Search for bus routes and track them in real-time</p>
                        
                        {/* Search Form - Centered */}
                        <div className="bg-white rounded-2xl p-5 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div className="relative group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-left">Starting Point</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:text-blue-700 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g., Pettah, Colombo"
                                            value={startPoint}
                                            onChange={(e) => setStartPoint(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-left">Destination</label>
                                    <div className="relative">
                                        <Navigation size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 group-focus-within:text-blue-700 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="e.g., Homagama, Kandy"
                                            value={endPoint}
                                            onChange={(e) => setEndPoint(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Search size={22} />
                                <span className="text-base">{loading ? 'Searching...' : 'Search Routes'}</span>
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 mt-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <div className="text-2xl font-bold mb-0.5">50+</div>
                                <div className="text-xs text-blue-100">Active Routes</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <div className="text-2xl font-bold mb-0.5">200+</div>
                                <div className="text-xs text-blue-100">Daily Buses</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                                <div className="text-2xl font-bold mb-0.5">4.8★</div>
                                <div className="text-xs text-blue-100">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Routes</h2>
                        <div className="space-y-3">
                            {searchResults.map((route) => (
                                <div 
                                    key={route.id} 
                                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div 
                                            className="flex items-center gap-4 flex-1 cursor-pointer"
                                            onClick={() => handleBookSeats(route)}
                                        >
                                            <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                                                {route.routeNo}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                                    {route.from} <span className="text-gray-400">→</span> {route.to}
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {route.duration}
                                                    </span>
                                                    <span>Next bus: {route.nextBus}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-blue-600">{route.fare}</div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                                {route.rating}
                                            </div>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBookSeats(route);
                                                }}
                                                className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all"
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Google Map */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Live Bus Tracking</h2>
                                <p className="text-sm text-gray-500 mt-1">Track buses in real-time on the map</p>
                            </div>
                            <button
                                onClick={() => navigate('/passenger/tracking')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                View Full Map
                            </button>
                        </div>
                    </div>
                    <GoogleMap
                        center={{ lat: 6.9271, lng: 79.8612 }}
                        markers={busLocations.length > 0 ? busLocations : [{ lat: 6.9271, lng: 79.8612, label: 'Colombo' }]}
                        zoom={12}
                        height="400px"
                    />
                </div>

                {/* Popular Routes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={20} className="text-blue-600" />
                        <h2 className="text-xl font-bold text-gray-900">Popular Routes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {popularRoutes.map((route) => (
                            <div 
                                key={route.id} 
                                onClick={() => handleBookSeats(route)}
                                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl font-bold text-blue-600">#{route.routeNo}</span>
                                    <div className="flex items-center gap-1 text-sm">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold text-gray-700">{route.rating}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                                        {route.from} <span className="text-gray-400">→</span> {route.to}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} />
                                            {route.duration}
                                        </span>
                                        <span className="font-bold text-blue-600">{route.fare}</span>
                                    </div>
                                    <div className="pt-2 border-t border-blue-200">
                                        <span className="text-xs text-gray-600">Next bus in: <span className="font-semibold text-blue-600">{route.nextBus}</span></span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PassengerLayout>
    );
};

export default PassengerDashboard;
