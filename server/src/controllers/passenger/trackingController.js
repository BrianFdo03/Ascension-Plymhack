const LiveBus = require('../../models/LiveBus');
const Route = require('../../models/Route');

// Get all live buses
exports.getAllLiveBuses = async (req, res) => {
    try {
        const buses = await LiveBus.find({ isActive: true })
            .populate('routeId')
            .populate('driverId', 'name phone')
            .sort({ lastUpdated: -1 });
        
        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching live buses',
            error: error.message
        });
    }
};

// Get live buses by route
exports.getLiveBusesByRoute = async (req, res) => {
    try {
        const { routeNo } = req.params;
        
        const buses = await LiveBus.find({ 
            routeNo, 
            isActive: true 
        })
        .populate('routeId')
        .populate('driverId', 'name phone')
        .sort({ lastUpdated: -1 });
        
        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching live buses',
            error: error.message
        });
    }
};

// Get live bus by ID
exports.getLiveBusById = async (req, res) => {
    try {
        const bus = await LiveBus.findById(req.params.id)
            .populate('routeId')
            .populate('driverId', 'name phone');
        
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: bus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bus',
            error: error.message
        });
    }
};

// Get bus locations for map
exports.getBusLocations = async (req, res) => {
    try {
        const { routeNo } = req.query;
        
        let query = { isActive: true };
        if (routeNo) {
            query.routeNo = routeNo;
        }
        
        const buses = await LiveBus.find(query)
            .select('routeNo busNumber currentLocation passengers capacity')
            .sort({ lastUpdated: -1 });
        
        // Format for map markers
        const locations = buses.map(bus => ({
            id: bus._id,
            routeNo: bus.routeNo,
            busNumber: bus.busNumber,
            lat: bus.currentLocation?.coordinates?.lat,
            lng: bus.currentLocation?.coordinates?.lng,
            label: `Route ${bus.routeNo} - ${bus.currentLocation?.name || 'Unknown'}`,
            passengers: bus.passengers,
            capacity: bus.capacity,
            occupancy: Math.round((bus.passengers / bus.capacity) * 100)
        }));
        
        res.status(200).json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bus locations',
            error: error.message
        });
    }
};

// Get nearby buses
exports.getNearbyBuses = async (req, res) => {
    try {
        const { lat, lng, radius = 5 } = req.query; // radius in km
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }
        
        // Simple distance calculation (for more accurate, use MongoDB geospatial queries)
        const buses = await LiveBus.find({ isActive: true })
            .populate('routeId')
            .sort({ lastUpdated: -1 });
        
        // Filter buses within radius
        const nearbyBuses = buses.filter(bus => {
            if (!bus.currentLocation?.coordinates?.lat || !bus.currentLocation?.coordinates?.lng) {
                return false;
            }
            
            const distance = calculateDistance(
                parseFloat(lat),
                parseFloat(lng),
                bus.currentLocation.coordinates.lat,
                bus.currentLocation.coordinates.lng
            );
            
            return distance <= parseFloat(radius);
        });
        
        res.status(200).json({
            success: true,
            count: nearbyBuses.length,
            data: nearbyBuses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching nearby buses',
            error: error.message
        });
    }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

// Get bus occupancy status
exports.getBusOccupancy = async (req, res) => {
    try {
        const buses = await LiveBus.find({ isActive: true })
            .select('routeNo busNumber passengers capacity currentLocation');
        
        const occupancyData = buses.map(bus => {
            const occupancyPercentage = Math.round((bus.passengers / bus.capacity) * 100);
            let status = 'available';
            
            if (occupancyPercentage >= 80) {
                status = 'crowded';
            } else if (occupancyPercentage >= 50) {
                status = 'moderate';
            }
            
            return {
                id: bus._id,
                routeNo: bus.routeNo,
                busNumber: bus.busNumber,
                passengers: bus.passengers,
                capacity: bus.capacity,
                occupancyPercentage,
                status,
                location: bus.currentLocation?.name
            };
        });
        
        res.status(200).json({
            success: true,
            count: occupancyData.length,
            data: occupancyData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bus occupancy',
            error: error.message
        });
    }
};
