const Bus = require('../../models/Bus');
const Booking = require('../../models/Booking');

// Get driver's bus details
exports.getDriverBus = async (req, res) => {
    try {
        const driverId = req.user.id;
        
        const bus = await Bus.findOne({ driverId, isActive: true })
            .populate('routeId');
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus assigned to this driver'
            });
        }
        
        res.status(200).json({
            success: true,
            data: bus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bus details',
            error: error.message
        });
    }
};

// Get booked seats for driver's bus
exports.getBookedSeats = async (req, res) => {
    try {
        const driverId = req.user.id;
        
        // Find driver's bus
        const bus = await Bus.findOne({ driverId, isActive: true });
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }
        
        // Get today's bookings for this bus
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const bookings = await Booking.find({
            routeId: bus.routeId,
            date: { $gte: today },
            status: { $in: ['upcoming', 'confirmed'] }
        })
        .populate('passengerId', 'name phone')
        .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booked seats',
            error: error.message
        });
    }
};

// Update bus location
exports.updateBusLocation = async (req, res) => {
    try {
        const driverId = req.user.id;
        const { lat, lng, speed } = req.body;
        
        const bus = await Bus.findOne({ driverId, isActive: true });
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }
        
        // Update live bus location
        const LiveBus = require('../../models/LiveBus');
        
        let liveBus = await LiveBus.findOne({ busNumber: bus.numberPlate });
        
        if (!liveBus) {
            liveBus = new LiveBus({
                routeId: bus.routeId,
                routeNo: bus.routeNo,
                busNumber: bus.numberPlate,
                driverId: driverId,
                currentLocation: {
                    coordinates: { lat, lng }
                },
                speed: speed || '0 km/h',
                passengers: bus.bookedSeats,
                capacity: bus.totalSeats,
                isActive: true
            });
        } else {
            liveBus.currentLocation.coordinates = { lat, lng };
            liveBus.speed = speed || liveBus.speed;
            liveBus.passengers = bus.bookedSeats;
            liveBus.lastUpdated = new Date();
        }
        
        await liveBus.save();
        
        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            data: liveBus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating location',
            error: error.message
        });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const driverId = req.user.id;
        
        const bus = await Bus.findOne({ driverId, isActive: true })
            .populate('routeId');
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }
        
        // Get today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const bookingsCount = await Booking.countDocuments({
            routeId: bus.routeId,
            date: { $gte: today },
            status: { $in: ['upcoming', 'confirmed'] }
        });
        
        const stats = {
            bus: {
                numberPlate: bus.numberPlate,
                route: `${bus.routeId.from} - ${bus.routeId.to}`,
                routeNo: bus.routeNo,
                departureTime: bus.departureTime,
                totalSeats: bus.totalSeats,
                bookedSeats: bookingsCount
            },
            availableSeats: bus.totalSeats - bookingsCount,
            totalPassengers: bookingsCount
        };
        
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};
