// Validation middleware for request data

const validateBooking = (req, res, next) => {
    const { routeId, routeNo, from, to, date, time, seats, fare } = req.body;
    
    // Check required fields
    if (!routeId || !routeNo || !from || !to || !date || !time || !seats || !fare) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
            required: ['routeId', 'routeNo', 'from', 'to', 'date', 'time', 'seats', 'fare']
        });
    }
    
    // Validate seats array
    if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Seats must be a non-empty array'
        });
    }
    
    // Validate each seat
    for (const seat of seats) {
        if (!seat.seatNumber || typeof seat.seatNumber !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Each seat must have a valid seatNumber'
            });
        }
    }
    
    // Validate fare
    if (typeof fare !== 'number' || fare <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Fare must be a positive number'
        });
    }
    
    // Validate date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: 'Invalid date format'
        });
    }
    
    next();
};

const validateFavorite = (req, res, next) => {
    const { routeId } = req.body;
    
    if (!routeId) {
        return res.status(400).json({
            success: false,
            message: 'routeId is required'
        });
    }
    
    next();
};

const validateSearch = (req, res, next) => {
    const { sortBy } = req.query;
    
    if (sortBy && !['rating', 'fare', 'duration'].includes(sortBy)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sortBy parameter. Must be one of: rating, fare, duration'
        });
    }
    
    next();
};

const validateCoordinates = (req, res, next) => {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
        return res.status(400).json({
            success: false,
            message: 'Latitude and longitude are required'
        });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid coordinates format'
        });
    }
    
    if (latitude < -90 || latitude > 90) {
        return res.status(400).json({
            success: false,
            message: 'Latitude must be between -90 and 90'
        });
    }
    
    if (longitude < -180 || longitude > 180) {
        return res.status(400).json({
            success: false,
            message: 'Longitude must be between -180 and 180'
        });
    }
    
    next();
};

module.exports = {
    validateBooking,
    validateFavorite,
    validateSearch,
    validateCoordinates
};
