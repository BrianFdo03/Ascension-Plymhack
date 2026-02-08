const Notification = require('../models/Notification');

// Create notification (Admin only)
exports.createNotification = async (req, res) => {
  try {
    const { recipientType, recipientId, title, message, type, priority, data, expiresAt } = req.body;

    const notification = new Notification({
      recipientType,
      recipientId,
      title,
      message,
      type,
      priority,
      data,
      expiresAt,
      createdBy: req.body.createdBy || 'admin'
    });

    await notification.save();

    // Emit socket event for real-time notification
    const io = req.app.get('io');
    if (io) {
      if (recipientType === 'all') {
        io.emit('new_notification', notification);
      } else if (recipientId) {
        io.to(recipientId).emit('new_notification', notification);
      } else {
        io.to(recipientType).emit('new_notification', notification);
      }
    }

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const { userType, userId } = req.query;
    const { limit = 50, skip = 0 } = req.query;

    const query = {
      $or: [
        { recipientType: 'all' },
        { recipientType: userType },
        { recipientType: userType, recipientId: userId }
      ],
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const unreadCount = await Notification.countDocuments({
      ...query,
      'readBy.userId': { $ne: userId }
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if already read by this user
    const alreadyRead = notification.readBy.some(r => r.userId === userId);
    
    if (!alreadyRead) {
      notification.readBy.push({
        userId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId, userType } = req.body;

    const query = {
      $or: [
        { recipientType: 'all' },
        { recipientType: userType },
        { recipientType: userType, recipientId: userId }
      ],
      'readBy.userId': { $ne: userId }
    };

    const notifications = await Notification.find(query);

    for (const notification of notifications) {
      notification.readBy.push({
        userId,
        readAt: new Date()
      });
      await notification.save();
    }

    res.json({
      success: true,
      message: 'All notifications marked as read',
      count: notifications.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Delete notification (Admin only)
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Get notification statistics (Admin only)
exports.getNotificationStats = async (req, res) => {
  try {
    const total = await Notification.countDocuments();
    const byType = await Notification.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);
    const byRecipient = await Notification.aggregate([
      { $group: { _id: '$recipientType', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        total,
        byType,
        byRecipient
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notification statistics',
      error: error.message
    });
  }
};
