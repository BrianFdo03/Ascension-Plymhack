const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    passengerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        default: 0
    }
}, {
    timestamps: true
});

// Ensure a passenger can't favorite the same route twice
favoriteSchema.index({ passengerId: 1, routeId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
