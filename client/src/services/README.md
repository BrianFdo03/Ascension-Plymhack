# Passenger Services - API Integration

## Overview
This folder contains API service layers for connecting the frontend to the backend.

## Files

### `api.ts`
Base axios configuration with:
- Base URL configuration from environment variables
- Request interceptor for adding auth tokens
- Response interceptor for error handling
- Automatic token refresh on 401 errors

### `passengerService.ts`
Complete API service for passenger features:
- Route management
- Booking management
- Favorites management
- Live tracking

## Usage

### 1. Environment Setup
Make sure `.env` file has the correct API URL:
```env
VITE_API_URL=http://localhost:3001/api
```

### 2. Import Services
```typescript
import { routeService, bookingService, favoriteService, trackingService } from '@/services/passengerService';
```

### 3. Example Usage

#### Fetch Routes
```typescript
// Get all routes
const response = await routeService.getAllRoutes();
const routes = response.data;

// Search routes
const results = await routeService.searchRoutes('Colombo', 'Kandy', 'rating');

// Get popular routes
const popular = await routeService.getPopularRoutes();
```

#### Create Booking
```typescript
const bookingData = {
    routeId: '507f1f77bcf86cd799439011',
    routeNo: '138',
    from: 'Pettah',
    to: 'Homagama',
    date: '2026-02-08',
    time: '08:30 AM',
    seats: [
        { seatNumber: 12, isAccessible: false },
        { seatNumber: 13, isAccessible: false }
    ],
    fare: 50
};

const response = await bookingService.createBooking(bookingData);
```

#### Manage Favorites
```typescript
// Add to favorites
await favoriteService.addFavorite(routeId);

// Get all favorites
const favorites = await favoriteService.getAllFavorites();

// Remove favorite
await favoriteService.removeFavorite(favoriteId);
```

#### Live Tracking
```typescript
// Get all live buses
const buses = await trackingService.getAllLiveBuses();

// Get bus locations for map
const locations = await trackingService.getBusLocations();

// Get nearby buses
const nearby = await trackingService.getNearbyBuses(6.9271, 79.8612, 5);
```

## Error Handling

All services use try-catch blocks:

```typescript
try {
    const response = await routeService.getAllRoutes();
    // Handle success
} catch (error) {
    console.error('Error:', error);
    // Handle error
}
```

## Authentication

The API automatically includes JWT tokens from localStorage:
```typescript
localStorage.setItem('token', 'your_jwt_token');
```

On 401 errors, the user is automatically redirected to login.

## Updated Pages

The following pages now fetch data from the database:

1. **PassengerDashboard.tsx**
   - Fetches popular routes
   - Searches routes
   - Displays live bus locations

2. **SearchRoutes.tsx**
   - Fetches all routes
   - Searches with filters
   - Sorts by rating/fare/duration

3. **MyTrips.tsx**
   - Fetches all bookings
   - Displays upcoming/past trips
   - Shows booking statistics

4. **LiveTracking.tsx**
   - Fetches live buses
   - Displays bus locations on map
   - Shows bus occupancy

## Next Steps

1. Implement authentication (JWT)
2. Add error toast notifications
3. Implement loading states
4. Add pagination for large datasets
5. Implement real-time updates with WebSocket
6. Add offline support with caching
