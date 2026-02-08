const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientType: {
    type: String,
    enum: ['driver', 'passenger', 'all'],
    required: true
  },
  recipientId: {
    type: String, // Specific user ID if targeted notification
    default: null
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error', 'announcement'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    userId: String,
    readAt: Date
  }],
  data: {
    type: mongoose.Schema.Types.Mixed, // Additional data (route info, booking details, etc.)
    default: null
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipientType: 1, recipientId: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);
