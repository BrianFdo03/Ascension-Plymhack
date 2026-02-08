const Favorite = require('../../models/Favorite');
const Route = require('../../models/Route');

// Add route to favorites
exports.addFavorite = async (req, res) => {
    try {
        const { routeId } = req.body;
        const passengerId = req.user.id;
        
        // Check if route exists
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        }
        
        // Check if already favorited
        const existingFavorite = await Favorite.findOne({ passengerId, routeId });
        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: 'Route already in favorites'
            });
        }
        
        // Create favorite
        const favorite = await Favorite.create({
            passengerId,
            routeId,
            routeNo: route.routeNo,
            from: route.from,
            to: route.to,
            duration: route.duration,
            fare: route.fare,
            rating: route.rating
        });
        
        res.status(201).json({
            success: true,
            message: 'Route added to favorites',
            data: favorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding favorite',
            error: error.message
        });
    }
};

// Get all favorites for a passenger
exports.getFavorites = async (req, res) => {
    try {
        const passengerId = req.user.id;
        
        const favorites = await Favorite.find({ passengerId })
            .populate('routeId')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching favorites',
            error: error.message
        });
    }
};

// Remove favorite
exports.removeFavorite = async (req, res) => {
    try {
        const favoriteId = req.params.id;
        const passengerId = req.user.id;
        
        const favorite = await Favorite.findOne({ 
            _id: favoriteId, 
            passengerId 
        });
        
        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }
        
        await favorite.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Favorite removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing favorite',
            error: error.message
        });
    }
};

// Remove favorite by route ID
exports.removeFavoriteByRoute = async (req, res) => {
    try {
        const routeId = req.params.routeId;
        const passengerId = req.user.id;
        
        const favorite = await Favorite.findOne({ 
            routeId, 
            passengerId 
        });
        
        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favorite not found'
            });
        }
        
        await favorite.deleteOne();
        
        res.status(200).json({
            success: true,
            message: 'Favorite removed successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing favorite',
            error: error.message
        });
    }
};

// Check if route is favorited
exports.checkFavorite = async (req, res) => {
    try {
        const routeId = req.params.routeId;
        const passengerId = req.user.id;
        
        const favorite = await Favorite.findOne({ routeId, passengerId });
        
        res.status(200).json({
            success: true,
            isFavorite: !!favorite,
            data: favorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking favorite',
            error: error.message
        });
    }
};

// Get favorite statistics
exports.getFavoriteStats = async (req, res) => {
    try {
        const passengerId = req.user.id;
        
        const favorites = await Favorite.find({ passengerId });
        
        const totalFavorites = favorites.length;
        const avgRating = favorites.length > 0 
            ? favorites.reduce((sum, fav) => sum + fav.rating, 0) / favorites.length 
            : 0;
        const avgFare = favorites.length > 0 
            ? favorites.reduce((sum, fav) => sum + fav.fare, 0) / favorites.length 
            : 0;
        
        res.status(200).json({
            success: true,
            data: {
                total: totalFavorites,
                avgRating: avgRating.toFixed(1),
                avgFare: Math.round(avgFare)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching favorite statistics',
            error: error.message
        });
    }
};
