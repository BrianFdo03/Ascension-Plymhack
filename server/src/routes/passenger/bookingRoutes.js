const express = require('express');
const router = express.Router();
const {
    createBooking,
    getPassengerBookings,
    getUpcomingBookings,
    getPastBookings,
    getBookingById,
    cancelBooking,
    updatePaymentStatus,
    getBookingStats
} = require('../../controllers/passenger/bookingController');
const { validateBooking } = require('../../middlewares/validation');

// Note: Add authentication middleware here
// const { protect } = require('../../middlewares/auth');
// router.use(protect);

// Booking routes
router.post('/', validateBooking, createBooking);
router.get('/', getPassengerBookings);
router.get('/upcoming', getUpcomingBookings);
router.get('/past', getPastBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/payment', updatePaymentStatus);

module.exports = router;
