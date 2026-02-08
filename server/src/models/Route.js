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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Route', routeSchema);
