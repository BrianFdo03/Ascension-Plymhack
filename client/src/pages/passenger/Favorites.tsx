import { useState } from 'react';
import PassengerLayout from '../../components/passenger/PassengerLayout';
import { Heart, MapPin, Clock, Star, Trash2, Plus } from 'lucide-react';

interface FavoriteRoute {
    id: string;
    routeNo: string;
    from: string;
    to: string;
    duration: string;
    fare: string;
    rating: number;
    savedDate: string;
}

const FAVORITE_ROUTES: FavoriteRoute[] = [
    { id: '1', routeNo: '138', from: 'Pettah', to: 'Homagama', duration: '45 min', fare: 'Rs. 50', rating: 4.5, savedDate: '2026-01-15' },
    { id: '2', routeNo: '01', from: 'Colombo', to: 'Kandy', duration: '3 hrs', fare: 'Rs. 250', rating: 4.8, savedDate: '2026-01-20' },
];

const Favorites = () => {
    const [favorites, setFavorites] = useState<FavoriteRoute[]>(FAVORITE_ROUTES);

    const handleRemove = (id: string) => {
        setFavorites(favorites.filter(fav => fav.id !== id));
    };

    return (
        <PassengerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Favorite Routes</h1>
                        <p className="text-gray-500 mt-1">Quick access to your frequently used routes</p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all">
                        <Plus size={18} />
                        Add Favorite
                    </button>
                </div>

                {/* Favorites List */}
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favorites.map((route) => (
                            <div key={route.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-xl flex items-center justify-center font-bold">
                                            {route.routeNo}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1 text-sm">
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold text-gray-700">{route.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(route.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-600" />
                                        <span className="font-bold text-gray-900">{route.from}</span>
                                        <span className="text-gray-400">→</span>
                                        <span className="font-bold text-gray-900">{route.to}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <Clock size={14} />
                                            {route.duration}
                                        </div>
                                        <div className="text-lg font-bold text-blue-600">{route.fare}</div>
                                    </div>

                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
                                        Track Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Heart size={64} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Favorites Yet</h3>
                        <p className="text-gray-500 mb-6">Start adding your frequently used routes to favorites</p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                            Browse Routes
                        </button>
                    </div>
                )}

                {/* Quick Stats */}
                <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart size={24} className="fill-white" />
                        <h2 className="text-xl font-bold">Favorites Stats</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <div className="text-3xl font-bold">{favorites.length}</div>
                            <div className="text-sm opacity-90">Saved Routes</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">
                                {favorites.reduce((sum, route) => sum + parseFloat(route.rating), 0) / favorites.length || 0}
                            </div>
                            <div className="text-sm opacity-90">Avg Rating</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">
                                Rs. {Math.round(favorites.reduce((sum, route) => sum + parseInt(route.fare.replace(/\D/g, '')), 0) / favorites.length) || 0}
                            </div>
                            <div className="text-sm opacity-90">Avg Fare</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold">
                                {Math.round(favorites.reduce((sum, route) => sum + parseInt(route.duration), 0) / favorites.length) || 0}m
                            </div>
                            <div className="text-sm opacity-90">Avg Duration</div>
                        </div>
                    </div>
                </div>
            </div>
        </PassengerLayout>
    );
};

export default Favorites;
