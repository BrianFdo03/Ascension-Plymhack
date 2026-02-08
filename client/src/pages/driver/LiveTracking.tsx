import { useState, useEffect } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { MapPin, Navigation, Users, Clock, Play, Square, AlertTriangle, Leaf, TrendingDown, Zap } from 'lucide-react';
import GoogleMap from '../../components/common/GoogleMap';

interface Location {
    lat: number;
    lng: number;
    timestamp: string;
}

interface TrafficAlert {
    id: string;
    location: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    time: string;
}

interface RouteStop {
    name: string;
    time: string;
    status: 'completed' | 'current' | 'upcoming';
    trafficLevel: 'low' | 'medium' | 'high';
    distance: string;
}

interface EnvironmentalMetrics {
    co2Saved: number;
    fuelEfficiency: number;
    passengersServed: number;
    carbonFootprint: number;
}

const LiveTracking = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location>({
        lat: 6.9271,
        lng: 79.8612,
        timestamp: new Date().toLocaleTimeString()
    });
    const [passengersNotified, setPassengersNotified] = useState(0);
    const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>([
        { id: '1', location: 'Borella Junction', severity: 'high', description: 'Heavy traffic congestion', time: '2 min ago' },
        { id: '2', location: 'Kollupitiya', severity: 'medium', description: 'Moderate traffic', time: '5 min ago' },
        { id: '3', location: 'Bambalapitiya', severity: 'low', description: 'Road construction ahead', time: '10 min ago' },
    ]);
    const [environmentalMetrics, setEnvironmentalMetrics] = useState<EnvironmentalMetrics>({
        co2Saved: 45.2,
        fuelEfficiency: 8.5,
        passengersServed: 28,
        carbonFootprint: 12.3,
    });
    const [routeStops, setRouteStops] = useState<RouteStop[]>([
        { name: 'Pettah', time: '09:00 AM', status: 'completed', trafficLevel: 'low', distance: '0 km' },
        { name: 'Borella', time: '09:15 AM', status: 'completed', trafficLevel: 'medium', distance: '3.2 km' },
        { name: 'Kotte', time: '09:30 AM', status: 'current', trafficLevel: 'high', distance: '6.5 km' },
        { name: 'Nugegoda', time: '09:45 AM', status: 'upcoming', trafficLevel: 'medium', distance: '9.8 km' },
        { name: 'Maharagama', time: '10:00 AM', status: 'upcoming', trafficLevel: 'low', distance: '13.2 km' },
        { name: 'Homagama', time: '10:15 AM', status: 'upcoming', trafficLevel: 'low', distance: '17.5 km' },
    ]);

    // Simulate location updates
    useEffect(() => {
        if (isTracking) {
            const interval = setInterval(() => {
                setCurrentLocation(prev => ({
                    lat: prev.lat + (Math.random() - 0.5) * 0.001,
                    lng: prev.lng + (Math.random() - 0.5) * 0.001,
                    timestamp: new Date().toLocaleTimeString()
                }));
                // Update environmental metrics
                setEnvironmentalMetrics(prev => ({
                    ...prev,
                    co2Saved: prev.co2Saved + Math.random() * 0.5,
                    carbonFootprint: prev.carbonFootprint + Math.random() * 0.1,
                }));
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [isTracking]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'high':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'medium':
                return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'low':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟡';
            case 'low':
                return '🔵';
            default:
                return '⚪';
        }
    };

    const getTrafficColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'bg-red-500';
            case 'medium':
                return 'bg-yellow-500';
            case 'low':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getTrafficBorderColor = (level: string) => {
        switch (level) {
            case 'high':
                return 'border-red-500';
            case 'medium':
                return 'border-yellow-500';
            case 'low':
                return 'border-green-500';
            default:
                return 'border-gray-500';
        }
    };

    const getTrafficLabel = (level: string) => {
        switch (level) {
            case 'high':
                return 'Heavy Traffic';
            case 'medium':
                return 'Moderate Traffic';
            case 'low':
                return 'Light Traffic';
            default:
                return 'Unknown';
        }
    };

    const handleStartTracking = () => {
        setIsTracking(true);
        setPassengersNotified(28); // Mock number of passengers
    };

    const handleStopTracking = () => {
        setIsTracking(false);
    };

    return (
        <DriverLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Live Tracking</h1>
                    <p className="text-gray-500 mt-1">Share your location with passengers in real-time</p>
                </div>

                {/* Tracking Status Card */}
                <div className={`rounded-xl shadow-sm border p-6 mb-6 ${
                    isTracking 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                        : 'bg-white border-gray-100'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                                isTracking ? 'bg-green-500' : 'bg-gray-200'
                            }`}>
                                <Navigation size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {isTracking 
                                        ? `${passengersNotified} passengers are tracking your location` 
                                        : 'Start tracking to share your location with passengers'}
                                </p>
                            </div>
                        </div>
                        {isTracking ? (
                            <button
                                onClick={handleStopTracking}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                            >
                                <Square size={20} />
                                Stop Tracking
                            </button>
                        ) : (
                            <button
                                onClick={handleStartTracking}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-lg"
                            >
                                <Play size={20} />
                                Start Tracking
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Map Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Current Location</h3>
                                {isTracking && (
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-sm text-green-600 font-medium">Live</span>
                                    </div>
                                )}
                            </div>
                            <GoogleMap
                                center={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                                markers={[{ lat: currentLocation.lat, lng: currentLocation.lng, label: 'Your Location' }]}
                                zoom={14}
                                height="500px"
                            />
                        </div>

                        {/* Traffic Alerts - SDG 11 Feature */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle size={20} className="text-orange-600" />
                                <h3 className="font-semibold text-gray-900">Traffic Alerts</h3>
                                <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                                    SDG 11: Sustainable Cities
                                </span>
                            </div>
                            <div className="space-y-3">
                                {trafficAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold">{alert.location}</h4>
                                                    <span className="text-xs opacity-75">{alert.time}</span>
                                                </div>
                                                <p className="text-sm opacity-90">{alert.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-800">
                                    💡 <strong>Smart Routing:</strong> Consider alternative routes to reduce congestion and emissions
                                </p>
                            </div>
                        </div>

                        {/* Route Progress with Traffic - NEW */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Navigation size={20} className="text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Route Progress & Traffic</h3>
                            </div>
                            <div className="relative">
                                {routeStops.map((stop, index) => (
                                    <div key={index} className="relative">
                                        {/* Connection Line */}
                                        {index < routeStops.length - 1 && (
                                            <div className={`absolute left-6 top-12 w-0.5 h-16 ${getTrafficColor(routeStops[index + 1].trafficLevel)}`}></div>
                                        )}
                                        
                                        {/* Stop Item */}
                                        <div className={`flex items-start gap-4 mb-4 p-3 rounded-lg transition-all ${
                                            stop.status === 'current' 
                                                ? 'bg-blue-50 border-2 border-blue-500' 
                                                : stop.status === 'completed'
                                                ? 'bg-gray-50 border border-gray-200'
                                                : 'bg-white border border-gray-200'
                                        }`}>
                                            {/* Stop Icon */}
                                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                                stop.status === 'completed' 
                                                    ? 'bg-green-500' 
                                                    : stop.status === 'current'
                                                    ? 'bg-blue-600 animate-pulse'
                                                    : 'bg-gray-400'
                                            }`}>
                                                {stop.status === 'completed' ? '✓' : index + 1}
                                            </div>

                                            {/* Stop Details */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-gray-900">{stop.name}</h4>
                                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                        stop.status === 'current' 
                                                            ? 'bg-blue-100 text-blue-700' 
                                                            : stop.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {stop.status === 'current' ? 'Current Location' : stop.status === 'completed' ? 'Completed' : 'Upcoming'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {stop.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        {stop.distance}
                                                    </span>
                                                </div>
                                                
                                                {/* Traffic Indicator */}
                                                <div className={`mt-2 flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border-2 ${getTrafficBorderColor(stop.trafficLevel)} ${
                                                    stop.trafficLevel === 'high' ? 'bg-red-50 text-red-700' :
                                                    stop.trafficLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                                    'bg-green-50 text-green-700'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full ${getTrafficColor(stop.trafficLevel)} animate-pulse`}></div>
                                                    {getTrafficLabel(stop.trafficLevel)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Traffic Legend */}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2">Traffic Levels</h4>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-600">Light</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span className="text-gray-600">Moderate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-600">Heavy</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Environmental Impact - SDG 11 Feature */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Leaf size={20} className="text-green-600" />
                                <h3 className="font-semibold text-gray-900">Environmental Impact</h3>
                                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                    SDG 11: Green Transport
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Leaf size={16} className="text-green-600" />
                                        <span className="text-xs text-gray-600">CO₂ Saved Today</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {environmentalMetrics.co2Saved.toFixed(1)} kg
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">vs. private vehicles</div>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Zap size={16} className="text-blue-600" />
                                        <span className="text-xs text-gray-600">Fuel Efficiency</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {environmentalMetrics.fuelEfficiency.toFixed(1)} km/L
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">current trip</div>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users size={16} className="text-purple-600" />
                                        <span className="text-xs text-gray-600">Passengers Served</span>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-600">
                                        {environmentalMetrics.passengersServed}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">reducing traffic</div>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingDown size={16} className="text-orange-600" />
                                        <span className="text-xs text-gray-600">Carbon Footprint</span>
                                    </div>
                                    <div className="text-2xl font-bold text-orange-600">
                                        {environmentalMetrics.carbonFootprint.toFixed(1)} kg
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">per passenger</div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                                <p className="text-xs text-green-800">
                                    🌱 <strong>Impact:</strong> By serving {environmentalMetrics.passengersServed} passengers, you've prevented {(environmentalMetrics.passengersServed * 1.6).toFixed(0)} private vehicles from the road today!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-6">
                        {/* Trip Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Trip Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Bus Number</p>
                                    <p className="font-semibold text-gray-900">WP NB-1234</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Route</p>
                                    <p className="font-semibold text-gray-900">Pettah - Homagama</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Route Number</p>
                                    <p className="font-semibold text-gray-900">#138</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Departure Time</p>
                                    <p className="font-semibold text-gray-900">09:00 AM</p>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Stats */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Tracking Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Users size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tracking Passengers</p>
                                        <p className="text-xl font-bold text-gray-900">{passengersNotified}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                        <Clock size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tracking Duration</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {isTracking ? '15 min' : '0 min'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                        <MapPin size={20} className="text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Updates Sent</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            {isTracking ? '180' : '0'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                            <h3 className="font-semibold text-blue-900 mb-3">SDG 11: Sustainable Transport</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">🚌</span>
                                    <span>Public transport reduces urban congestion</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">🌍</span>
                                    <span>Lower emissions per passenger vs. cars</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">📊</span>
                                    <span>Real-time data helps optimize routes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">♿</span>
                                    <span>Accessible transport for all citizens</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default LiveTracking;
