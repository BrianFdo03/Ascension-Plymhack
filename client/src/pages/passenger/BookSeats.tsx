import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import PassengerLayout from '../../components/passenger/PassengerLayout';
import { Bus, MapPin, Clock, Users, CheckCircle, XCircle, CreditCard, Accessibility, Calendar } from 'lucide-react';

interface Seat {
    id: string;
    number: number;
    status: 'available' | 'booked' | 'selected';
    type: 'window' | 'aisle' | 'middle';
    isAccessible?: boolean;
}

interface BusInfo {
    routeNo: string;
    from: string;
    to: string;
    date: string;
    time: string;
    fare: number;
    totalSeats: number;
    accessibleSeats: number;
}

const BUS_INFO: BusInfo = {
    routeNo: '138',
    from: 'Pettah',
    to: 'Homagama',
    date: '2026-02-08',
    time: '08:30 AM',
    fare: 50,
    totalSeats: 53,
    accessibleSeats: 4
};

const INITIAL_SEATS: Seat[] = Array.from({ length: 53 }, (_, i) => {
    const seatNumber = i + 1;
    const isBooked = [5, 8, 12, 15, 18, 23, 27, 31, 35, 40, 44].includes(seatNumber);
    const type = seatNumber % 4 === 1 || seatNumber % 4 === 0 ? 'window' : seatNumber % 4 === 2 ? 'aisle' : 'middle';
    // Wheelchair accessible seats at the front (seats 1, 2, 3, 4)
    const isAccessible = [1, 2, 3, 4].includes(seatNumber);
    
    return {
        id: `seat-${seatNumber}`,
        number: seatNumber,
        status: isBooked ? 'booked' : 'available',
        type,
        isAccessible
    };
});

const BookSeats = () => {
    const location = useLocation();
    const routeData = location.state as { routeNo?: string; from?: string; to?: string; fare?: number; duration?: string } | null;

    // Use route data from navigation or default values
    const [busInfo, setBusInfo] = useState<BusInfo>({
        routeNo: routeData?.routeNo || '138',
        from: routeData?.from || 'Pettah',
        to: routeData?.to || 'Homagama',
        date: '2026-02-08',
        time: '08:30 AM',
        fare: routeData?.fare || 50,
        totalSeats: 53,
        accessibleSeats: 4
    });

    const [seats, setSeats] = useState<Seat[]>(INITIAL_SEATS);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [accessibilityMode, setAccessibilityMode] = useState(false);
    const [selectedDate, setSelectedDate] = useState('2026-02-08');
    const [selectedTime, setSelectedTime] = useState('08:30 AM');

    // Available time slots
    const timeSlots = [
        '06:00 AM', '07:00 AM', '08:00 AM', '08:30 AM', '09:00 AM', '10:00 AM',
        '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    useEffect(() => {
        // Update bus info when route data changes
        if (routeData) {
            setBusInfo(prev => ({
                ...prev,
                routeNo: routeData.routeNo || prev.routeNo,
                from: routeData.from || prev.from,
                to: routeData.to || prev.to,
                fare: routeData.fare || prev.fare
            }));
        }
    }, [routeData]);

    useEffect(() => {
        // Update bus info when date or time changes
        setBusInfo(prev => ({
            ...prev,
            date: selectedDate,
            time: selectedTime
        }));
    }, [selectedDate, selectedTime]);

    const selectedSeats = seats.filter(seat => seat.status === 'selected');
    const availableSeats = seats.filter(seat => seat.status === 'available').length;
    const bookedSeats = seats.filter(seat => seat.status === 'booked').length;
    const accessibleSeatsAvailable = seats.filter(seat => seat.isAccessible && seat.status === 'available').length;
    const totalAmount = selectedSeats.length * busInfo.fare;

    const handleSeatClick = (seatId: string) => {
        setSeats(seats.map(seat => {
            if (seat.id === seatId && seat.status !== 'booked') {
                return {
                    ...seat,
                    status: seat.status === 'selected' ? 'available' : 'selected'
                };
            }
            return seat;
        }));
    };

    const getSeatColor = (seat: Seat) => {
        if (seat.isAccessible) {
            switch (seat.status) {
                case 'available':
                    return 'bg-purple-100 hover:bg-purple-200 border-purple-400 text-purple-700 cursor-pointer ring-2 ring-purple-300';
                case 'booked':
                    return 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed';
                case 'selected':
                    return 'bg-purple-600 border-purple-700 text-white cursor-pointer ring-2 ring-purple-400';
            }
        }
        
        switch (seat.status) {
            case 'available':
                return 'bg-green-100 hover:bg-green-200 border-green-300 text-green-700 cursor-pointer';
            case 'booked':
                return 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed';
            case 'selected':
                return 'bg-blue-600 border-blue-700 text-white cursor-pointer';
            default:
                return 'bg-gray-100';
        }
    };

    const handleBooking = () => {
        if (selectedSeats.length > 0) {
            setShowConfirmation(true);
        }
    };

    const confirmBooking = () => {
        alert(`Successfully booked ${selectedSeats.length} seat(s)!\nTotal: Rs. ${totalAmount}`);
        setSeats(seats.map(seat => 
            seat.status === 'selected' ? { ...seat, status: 'booked' } : seat
        ));
        setShowConfirmation(false);
    };

    return (
        <PassengerLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Book Your Seats</h1>
                    <p className="text-gray-500 mt-1">Select your preferred seats for the journey</p>
                </div>

                {/* Bus Info Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                <Bus size={32} className="text-white" />
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-1">Route {busInfo.routeNo}</div>
                                <div className="flex items-center gap-2 text-blue-100">
                                    <MapPin size={16} />
                                    <span className="font-semibold">{busInfo.from}</span>
                                    <span>→</span>
                                    <span className="font-semibold">{busInfo.to}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-blue-100 mb-1">Selected Time</div>
                            <div className="flex items-center gap-2 text-lg font-bold">
                                <Clock size={18} />
                                {busInfo.time}
                            </div>
                            <div className="text-sm text-blue-100 mt-1">
                                {new Date(busInfo.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Date and Time Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <div>
                            <label className="block text-sm font-semibold text-blue-100 mb-2">Select Date</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/50 transition-all outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-blue-100 mb-2">Select Time</label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" />
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/20 border border-white/30 rounded-lg text-white focus:bg-white/30 focus:border-white focus:ring-2 focus:ring-white/50 transition-all outline-none appearance-none"
                                >
                                    {timeSlots.map((time) => (
                                        <option key={time} value={time} className="bg-blue-700 text-white">
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accessibility Toggle */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Accessibility size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Accessibility Features</h3>
                                <p className="text-sm text-gray-500">Wheelchair accessible seats available</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setAccessibilityMode(!accessibilityMode)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                accessibilityMode
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {accessibilityMode ? 'Accessibility Mode ON' : 'Enable Accessibility Mode'}
                        </button>
                    </div>
                    {accessibilityMode && (
                        <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                            <div className="flex items-start gap-3">
                                <Accessibility size={20} className="text-purple-600 mt-0.5" />
                                <div className="flex-1">
                                    <h4 className="font-semibold text-purple-900 mb-1">Accessible Seats Available</h4>
                                    <p className="text-sm text-purple-700 mb-2">
                                        {accessibleSeatsAvailable} wheelchair accessible seats are available at the front of the bus with extra space and easy access.
                                    </p>
                                    <ul className="text-sm text-purple-700 space-y-1">
                                        <li>• Priority boarding assistance</li>
                                        <li>• Wheelchair ramps available</li>
                                        <li>• Extra legroom and space</li>
                                        <li>• Located near the entrance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Seat Selection - Centered */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Select Your Seats</h2>
                            <p className="text-gray-500 text-center mb-6">Click on available seats to select them</p>
                            
                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 border-2 border-green-300 rounded-lg"></div>
                                    <span className="text-sm font-medium text-gray-700">Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-600 border-2 border-blue-700 rounded-lg"></div>
                                    <span className="text-sm font-medium text-gray-700">Selected</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gray-300 border-2 border-gray-400 rounded-lg"></div>
                                    <span className="text-sm font-medium text-gray-700">Booked</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-purple-100 border-2 border-purple-400 rounded-lg ring-2 ring-purple-300 flex items-center justify-center">
                                        <Accessibility size={16} className="text-purple-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Accessible</span>
                                </div>
                            </div>

                            {/* Driver Section */}
                            <div className="mb-8 flex justify-center">
                                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-lg">
                                    <Users size={20} />
                                    <span>Driver</span>
                                </div>
                            </div>

                            {/* Bus Frame */}
                            <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-3xl p-6 border-4 border-gray-300 shadow-inner">
                                {/* Seats Grid */}
                                <div className="space-y-3">
                                    {/* Regular rows (4 seats per row) */}
                                    {Array.from({ length: 12 }, (_, rowIndex) => (
                                        <div key={rowIndex} className="flex items-center justify-center gap-3">
                                            {/* Left side seats (2 seats) */}
                                            <div className="flex gap-2">
                                                {seats.slice(rowIndex * 4, rowIndex * 4 + 2).map((seat) => (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(seat.id)}
                                                        disabled={seat.status === 'booked'}
                                                        className={`relative w-14 h-14 rounded-xl border-2 font-bold text-sm transition-all ${getSeatColor(seat)} ${
                                                            seat.status !== 'booked' ? 'hover:scale-110 hover:shadow-lg' : ''
                                                        }`}
                                                        title={seat.isAccessible ? 'Wheelchair Accessible Seat' : `Seat ${seat.number}`}
                                                    >
                                                        {seat.isAccessible && (
                                                            <Accessibility size={14} className="absolute top-0.5 right-0.5" />
                                                        )}
                                                        {seat.number}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Aisle */}
                                            <div className="w-12 border-l-2 border-r-2 border-dashed border-gray-300 h-14 flex items-center justify-center">
                                                <div className="text-xs text-gray-400 font-semibold rotate-90">AISLE</div>
                                            </div>

                                            {/* Right side seats (2 seats) */}
                                            <div className="flex gap-2">
                                                {seats.slice(rowIndex * 4 + 2, rowIndex * 4 + 4).map((seat) => (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(seat.id)}
                                                        disabled={seat.status === 'booked'}
                                                        className={`relative w-14 h-14 rounded-xl border-2 font-bold text-sm transition-all ${getSeatColor(seat)} ${
                                                            seat.status !== 'booked' ? 'hover:scale-110 hover:shadow-lg' : ''
                                                        }`}
                                                        title={seat.isAccessible ? 'Wheelchair Accessible Seat' : `Seat ${seat.number}`}
                                                    >
                                                        {seat.isAccessible && (
                                                            <Accessibility size={14} className="absolute top-0.5 right-0.5" />
                                                        )}
                                                        {seat.number}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Last row with 5 seats (49, 50, 51, 52, 53) - No aisle */}
                                    <div className="flex items-center justify-center gap-3 pt-4 mt-4 border-t-2 border-gray-300">
                                        <div className="flex gap-2">
                                            {seats.slice(48, 53).map((seat) => (
                                                <button
                                                    key={seat.id}
                                                    onClick={() => handleSeatClick(seat.id)}
                                                    disabled={seat.status === 'booked'}
                                                    className={`relative w-14 h-14 rounded-xl border-2 font-bold text-sm transition-all ${getSeatColor(seat)} ${
                                                        seat.status !== 'booked' ? 'hover:scale-110 hover:shadow-lg' : ''
                                                    }`}
                                                    title={`Seat ${seat.number} - Back Row`}
                                                >
                                                    {seat.number}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Back of Bus Label */}
                            <div className="text-center mt-4">
                                <span className="text-sm font-semibold text-gray-500">← Back of Bus →</span>
                            </div>
                        </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="space-y-4">
                        {/* Stats */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Seat Availability</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={18} className="text-green-600" />
                                        <span className="font-medium text-gray-700">Available</span>
                                    </div>
                                    <span className="font-bold text-green-600">{availableSeats}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <XCircle size={18} className="text-red-600" />
                                        <span className="font-medium text-gray-700">Booked</span>
                                    </div>
                                    <span className="font-bold text-red-600">{bookedSeats}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Users size={18} className="text-blue-600" />
                                        <span className="font-medium text-gray-700">Selected</span>
                                    </div>
                                    <span className="font-bold text-blue-600">{selectedSeats.length}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2">
                                        <Accessibility size={18} className="text-purple-600" />
                                        <span className="font-medium text-gray-700">Accessible</span>
                                    </div>
                                    <span className="font-bold text-purple-600">{accessibleSeatsAvailable}</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>
                            
                            {selectedSeats.length > 0 ? (
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-sm text-gray-500 mb-2">Selected Seats</div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSeats.map(seat => (
                                                <span key={seat.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm">
                                                    {seat.number}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Fare per seat</span>
                                            <span className="font-semibold">Rs. {busInfo.fare}</span>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-600">Number of seats</span>
                                            <span className="font-semibold">{selectedSeats.length}</span>
                                        </div>
                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                            <span className="text-2xl font-bold text-blue-600">Rs. {totalAmount}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <CreditCard size={20} />
                                        Proceed to Payment
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users size={48} className="text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">Select seats to continue</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h3>
                            <p className="text-gray-500">Please review your booking details</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="text-sm text-gray-500 mb-1">Route</div>
                                <div className="font-bold text-gray-900">{busInfo.from} → {busInfo.to}</div>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="text-sm text-gray-500 mb-1">Seats</div>
                                <div className="font-bold text-gray-900">
                                    {selectedSeats.map(s => s.number).join(', ')}
                                </div>
                            </div>
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="text-sm text-blue-600 mb-1">Total Amount</div>
                                <div className="text-2xl font-bold text-blue-600">Rs. {totalAmount}</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmBooking}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PassengerLayout>
    );
};

export default BookSeats;
