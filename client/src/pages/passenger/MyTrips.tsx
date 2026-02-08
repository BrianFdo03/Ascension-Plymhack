import { useEffect, useState } from 'react';
import PassengerLayout from '../../components/passenger/PassengerLayout';
import { Clock, MapPin, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { bookingService } from '../../services/passengerService';
import type { Booking } from '../../services/passengerService';

interface Trip {
    id: string;
    routeNo: string;
    from: string;
    to: string;
    date: string;
    time: string;
    fare: string;
    status: 'completed' | 'cancelled' | 'upcoming';
}

const MyTrips = () => {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getAllBookings();
            const bookings = response.data.map((booking: Booking) => ({
                id: booking._id,
                routeNo: booking.routeNo,
                from: booking.from,
                to: booking.to,
                date: booking.date,
                time: booking.time,
                fare: `Rs. ${booking.totalAmount}`,
                status: booking.status
            }));
            setTrips(bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // If API fails, show empty state
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle size={14} />
                        Completed
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                        <XCircle size={14} />
                        Cancelled
                    </span>
                );
            case 'upcoming':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        <AlertCircle size={14} />
                        Upcoming
                    </span>
                );
        }
    };

    const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
    const pastTrips = trips.filter(trip => trip.status !== 'upcoming');

    if (loading) {
        return (
            <PassengerLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading trips...</div>
                </div>
            </PassengerLayout>
        );
    }

    return (
        <PassengerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
                    <p className="text-gray-500 mt-1">View your upcoming and past journeys</p>
                </div>

                {/* Upcoming Trips */}
                {upcomingTrips.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Trips</h2>
                        <div className="space-y-3">
                            {upcomingTrips.map((trip) => (
                                <div key={trip.id} className="p-5 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-200 hover:shadow-md transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                {trip.routeNo}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-bold text-gray-900">{trip.from}</span>
                                                    <span className="text-gray-400">→</span>
                                                    <span className="font-bold text-gray-900">{trip.to}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {trip.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <div className="text-xl font-bold text-blue-600 mb-2">{trip.fare}</div>
                                            {getStatusBadge(trip.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Trips */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Past Trips</h2>
                    <div className="space-y-3">
                        {pastTrips.map((trip) => (
                            <div key={trip.id} className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-14 h-14 bg-gray-300 text-gray-700 rounded-xl flex items-center justify-center font-bold text-lg">
                                            {trip.routeNo}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-bold text-gray-900">{trip.from}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="font-bold text-gray-900">{trip.to}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(trip.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {trip.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right ml-4">
                                        <div className="text-xl font-bold text-gray-600 mb-2">{trip.fare}</div>
                                        {getStatusBadge(trip.status)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <MapPin size={24} />
                            <span className="text-sm font-medium opacity-90">Total Trips</span>
                        </div>
                        <div className="text-4xl font-bold">{trips.length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle size={24} />
                            <span className="text-sm font-medium opacity-90">Completed</span>
                        </div>
                        <div className="text-4xl font-bold">{trips.filter(t => t.status === 'completed').length}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock size={24} />
                            <span className="text-sm font-medium opacity-90">Upcoming</span>
                        </div>
                        <div className="text-4xl font-bold">{upcomingTrips.length}</div>
                    </div>
                </div>
            </div>
        </PassengerLayout>
    );
};

export default MyTrips;
