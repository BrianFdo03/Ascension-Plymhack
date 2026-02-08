const express = require('express');
const router = express.Router();
const {
    getDriverBus,
    getBookedSeats,
    updateBusLocation,
    getDashboardStats
} = require('../../controllers/driver/busController');

// Note: Add authentication middleware here
// const { protect } = require('../../middlewares/auth');
// router.use(protect);

// Bus routes
router.get('/details', getDriverBus);
router.get('/booked-seats', getBookedSeats);
router.post('/location', updateBusLocation);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
