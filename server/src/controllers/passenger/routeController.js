const Route = require('../../models/Route');

// Get all routes
exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ isActive: true });
        res.status(200).json({
            success: true,
            count: routes.length,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching routes',
            error: error.message
        });
    }
};

// Search routes
exports.searchRoutes = async (req, res) => {
    try {
        const { from, to, sortBy } = req.query;
        
        let query = { isActive: true };
        
        if (from) {
            query.from = { $regex: from, $options: 'i' };
        }
        
        if (to) {
            query.to = { $regex: to, $options: 'i' };
        }
        
        let sortOption = {};
        if (sortBy === 'fare') {
            sortOption.fare = 1;
        } else if (sortBy === 'duration') {
            sortOption.duration = 1;
        } else {
            sortOption.rating = -1;
        }
        
        const routes = await Route.find(query).sort(sortOption);
        
        res.status(200).json({
            success: true,
            count: routes.length,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching routes',
            error: error.message
        });
    }
};

// Get popular routes
exports.getPopularRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ isActive: true })
            .sort({ rating: -1 })
            .limit(10);
        
        res.status(200).json({
            success: true,
            count: routes.length,
            data: routes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching popular routes',
            error: error.message
        });
    }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        
        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching route',
            error: error.message
        });
    }
};

// Get route by route number
exports.getRouteByNumber = async (req, res) => {
    try {
        const route = await Route.findOne({ 
            routeNo: req.params.routeNo,
            isActive: true 
        });
        
        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: route
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching route',
            error: error.message
        });
    }
};
