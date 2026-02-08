const express = require('express');
const router = express.Router();

// Import driver routes
const busRoutes = require('./busRoutes');
const trafficRoutes = require('./trafficRoutes');

// Mount routes
router.use('/bus', busRoutes);
router.use('/traffic', trafficRoutes);

module.exports = router;
