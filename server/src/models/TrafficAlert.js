const mongoose = require('mongoose');

const trafficAlertSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    coordinates: {
        lat: Number,
        lng: Number
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    description: {
        type: String,
        required: true
    },
    routeIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('TrafficAlert', trafficAlertSchema);
