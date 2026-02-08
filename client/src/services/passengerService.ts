import api from './api';

// Types
export interface Route {
    _id: string;
    routeNo: string;
    from: string;
    to: string;
    duration: string;
    fare: number;
    rating: number;
    stops: number;
    frequency: string;
    totalSeats: number;
    accessibleSeats: number;
    isActive: boolean;
}

export interface Booking {
    _id: string;
    passengerId: string;
    routeId: string;
    routeNo: string;
    from: string;
    to: string;
    date: string;
    time: string;
    seats: { seatNumber: number; isAccessible: boolean }[];
    totalSeats: number;
    fare: number;
    totalAmount: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Favorite {
    _id: string;
    passengerId: string;
    routeId: string;
    routeNo: string;
    from: string;
    to: string;
    duration: string;
    fare: number;
    rating: number;
}

export interface LiveBus {
    _id: string;
    routeId: string;
    routeNo: string;
    busNumber: string;
    currentLocation: {
        name: string;
        coordinates: { lat: number; lng: number };
    };
    nextStop: string;
    eta: string;
    passengers: number;
    capacity: number;
    speed: string;
    isActive: boolean;
}

// Route Services
export const routeService = {
    // Get all routes
    getAllRoutes: async () => {
        const response = await api.get('/passenger/routes');
        return response.data;
    },

    // Search routes
    searchRoutes: async (from?: string, to?: string, sortBy?: 'rating' | 'fare' | 'duration') => {
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        if (sortBy) params.append('sortBy', sortBy);
        
        const response = await api.get(`/passenger/routes/search?${params.toString()}`);
        return response.data;
    },

    // Get popular routes
    getPopularRoutes: async () => {
        const response = await api.get('/passenger/routes/popular');
        return response.data;
    },

    // Get route by ID
    getRouteById: async (id: string) => {
        const response = await api.get(`/passenger/routes/${id}`);
        return response.data;
    },

    // Get route by number
    getRouteByNumber: async (routeNo: string) => {
        const response = await api.get(`/passenger/routes/number/${routeNo}`);
        return response.data;
    },
};

// Booking Services
export const bookingService = {
    // Create booking
    createBooking: async (bookingData: {
        routeId: string;
        routeNo: string;
        from: string;
        to: string;
        date: string;
        time: string;
        seats: { seatNumber: number; isAccessible: boolean }[];
        fare: number;
    }) => {
        const response = await api.post('/passenger/bookings', bookingData);
        return response.data;
    },

    // Get all bookings
    getAllBookings: async () => {
        const response = await api.get('/passenger/bookings');
        return response.data;
    },

    // Get upcoming bookings
    getUpcomingBookings: async () => {
        const response = await api.get('/passenger/bookings/upcoming');
        return response.data;
    },

    // Get past bookings
    getPastBookings: async () => {
        const response = await api.get('/passenger/bookings/past');
        return response.data;
    },

    // Get booking by ID
    getBookingById: async (id: string) => {
        const response = await api.get(`/passenger/bookings/${id}`);
        return response.data;
    },

    // Cancel booking
    cancelBooking: async (id: string) => {
        const response = await api.patch(`/passenger/bookings/${id}/cancel`);
        return response.data;
    },

    // Update payment status
    updatePaymentStatus: async (id: string, paymentStatus: 'pending' | 'paid' | 'refunded') => {
        const response = await api.patch(`/passenger/bookings/${id}/payment`, { paymentStatus });
        return response.data;
    },

    // Get booking statistics
    getBookingStats: async () => {
        const response = await api.get('/passenger/bookings/stats');
        return response.data;
    },
};

// Favorite Services
export const favoriteService = {
    // Add to favorites
    addFavorite: async (routeId: string) => {
        const response = await api.post('/passenger/favorites', { routeId });
        return response.data;
    },

    // Get all favorites
    getAllFavorites: async () => {
        const response = await api.get('/passenger/favorites');
        return response.data;
    },

    // Check if route is favorited
    checkFavorite: async (routeId: string) => {
        const response = await api.get(`/passenger/favorites/check/${routeId}`);
        return response.data;
    },

    // Get favorite statistics
    getFavoriteStats: async () => {
        const response = await api.get('/passenger/favorites/stats');
        return response.data;
    },

    // Remove favorite by ID
    removeFavorite: async (id: string) => {
        const response = await api.delete(`/passenger/favorites/${id}`);
        return response.data;
    },

    // Remove favorite by route ID
    removeFavoriteByRoute: async (routeId: string) => {
        const response = await api.delete(`/passenger/favorites/route/${routeId}`);
        return response.data;
    },
};

// Tracking Services
export const trackingService = {
    // Get all live buses
    getAllLiveBuses: async () => {
        const response = await api.get('/passenger/tracking/buses');
        return response.data;
    },

    // Get live buses by route
    getLiveBusesByRoute: async (routeNo: string) => {
        const response = await api.get(`/passenger/tracking/buses/route/${routeNo}`);
        return response.data;
    },

    // Get live bus by ID
    getLiveBusById: async (id: string) => {
        const response = await api.get(`/passenger/tracking/buses/${id}`);
        return response.data;
    },

    // Get bus locations for map
    getBusLocations: async (routeNo?: string) => {
        const params = routeNo ? `?routeNo=${routeNo}` : '';
        const response = await api.get(`/passenger/tracking/locations${params}`);
        return response.data;
    },

    // Get nearby buses
    getNearbyBuses: async (lat: number, lng: number, radius?: number) => {
        const params = new URLSearchParams({
            lat: lat.toString(),
            lng: lng.toString(),
        });
        if (radius) params.append('radius', radius.toString());
        
        const response = await api.get(`/passenger/tracking/nearby?${params.toString()}`);
        return response.data;
    },

    // Get bus occupancy status
    getBusOccupancy: async () => {
        const response = await api.get('/passenger/tracking/occupancy');
        return response.data;
    },
};
