const express = require('express');
const router = express.Router();
const {
    getAllLiveBuses,
    getLiveBusesByRoute,
    getLiveBusById,
    getBusLocations,
    getNearbyBuses,
    getBusOccupancy
} = require('../../controllers/passenger/trackingController');
const { validateCoordinates } = require('../../middlewares/validation');

// Public routes (no auth required for tracking)
router.get('/buses', getAllLiveBuses);
router.get('/buses/route/:routeNo', getLiveBusesByRoute);
router.get('/buses/:id', getLiveBusById);
router.get('/locations', getBusLocations);
router.get('/nearby', validateCoordinates, getNearbyBuses);
router.get('/occupancy', getBusOccupancy);

module.exports = router;
