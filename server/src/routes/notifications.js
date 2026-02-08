const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create notification (Admin)
router.post('/', notificationController.createNotification);

// Get notifications for user
router.get('/', notificationController.getNotifications);

// Mark notification as read
router.patch('/:notificationId/read', notificationController.markAsRead);

// Mark all notifications as read
router.post('/read-all', notificationController.markAllAsRead);

// Delete notification (Admin)
router.delete('/:notificationId', notificationController.deleteNotification);

// Get notification statistics (Admin)
router.get('/stats', notificationController.getNotificationStats);

module.exports = router;
