import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import PassengerLayout from '../../components/passenger/PassengerLayout';
import { Search, MapPin, Navigation, Clock, Star, Filter, ArrowRight } from 'lucide-react';
import { routeService } from '../../services/passengerService';
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
    stops: number;
    frequency: string;
}

const SearchRoutes = () => {
    const navigate = useNavigate();
    const [startPoint, setStartPoint] = useState('');
    const [endPoint, setEndPoint] = useState('');
    const [searchResults, setSearchResults] = useState<BusRoute[]>([]);
    const [sortBy, setSortBy] = useState<'fare' | 'duration' | 'rating'>('rating');
    const [loading, setLoading] = useState(false);

    // Fetch all routes on component mount
    useEffect(() => {
        fetchAllRoutes();
    }, []);

    const fetchAllRoutes = async () => {
        setLoading(true);
        try {
            const response = await routeService.getAllRoutes();
            const routes = response.data.map((route: Route) => ({
                id: route._id,
                routeNo: route.routeNo,
                from: route.from,
                to: route.to,
                duration: route.duration,
                nextBus: '8 min',
                fare: `Rs. ${route.fare}`,
                rating: route.rating,
                stops: route.stops,
                frequency: route.frequency
            }));
            setSearchResults(routes);
        } catch (error) {
            console.error('Error fetching routes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await routeService.searchRoutes(startPoint, endPoint, sortBy);
            const routes = response.data.map((route: Route) => ({
                id: route._id,
                routeNo: route.routeNo,
                from: route.from,
                to: route.to,
                duration: route.duration,
                nextBus: '8 min',
                fare: `Rs. ${route.fare}`,
                rating: route.rating,
                stops: route.stops,
                frequency: route.frequency
            }));
            setSearchResults(routes);
        } catch (error) {
            console.error('Error searching routes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookSeats = (route: BusRoute) => {
        // Navigate to book seats page with route information
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
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Search Routes</h1>
                    <p className="text-gray-500 mt-1">Find the best bus routes for your journey</p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">From</label>
                            <MapPin size={18} className="absolute left-3 bottom-3 text-blue-600" />
                            <input
                                type="text"
                                placeholder="Starting point"
                                value={startPoint}
                                onChange={(e) => setStartPoint(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
                        <div className="relative">
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">To</label>
                            <Navigation size={18} className="absolute left-3 bottom-3 text-blue-600" />
                            <input
                                type="text"
                                placeholder="Destination"
                                value={endPoint}
                                onChange={(e) => setEndPoint(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Search size={20} />
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                        <Filter size={16} className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">Sort by:</span>
                        <div className="flex gap-2">
                            {(['rating', 'fare', 'duration'] as const).map((sort) => (
                                <button
                                    key={sort}
                                    onClick={() => {
                                        setSortBy(sort);
                                        handleSearch();
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                        sortBy === sort
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {sort.charAt(0).toUpperCase() + sort.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Available Routes ({searchResults.length})
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {searchResults.map((route) => (
                            <div 
                                key={route.id} 
                                className="p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:border-blue-200 border border-transparent transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <div 
                                        className="flex items-center gap-4 flex-1 cursor-pointer"
                                        onClick={() => handleBookSeats(route)}
                                    >
                                        <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                                            {route.routeNo}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-base font-bold text-gray-900">{route.from}</span>
                                                <ArrowRight size={18} className="text-gray-400" />
                                                <span className="text-base font-bold text-gray-900">{route.to}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {route.duration}
                                                </span>
                                                <span>{route.stops} stops</span>
                                                <span className="flex items-center gap-1">
                                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                    {route.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-2xl font-bold text-blue-600 mb-1">{route.fare}</div>
                                        <div className="text-xs text-gray-500">Next: {route.nextBus}</div>
                                        <div className="text-xs text-gray-400 mt-1">{route.frequency}</div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBookSeats(route);
                                            }}
                                            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                                        >
                                            Book Seats
                                        </button>
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

export default SearchRoutes;
