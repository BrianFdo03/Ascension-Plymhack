import { Bus, Users, MessageSquare, MapPin, LogOut, Menu, X, TrendingUp } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { NotificationBell } from '../common/NotificationBell';

const DriverSidebar = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: Bus, label: 'Dashboard', path: '/driver' },
        { icon: Users, label: 'Booked Seats', path: '/driver/bookings' },
        { icon: MapPin, label: 'Live Tracking', path: '/driver/tracking' },
        { icon: TrendingUp, label: 'Route Traffic', path: '/driver/route-traffic' },
        { icon: MessageSquare, label: 'Chat', path: '/driver/chat' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Bus size={24} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Driver Portal</h1>
                                <p className="text-xs text-gray-500">Ascension</p>
                            </div>
                        </div>
                        <NotificationBell />
                    </div>
                </div>

                {/* Driver Info */}
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            SP
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Sunil Perera</p>
                            <p className="text-xs text-gray-600">License: B1234567</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-xs text-green-700 font-medium">On Duty</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                    isActive(item.path)
                                        ? 'bg-blue-50 text-blue-600 font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                />
            )}
        </>
    );
};

export default DriverSidebar;
