const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: true,
        trim: true
    },
    origin: {
        type: String,
        required: true,
        trim: true
    },
    originCoords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    destinationCoords: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    stopsList: [{
        name: { type: String, required: true },
        price: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    }],
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    // Legacy fields for backward compatibility
    routeNo: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    duration: {
        type: String
    },
    fare: {
        type: Number
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    stops: {
        type: Number,
        default: 0
    },
    frequency: {
        type: String,
        default: 'Every 30 min'
    },
    totalSeats: {
        type: Number,
        default: 53
    },
    accessibleSeats: {
        type: Number,
        default: 4
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
