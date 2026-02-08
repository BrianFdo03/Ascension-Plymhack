import React from 'react';
import {
    Home,
    Search,
    MapPin,
    Clock,
    Ticket,
    Heart,
    User
} from 'lucide-react';

import { useNavigate, useLocation } from 'react-router';
import { NotificationBell } from '../common/NotificationBell';

interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
}

interface PassengerSidebarProps {
    activePath?: string;
    onNavigate?: (path: string) => void;
}

const PassengerSidebar: React.FC<PassengerSidebarProps> = ({
    onNavigate
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const activePath = location.pathname;

    const mainNavItems: NavItem[] = [
        { label: 'Home', icon: Home, href: '/passenger' },
        { label: 'Search Routes', icon: Search, href: '/passenger/search' },
        { label: 'Book Seats', icon: Ticket, href: '/passenger/book-seats' },
        { label: 'Live Tracking', icon: MapPin, href: '/passenger/tracking' },
        { label: 'My Trips', icon: Clock, href: '/passenger/trips' },
        { label: 'Favorites', icon: Heart, href: '/passenger/favorites' },
    ];

    const bottomNavItems: NavItem[] = [
        { label: 'Profile', icon: User, href: '/passenger/profile' },
    ];

    const handleNavClick = (path: string) => {
        if (onNavigate) onNavigate(path);
        navigate(path);
        console.log(`Navigating to: ${path}`);
    };

    return (
        <aside className="flex flex-col w-64 h-screen px-5 py-8 bg-white border-r border-blue-100 text-blue-900 shadow-xl">

            {/* Brand Logo */}
            <div className="mb-10 px-2 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold tracking-wide text-[#2563EB]">
                        GoBus
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Passenger Portal</p>
                </div>
                <NotificationBell />
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-2">
                {mainNavItems.map((item) => {
                    const isActive = activePath === item.href;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl relative overflow-hidden group
                ${isActive
                                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
                                    : 'text-blue-700 hover:bg-blue-50 hover:text-[#2563EB]'
                                }
              `}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-[#2563EB] opacity-100 z-[-1]" />
                            )}
                            <Icon
                                size={20}
                                className={isActive
                                    ? 'text-white'
                                    : 'text-blue-600 group-hover:text-[#2563EB] transition-colors'}
                            />
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="mt-auto space-y-2 pt-6 border-t border-blue-100">
                {bottomNavItems.map((item) => {
                    const isActive = activePath === item.href;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl relative overflow-hidden group
                ${isActive
                                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/30'
                                    : 'text-blue-700 hover:bg-blue-50 hover:text-[#2563EB]'
                                }
              `}
                        >
                            <Icon
                                size={20}
                                className={isActive
                                    ? 'text-white'
                                    : 'text-blue-600 group-hover:text-[#2563EB] transition-colors'}
                            />
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default PassengerSidebar;
