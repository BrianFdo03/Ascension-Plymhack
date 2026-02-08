const Booking = require('../../models/Booking');
const Route = require('../../models/Route');
const Notification = require('../../models/Notification');

// Create new booking
exports.createBooking = async (req, res) => {
    try {
        const { routeId, routeNo, from, to, date, time, seats, fare } = req.body;
        const passengerId = req.user.id; // Assuming auth middleware sets req.user
        
        // Validate route exists
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }
        
        // Calculate total amount
        const totalSeats = seats.length;
        const totalAmount = totalSeats * fare;
        
        // Create booking
        const booking = await Booking.create({
            passengerId,
            routeId,
            routeNo,
            from,
            to,
            date,
            time,
            seats,
            totalSeats,
            fare,
            totalAmount,
            status: 'upcoming',
            paymentStatus: 'pending'
        });
        
        // Send notification to passenger
        const notification = await Notification.create({
            recipientType: 'passenger',
            recipientId: passengerId,
            title: 'Booking Confirmed',
            message: `Your booking for Route ${routeNo} from ${from} to ${to} has been confirmed. ${totalSeats} seat(s) booked.`,
            type: 'success',
            priority: 'high',
            data: {
                bookingId: booking._id,
                routeNo,
                from,
                to,
                date,
                time,
                seats,
                totalAmount
            }
        });

        // Emit real-time notification via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.to(passengerId).emit('new_notification', notification);
        }
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get all bookings for a passenger
exports.getPassengerBookings = async (req, res) => {
    try {
        const passengerId = req.user.id;
        
        const bookings = await Booking.find({ passengerId })
            .populate('routeId')
            .sort({ date: -1, createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// Get upcoming bookings
exports.getUpcomingBookings = async (req, res) => {
    try {
        const passengerId = req.user.id;
        const currentDate = new Date();
        
        const bookings = await Booking.find({
            passengerId,
            status: 'upcoming',
            date: { $gte: currentDate }
        })
        .populate('routeId')
        .sort({ date: 1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching upcoming bookings',
            error: error.message
        });
    }
};

// Get past bookings
exports.getPastBookings = async (req, res) => {
    try {
        const passengerId = req.user.id;
        const currentDate = new Date();
        
        const bookings = await Booking.find({
            passengerId,
            $or: [
                { status: 'completed' },
                { status: 'cancelled' },
                { date: { $lt: currentDate } }
            ]
        })
        .populate('routeId')
        .sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching past bookings',
            error: error.message
        });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('routeId')
            .populate('passengerId', 'name email phone');
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if booking belongs to the user
        if (booking.passengerId._id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this booking'
            });
        }
        
        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if booking belongs to the user
        if (booking.passengerId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }
        
        // Check if booking can be cancelled
        if (booking.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed booking'
            });
        }
        
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking already cancelled'
            });
        }
        
        booking.status = 'cancelled';
        await booking.save();
        
        // Send cancellation notification
        const notification = await Notification.create({
            recipientType: 'passenger',
            recipientId: booking.passengerId.toString(),
            title: 'Booking Cancelled',
            message: `Your booking for Route ${booking.routeNo} has been cancelled successfully.`,
            type: 'info',
            priority: 'medium',
            data: {
                bookingId: booking._id,
                routeNo: booking.routeNo
            }
        });

        // Emit real-time notification
        const io = req.app.get('io');
        if (io) {
            io.to(booking.passengerId.toString()).emit('new_notification', notification);
        }
        
        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        booking.paymentStatus = paymentStatus;
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating payment status',
            error: error.message
        });
    }
};

// Get booking statistics
exports.getBookingStats = async (req, res) => {
    try {
        const passengerId = req.user.id;
        
        const totalBookings = await Booking.countDocuments({ passengerId });
        const completedBookings = await Booking.countDocuments({ 
            passengerId, 
            status: 'completed' 
        });
        const upcomingBookings = await Booking.countDocuments({ 
            passengerId, 
            status: 'upcoming',
            date: { $gte: new Date() }
        });
        const cancelledBookings = await Booking.countDocuments({ 
            passengerId, 
            status: 'cancelled' 
        });
        
        res.status(200).json({
            success: true,
            data: {
                total: totalBookings,
                completed: completedBookings,
                upcoming: upcomingBookings,
                cancelled: cancelledBookings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking statistics',
            error: error.message
        });
    }
};
