const express = require('express');
const router = express.Router();

// Import passenger routes
const routeRoutes = require('./routeRoutes');
const bookingRoutes = require('./bookingRoutes');
const favoriteRoutes = require('./favoriteRoutes');
const trackingRoutes = require('./trackingRoutes');

// Mount routes
router.use('/routes', routeRoutes);
router.use('/bookings', bookingRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/tracking', trackingRoutes);

module.exports = router;
