import { useState } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { Users, MapPin, Phone, Search } from 'lucide-react';

interface BookedSeat {
    id: string;
    seatNumber: string;
    passengerName: string;
    phone: string;
    from: string;
    to: string;
    fare: number;
    bookingTime: string;
    status: 'confirmed' | 'boarded' | 'completed';
}

const BookedSeats = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const bookedSeats: BookedSeat[] = [
        { 
            id: '1', 
            seatNumber: 'A1', 
            passengerName: 'Kamal Perera', 
            phone: '0771234567', 
            from: 'Pettah', 
            to: 'Nugegoda', 
            fare: 50,
            bookingTime: '08:15 AM',
            status: 'confirmed'
        },
        { 
            id: '2', 
            seatNumber: 'A2', 
            passengerName: 'Nimal Silva', 
            phone: '0779876543', 
            from: 'Borella', 
            to: 'Homagama', 
            fare: 80,
            bookingTime: '08:20 AM',
            status: 'boarded'
        },
        { 
            id: '3', 
            seatNumber: 'B1', 
            passengerName: 'Sunil Fernando', 
            phone: '0765432109', 
            from: 'Pettah', 
            to: 'Maharagama', 
            fare: 70,
            bookingTime: '08:25 AM',
            status: 'confirmed'
        },
        { 
            id: '4', 
            seatNumber: 'B2', 
            passengerName: 'Amara Jayasinghe', 
            phone: '0712345678', 
            from: 'Kotte', 
            to: 'Homagama', 
            fare: 60,
            bookingTime: '08:30 AM',
            status: 'confirmed'
        },
        { 
            id: '5', 
            seatNumber: 'C1', 
            passengerName: 'Priya Wickramasinghe', 
            phone: '0778889999', 
            from: 'Pettah', 
            to: 'Kotte', 
            fare: 40,
            bookingTime: '08:35 AM',
            status: 'boarded'
        },
    ];

    const filteredSeats = bookedSeats.filter(seat => {
        const matchesSearch = 
            seat.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seat.seatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            seat.phone.includes(searchQuery);
        
        const matchesFilter = filterStatus === 'all' || seat.status === filterStatus;
        
        return matchesSearch && matchesFilter;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'boarded':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'completed':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmed';
            case 'boarded':
                return 'Boarded';
            case 'completed':
                return 'Completed';
            default:
                return status;
        }
    };

    return (
        <DriverLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Booked Seats</h1>
                    <p className="text-gray-500 mt-1">View all passenger bookings for your current trip</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{bookedSeats.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Users size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Boarded</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookedSeats.filter(s => s.status === 'boarded').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Users size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookedSeats.filter(s => s.status === 'confirmed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, seat, or phone..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    filterStatus === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('confirmed')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    filterStatus === 'confirmed'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Confirmed
                            </button>
                            <button
                                onClick={() => setFilterStatus('boarded')}
                                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    filterStatus === 'boarded'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Boarded
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Seat</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Passenger</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Route</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Fare</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Booking Time</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSeats.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            No bookings found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSeats.map((seat) => (
                                        <tr key={seat.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-700 font-bold rounded-lg">
                                                    {seat.seatNumber}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{seat.passengerName}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <Phone size={14} className="text-gray-400" />
                                                    {seat.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-700">
                                                    <MapPin size={14} className="text-gray-400" />
                                                    <span className="text-sm">{seat.from} → {seat.to}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-900">Rs. {seat.fare}</span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700 text-sm">
                                                {seat.bookingTime}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(seat.status)}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        seat.status === 'confirmed' ? 'bg-blue-500' :
                                                        seat.status === 'boarded' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`} />
                                                    {getStatusLabel(seat.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default BookedSeats;
