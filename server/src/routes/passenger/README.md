# Passenger API Documentation

## Base URL
```
http://localhost:3000/api/passenger
```

## Routes Overview

### 1. Route Management (`/routes`)

#### Get All Routes
```http
GET /api/passenger/routes
```
Returns all active bus routes.

#### Search Routes
```http
GET /api/passenger/routes/search?from=Colombo&to=Kandy&sortBy=rating
```
Query Parameters:
- `from` (optional): Starting location
- `to` (optional): Destination
- `sortBy` (optional): `rating`, `fare`, or `duration`

#### Get Popular Routes
```http
GET /api/passenger/routes/popular
```
Returns top 10 routes by rating.

#### Get Route by ID
```http
GET /api/passenger/routes/:id
```

#### Get Route by Number
```http
GET /api/passenger/routes/number/:routeNo
```
Example: `/api/passenger/routes/number/138`

---

### 2. Booking Management (`/bookings`)

**Note:** All booking routes require authentication.

#### Create Booking
```http
POST /api/passenger/bookings
Content-Type: application/json

{
  "routeId": "507f1f77bcf86cd799439011",
  "routeNo": "138",
  "from": "Pettah",
  "to": "Homagama",
  "date": "2026-02-08",
  "time": "08:30 AM",
  "seats": [
    { "seatNumber": 12, "isAccessible": false },
    { "seatNumber": 13, "isAccessible": false }
  ],
  "fare": 50
}
```

#### Get All Bookings
```http
GET /api/passenger/bookings
```
Returns all bookings for the authenticated passenger.

#### Get Upcoming Bookings
```http
GET /api/passenger/bookings/upcoming
```

#### Get Past Bookings
```http
GET /api/passenger/bookings/past
```

#### Get Booking by ID
```http
GET /api/passenger/bookings/:id
```

#### Cancel Booking
```http
PATCH /api/passenger/bookings/:id/cancel
```

#### Update Payment Status
```http
PATCH /api/passenger/bookings/:id/payment
Content-Type: application/json

{
  "paymentStatus": "paid"
}
```
Payment status options: `pending`, `paid`, `refunded`

#### Get Booking Statistics
```http
GET /api/passenger/bookings/stats
```
Returns total, completed, upcoming, and cancelled bookings count.

---

### 3. Favorites Management (`/favorites`)

**Note:** All favorite routes require authentication.

#### Add to Favorites
```http
POST /api/passenger/favorites
Content-Type: application/json

{
  "routeId": "507f1f77bcf86cd799439011"
}
```

#### Get All Favorites
```http
GET /api/passenger/favorites
```

#### Check if Route is Favorited
```http
GET /api/passenger/favorites/check/:routeId
```

#### Get Favorite Statistics
```http
GET /api/passenger/favorites/stats
```
Returns total favorites, average rating, and average fare.

#### Remove Favorite by ID
```http
DELETE /api/passenger/favorites/:id
```

#### Remove Favorite by Route ID
```http
DELETE /api/passenger/favorites/route/:routeId
```

---

### 4. Live Tracking (`/tracking`)

#### Get All Live Buses
```http
GET /api/passenger/tracking/buses
```

#### Get Live Buses by Route
```http
GET /api/passenger/tracking/buses/route/:routeNo
```
Example: `/api/passenger/tracking/buses/route/138`

#### Get Live Bus by ID
```http
GET /api/passenger/tracking/buses/:id
```

#### Get Bus Locations (for Map)
```http
GET /api/passenger/tracking/locations?routeNo=138
```
Query Parameters:
- `routeNo` (optional): Filter by route number

Returns formatted data for map markers.

#### Get Nearby Buses
```http
GET /api/passenger/tracking/nearby?lat=6.9271&lng=79.8612&radius=5
```
Query Parameters:
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in km (default: 5)

#### Get Bus Occupancy Status
```http
GET /api/passenger/tracking/occupancy
```
Returns occupancy percentage and status (available/moderate/crowded) for all buses.

---

## Response Format

### Success Response
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

---

## Models

### Route
```javascript
{
  routeNo: String,
  from: String,
  to: String,
  duration: String,
  fare: Number,
  rating: Number,
  stops: Number,
  frequency: String,
  totalSeats: Number,
  accessibleSeats: Number,
  isActive: Boolean
}
```

### Booking
```javascript
{
  passengerId: ObjectId,
  routeId: ObjectId,
  routeNo: String,
  from: String,
  to: String,
  date: Date,
  time: String,
  seats: [{ seatNumber: Number, isAccessible: Boolean }],
  totalSeats: Number,
  fare: Number,
  totalAmount: Number,
  status: 'upcoming' | 'completed' | 'cancelled',
  paymentStatus: 'pending' | 'paid' | 'refunded'
}
```

### Favorite
```javascript
{
  passengerId: ObjectId,
  routeId: ObjectId,
  routeNo: String,
  from: String,
  to: String,
  duration: String,
  fare: Number,
  rating: Number
}
```

### LiveBus
```javascript
{
  routeId: ObjectId,
  routeNo: String,
  busNumber: String,
  driverId: ObjectId,
  currentLocation: {
    name: String,
    coordinates: { lat: Number, lng: Number }
  },
  nextStop: String,
  eta: String,
  passengers: Number,
  capacity: Number,
  speed: String,
  isActive: Boolean
}
```

---

## Authentication

To use authenticated routes, include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

**Note:** Authentication middleware is currently set up but needs to be properly configured with your JWT strategy. Update `server/src/middlewares/auth.js` accordingly.

---

## Testing with Sample Data

You can use tools like Postman or Thunder Client to test these endpoints. Make sure to:

1. Start the server: `npm start` or `npm run dev`
2. Ensure MongoDB is connected
3. Create some sample routes in the database first
4. Use the appropriate authentication token for protected routes

---

## Next Steps

1. Implement proper JWT authentication
2. Add input validation middleware
3. Add rate limiting
4. Implement WebSocket for real-time tracking updates
5. Add pagination for list endpoints
6. Implement caching for frequently accessed data
