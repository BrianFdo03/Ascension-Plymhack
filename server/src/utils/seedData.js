const mongoose = require('mongoose');
const Route = require('../models/Route');
const LiveBus = require('../models/LiveBus');
const Bus = require('../models/Bus');
const TrafficAlert = require('../models/TrafficAlert');
require('dotenv').config();

const connectDB = require('../config/db');

// Sample routes data
const routes = [
    {
        routeNo: '138',
        from: 'Pettah',
        to: 'Homagama',
        duration: '45 min',
        fare: 50,
        rating: 4.5,
        stops: 18,
        frequency: 'Every 10 min',
        totalSeats: 53,
        accessibleSeats: 4,
        isActive: true
    },
    {
        routeNo: '01',
        from: 'Colombo',
        to: 'Kandy',
        duration: '3 hrs',
        fare: 250,
        rating: 4.8,
        stops: 43,
        frequency: 'Every 30 min',
        totalSeats: 53,
        accessibleSeats: 4,
        isActive: true
    },
    {
        routeNo: '87',
        from: 'Colombo',
        to: 'Jaffna',
        duration: '8 hrs',
        fare: 800,
        rating: 4.3,
        stops: 45,
        frequency: 'Every 2 hrs',
        totalSeats: 53,
        accessibleSeats: 4,
        isActive: true
    },
    {
        routeNo: '122',
        from: 'Pettah',
        to: 'Avissawella',
        duration: '1 hr',
        fare: 65,
        rating: 4.2,
        stops: 32,
        frequency: 'Every 15 min',
        totalSeats: 53,
        accessibleSeats: 4,
        isActive: true
    },
    {
        routeNo: '177',
        from: 'Kollupitiya',
        to: 'Kaduwela',
        duration: '50 min',
        fare: 55,
        rating: 4.6,
        stops: 25,
        frequency: 'Every 12 min',
        totalSeats: 53,
        accessibleSeats: 4,
        isActive: true
    }
];

// Sample live buses data
const createLiveBuses = (routeIds) => [
    {
        routeId: routeIds[0], // Route 138
        routeNo: '138',
        busNumber: 'WP NB-1234',
        currentLocation: {
            name: 'Nugegoda',
            coordinates: { lat: 6.8649, lng: 79.8997 }
        },
        nextStop: 'Maharagama',
        eta: '5 min',
        passengers: 35,
        capacity: 50,
        speed: '45 km/h',
        isActive: true
    },
    {
        routeId: routeIds[1], // Route 01
        routeNo: '01',
        busNumber: 'NC-5678',
        currentLocation: {
            name: 'Kaduwela',
            coordinates: { lat: 6.9334, lng: 79.9800 }
        },
        nextStop: 'Malabe',
        eta: '8 min',
        passengers: 42,
        capacity: 50,
        speed: '50 km/h',
        isActive: true
    },
    {
        routeId: routeIds[2], // Route 87
        routeNo: '87',
        busNumber: 'NB-9012',
        currentLocation: {
            name: 'Kiribathgoda',
            coordinates: { lat: 6.9897, lng: 79.9219 }
        },
        nextStop: 'Kadawatha',
        eta: '12 min',
        passengers: 28,
        capacity: 50,
        speed: '40 km/h',
        isActive: true
    },
    {
        routeId: routeIds[3], // Route 122
        routeNo: '122',
        busNumber: 'WP-3456',
        currentLocation: {
            name: 'Colombo Fort',
            coordinates: { lat: 6.9271, lng: 79.8612 }
        },
        nextStop: 'Borella',
        eta: '6 min',
        passengers: 38,
        capacity: 50,
        speed: '35 km/h',
        isActive: true
    }
];

// Sample buses data
const createBuses = (routeIds) => [
    {
        numberPlate: 'WP NB-1234',
        routeId: routeIds[0],
        routeNo: '138',
        driverName: 'Sunil Perera',
        totalSeats: 52,
        bookedSeats: 28,
        departureTime: '09:00 AM',
        status: 'active',
        isActive: true
    },
    {
        numberPlate: 'NC-5678',
        routeId: routeIds[1],
        routeNo: '01',
        driverName: 'Kamal Silva',
        totalSeats: 52,
        bookedSeats: 35,
        departureTime: '08:30 AM',
        status: 'active',
        isActive: true
    }
];

// Sample traffic alerts
const createTrafficAlerts = (routeIds) => [
    {
        location: 'Borella Junction',
        coordinates: { lat: 6.9147, lng: 79.8803 },
        severity: 'high',
        description: 'Heavy traffic congestion due to road work',
        routeIds: [routeIds[0], routeIds[3]],
        isActive: true
    },
    {
        location: 'Kollupitiya',
        coordinates: { lat: 6.9147, lng: 79.8503 },
        severity: 'medium',
        description: 'Moderate traffic - school zone',
        routeIds: [routeIds[1]],
        isActive: true
    },
    {
        location: 'Kotte',
        coordinates: { lat: 6.8905, lng: 79.9018 },
        severity: 'high',
        description: 'Accident reported, expect delays',
        routeIds: [routeIds[0]],
        isActive: true
    }
];

const seedDatabase = async () => {
    try {
        // Connect to database
        await connectDB();
        
        console.log('🌱 Starting database seeding...');
        
        // Clear existing data
        await Route.deleteMany({});
        await LiveBus.deleteMany({});
        await Bus.deleteMany({});
        await TrafficAlert.deleteMany({});
        console.log('✅ Cleared existing data');
        
        // Insert routes
        const insertedRoutes = await Route.insertMany(routes);
        console.log(`✅ Inserted ${insertedRoutes.length} routes`);
        
        // Get route IDs for live buses
        const routeIds = insertedRoutes.map(route => route._id);
        
        // Insert buses
        const buses = createBuses(routeIds);
        const insertedBuses = await Bus.insertMany(buses);
        console.log(`✅ Inserted ${insertedBuses.length} buses`);
        
        // Insert live buses
        const liveBuses = createLiveBuses(routeIds);
        const insertedLiveBuses = await LiveBus.insertMany(liveBuses);
        console.log(`✅ Inserted ${insertedLiveBuses.length} live buses`);
        
        // Insert traffic alerts
        const trafficAlerts = createTrafficAlerts(routeIds);
        const insertedAlerts = await TrafficAlert.insertMany(trafficAlerts);
        console.log(`✅ Inserted ${insertedAlerts.length} traffic alerts`);
        
        console.log('🎉 Database seeding completed successfully!');
        console.log('\nSample Data:');
        console.log('- Routes:', insertedRoutes.length);
        console.log('- Buses:', insertedBuses.length);
        console.log('- Live Buses:', insertedLiveBuses.length);
        console.log('- Traffic Alerts:', insertedAlerts.length);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seeding
seedDatabase();
