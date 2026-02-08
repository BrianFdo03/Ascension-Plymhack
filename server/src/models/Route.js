const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeNo: {
        type: String,
        required: true,
        unique: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
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
