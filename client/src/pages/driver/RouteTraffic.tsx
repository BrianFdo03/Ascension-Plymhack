import { useState } from 'react';
import DriverLayout from '../../components/driver/DriverLayout';
import { Navigation, MapPin, Clock, AlertTriangle, TrendingUp, Leaf } from 'lucide-react';

interface RouteStop {
    name: string;
    time: string;
    status: 'completed' | 'current' | 'upcoming';
    trafficLevel: 'low' | 'medium' | 'high';
    distance: string;
    estimatedDelay: string;
}

interface TrafficAlert {
    id: string;
    location: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    time: string;
}

const RouteTraffic = () => {
    const [routeStops] = useState<RouteStop[]>([
        { name: 'Pettah', time: '09:00 AM', status: 'completed', trafficLevel: 'low', distance: '0 km', estimatedDelay: 'On time' },
        { name: 'Borella', time: '09:15 AM', status: 'completed', trafficLevel: 'medium', distance: '3.2 km', estimatedDelay: '+2 min' },
        { name: 'Kotte', time: '09:30 AM', status: 'current', trafficLevel: 'high', distance: '6.5 km', estimatedDelay: '+5 min' },
        { name: 'Nugegoda', time: '09:45 AM', status: 'upcoming', trafficLevel: 'medium', distance: '9.8 km', estimatedDelay: '+3 min' },
        { name: 'Maharagama', time: '10:00 AM', status: 'upcoming', trafficLevel: 'low', distance: '13.2 km', estimatedDelay: 'On time' },
        { name: 'Homagama', time: '10:15 AM', status: 'upcoming', trafficLevel: 'low', distance: '17.5 km', estimatedDelay: 'On time' },
    ]);

    const [trafficAlerts] = useState<TrafficAlert[]>([
        { id: '1', location: 'Borella Junction', severity: 'high', description: 'Heavy traffic congestion due to road work', time: '2 min ago' },
        { id: '2', location: 'Kollupitiya', severity: 'medium', description: 'Moderate traffic - school zone', time: '5 min ago' },
        { id: '3', location: 'Bambalapitiya', severity: 'low', description: 'Minor delay expected', time: '10 min ago' },
    ]);

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

    // Calculate overall route statistics
    const totalStops = routeStops.length;
    const completedStops = routeStops.filter(s => s.status === 'completed').length;
    const heavyTrafficStops = routeStops.filter(s => s.trafficLevel === 'high').length;
    const totalDistance = routeStops[routeStops.length - 1].distance;

    return (
        <DriverLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Route Traffic Monitor</h1>
                    <p className="text-gray-500 mt-1">Real-time traffic conditions along your route</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Navigation size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Route Progress</p>
                                <p className="text-2xl font-bold text-gray-900">{completedStops}/{totalStops}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                                <AlertTriangle size={24} className="text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Heavy Traffic</p>
                                <p className="text-2xl font-bold text-gray-900">{heavyTrafficStops} stops</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <MapPin size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Distance</p>
                                <p className="text-2xl font-bold text-gray-900">{totalDistance}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                                <Leaf size={24} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">SDG Impact</p>
                                <p className="text-2xl font-bold text-gray-900">High</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Route Progress with Traffic */}
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
                                        <div className={`absolute left-6 top-12 w-0.5 h-20 ${getTrafficColor(routeStops[index + 1].trafficLevel)}`}></div>
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
                                                    {stop.status === 'current' ? 'Current' : stop.status === 'completed' ? 'Done' : 'Upcoming'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {stop.time}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />
                                                    {stop.distance}
                                                </span>
                                            </div>
                                            
                                            {/* Traffic & Delay Info */}
                                            <div className="flex items-center gap-2">
                                                <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border-2 ${getTrafficBorderColor(stop.trafficLevel)} ${
                                                    stop.trafficLevel === 'high' ? 'bg-red-50 text-red-700' :
                                                    stop.trafficLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                                                    'bg-green-50 text-green-700'
                                                }`}>
                                                    <div className={`w-2 h-2 rounded-full ${getTrafficColor(stop.trafficLevel)} animate-pulse`}></div>
                                                    {getTrafficLabel(stop.trafficLevel)}
                                                </div>
                                                <span className={`text-xs font-medium px-2 py-1 rounded ${
                                                    stop.estimatedDelay === 'On time' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                    {stop.estimatedDelay}
                                                </span>
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

                    {/* Traffic Alerts & SDG Info */}
                    <div className="space-y-6">
                        {/* Traffic Alerts */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle size={20} className="text-orange-600" />
                                <h3 className="font-semibold text-gray-900">Traffic Alerts</h3>
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
                        </div>

                        {/* SDG 11 Impact */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp size={20} className="text-green-600" />
                                <h3 className="font-semibold text-gray-900">SDG 11 Impact</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🚌</span>
                                        <span className="text-sm font-semibold text-gray-900">Reduced Congestion</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        By monitoring traffic, you help reduce urban congestion and improve city mobility
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">🌍</span>
                                        <span className="text-sm font-semibold text-gray-900">Lower Emissions</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Efficient routing reduces fuel consumption and carbon emissions
                                    </p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">📊</span>
                                        <span className="text-sm font-semibold text-gray-900">Data-Driven Transport</span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        Real-time data helps optimize public transport systems
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Smart Routing Tip */}
                        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                            <h3 className="font-semibold text-blue-900 mb-3">💡 Smart Routing Tips</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Consider alternative routes during heavy traffic</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Inform passengers about expected delays</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Maintain steady speed to improve fuel efficiency</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default RouteTraffic;
