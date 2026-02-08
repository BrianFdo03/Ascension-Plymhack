# Bus Booking System - Backend Server

Node.js backend server for the bus booking system with passenger, driver, and admin functionalities.

## Features

### Passenger Features
- 🔍 Search and browse bus routes
- 🎫 Book seats with accessibility options
- ⭐ Save favorite routes
- 📍 Live bus tracking
- 📊 View booking history and statistics

### Real-time Features
- 🔴 Live bus location tracking
- 💬 WebSocket-based chat system
- 📡 Real-time updates for bus occupancy

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Environment**: dotenv

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   └── passenger/            # Passenger controllers
│   │       ├── routeController.js
│   │       ├── bookingController.js
│   │       ├── favoriteController.js
│   │       └── trackingController.js
│   ├── middlewares/
│   │   ├── auth.js               # Authentication middleware
│   │   ├── validation.js         # Request validation
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── Route.js              # Route model
│   │   ├── Booking.js            # Booking model
│   │   ├── Favorite.js           # Favorite model
│   │   └── LiveBus.js            # Live bus tracking model
│   ├── routes/
│   │   └── passenger/            # Passenger routes
│   │       ├── index.js
│   │       ├── routeRoutes.js
│   │       ├── bookingRoutes.js
│   │       ├── favoriteRoutes.js
│   │       └── trackingRoutes.js
│   ├── utils/
│   │   └── seedData.js           # Database seeding script
│   └── index.js                  # Main server file
├── .env                          # Environment variables
├── package.json
└── README.md
```

## Installation

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/bus-booking
   NODE_ENV=development
   ```

3. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

## Usage

### Development Mode
```bash
npm run dev
```
Runs the server with nodemon for auto-restart on file changes.

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```
Populates the database with sample routes and live bus data.

## API Documentation

### Base URL
```
http://localhost:3000/api/passenger
```

### Available Endpoints

#### Routes
- `GET /routes` - Get all routes
- `GET /routes/search` - Search routes
- `GET /routes/popular` - Get popular routes
- `GET /routes/:id` - Get route by ID
- `GET /routes/number/:routeNo` - Get route by number

#### Bookings (Requires Auth)
- `POST /bookings` - Create booking
- `GET /bookings` - Get all bookings
- `GET /bookings/upcoming` - Get upcoming bookings
- `GET /bookings/past` - Get past bookings
- `GET /bookings/stats` - Get booking statistics
- `GET /bookings/:id` - Get booking by ID
- `PATCH /bookings/:id/cancel` - Cancel booking
- `PATCH /bookings/:id/payment` - Update payment status

#### Favorites (Requires Auth)
- `POST /favorites` - Add favorite
- `GET /favorites` - Get all favorites
- `GET /favorites/stats` - Get favorite statistics
- `GET /favorites/check/:routeId` - Check if favorited
- `DELETE /favorites/:id` - Remove favorite
- `DELETE /favorites/route/:routeId` - Remove by route

#### Live Tracking
- `GET /tracking/buses` - Get all live buses
- `GET /tracking/buses/route/:routeNo` - Get buses by route
- `GET /tracking/buses/:id` - Get bus by ID
- `GET /tracking/locations` - Get bus locations for map
- `GET /tracking/nearby` - Get nearby buses
- `GET /tracking/occupancy` - Get bus occupancy status

For detailed API documentation, see [Passenger API Documentation](./src/routes/passenger/README.md)

## Testing

### Using Postman
Import the Postman collection:
```
server/Passenger_API.postman_collection.json
```

### Manual Testing
```bash
# Test server is running
curl http://localhost:3000

# Get all routes
curl http://localhost:3000/api/passenger/routes

# Search routes
curl "http://localhost:3000/api/passenger/routes/search?from=Colombo&to=Kandy"

# Get live buses
curl http://localhost:3000/api/passenger/tracking/buses
```

## WebSocket Events

### Connection
```javascript
socket.emit('join', {
  userId: 'user123',
  userType: 'passenger', // or 'driver', 'admin'
  userName: 'John Doe'
});
```

### Chat Events
- `send_broadcast` - Admin broadcasts to all drivers
- `send_direct_message` - Direct messaging
- `receive_message` - Receive messages
- `drivers_update` - Get online drivers list

## Database Models

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

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (dev mode only)"
}
```

## Security

- CORS configured for frontend origin
- Input validation on all endpoints
- Authentication middleware ready (needs JWT implementation)
- Role-based authorization support

## Next Steps

1. ✅ Implement JWT authentication
2. ✅ Add rate limiting
3. ✅ Implement payment gateway integration
4. ✅ Add email/SMS notifications
5. ✅ Implement caching (Redis)
6. ✅ Add API documentation (Swagger)
7. ✅ Write unit and integration tests
8. ✅ Set up CI/CD pipeline

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
