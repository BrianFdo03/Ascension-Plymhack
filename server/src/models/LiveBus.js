const mongoose = require('mongoose');

const liveBusSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    routeNo: {
        type: String,
        required: true
    },
    busNumber: {
        type: String,
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentLocation: {
        name: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    nextStop: {
        type: String
    },
    eta: {
        type: String
    },
    passengers: {
        type: Number,
        default: 0
    },
    capacity: {
        type: Number,
        default: 50
    },
    speed: {
        type: String,
        default: '0 km/h'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LiveBus', liveBusSchema);
