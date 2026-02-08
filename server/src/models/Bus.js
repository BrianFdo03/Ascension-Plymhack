const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    numberPlate: {
        type: String,
        required: true,
        unique: true
    },
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    routeNo: {
        type: String,
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    driverName: {
        type: String
    },
    totalSeats: {
        type: Number,
        default: 52
    },
    bookedSeats: {
        type: Number,
        default: 0
    },
    departureTime: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Bus', busSchema);
