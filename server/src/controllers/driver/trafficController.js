const TrafficAlert = require('../../models/TrafficAlert');
const Bus = require('../../models/Bus');
const Notification = require('../../models/Notification');

// Get traffic alerts for driver's route
exports.getRouteTrafficAlerts = async (req, res) => {
    try {
        const driverId = req.user.id;
        
        const bus = await Bus.findOne({ driverId, isActive: true });
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }
        
        const alerts = await TrafficAlert.find({
            routeIds: bus.routeId,
            isActive: true
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching traffic alerts',
            error: error.message
        });
    }
};

// Report traffic alert
exports.reportTrafficAlert = async (req, res) => {
    try {
        const { location, coordinates, severity, description } = req.body;
        const driverId = req.user.id;
        
        const bus = await Bus.findOne({ driverId, isActive: true });
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'No active bus found'
            });
        }
        
        const alert = await TrafficAlert.create({
            location,
            coordinates,
            severity,
            description,
            routeIds: [bus.routeId],
            reportedBy: driverId,
            isActive: true
        });
        
        // Send notification to all drivers and passengers on affected routes
        const notificationTitle = severity === 'high' ? '⚠️ High Traffic Alert' : 
                                 severity === 'medium' ? 'Traffic Alert' : 'Traffic Update';
        
        const notification = await Notification.create({
            recipientType: 'all',
            title: notificationTitle,
            message: `Traffic reported at ${location}. ${description || 'Please plan accordingly.'}`,
            type: severity === 'high' ? 'warning' : 'info',
            priority: severity === 'high' ? 'high' : 'medium',
            data: {
                alertId: alert._id,
                location,
                coordinates,
                severity,
                routeIds: alert.routeIds
            }
        });

        // Emit real-time notification
        const io = req.app.get('io');
        if (io) {
            io.emit('new_notification', notification);
        }
        
        res.status(201).json({
            success: true,
            message: 'Traffic alert reported successfully',
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reporting traffic alert',
            error: error.message
        });
    }
};

// Get all traffic alerts
exports.getAllTrafficAlerts = async (req, res) => {
    try {
        const alerts = await TrafficAlert.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching traffic alerts',
            error: error.message
        });
    }
};

// Update traffic alert status
exports.updateAlertStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        const alert = await TrafficAlert.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );
        
        if (!alert) {
            return res.status(404).json({
                success: false,
                message: 'Traffic alert not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Alert status updated',
            data: alert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating alert status',
            error: error.message
        });
    }
};
