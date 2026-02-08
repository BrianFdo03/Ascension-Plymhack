const express = require('express');
const router = express.Router();
const {
    getAllRoutes,
    searchRoutes,
    getPopularRoutes,
    getRouteById,
    getRouteByNumber
} = require('../../controllers/passenger/routeController');
const { validateSearch } = require('../../middlewares/validation');

// Public routes (no auth required for viewing routes)
router.get('/', getAllRoutes);
router.get('/search', validateSearch, searchRoutes);
router.get('/popular', getPopularRoutes);
router.get('/:id', getRouteById);
router.get('/number/:routeNo', getRouteByNumber);

module.exports = router;
