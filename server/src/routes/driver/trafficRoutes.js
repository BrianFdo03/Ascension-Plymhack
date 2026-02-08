const express = require('express');
const router = express.Router();
const {
    getRouteTrafficAlerts,
    reportTrafficAlert,
    getAllTrafficAlerts,
    updateAlertStatus
} = require('../../controllers/driver/trafficController');

// Note: Add authentication middleware here
// const { protect } = require('../../middlewares/auth');
// router.use(protect);

// Traffic routes
router.get('/route-alerts', getRouteTrafficAlerts);
router.post('/report', reportTrafficAlert);
router.get('/all', getAllTrafficAlerts);
router.patch('/:id/status', updateAlertStatus);

module.exports = router;
