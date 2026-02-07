import React from 'react';
import {
    LayoutDashboard,
    Route,
    Users,
    Bus
} from 'lucide-react';

interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
}

interface SidebarProps {
    activePath?: string;
    onNavigate?: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activePath = '/dashboard',
    onNavigate
}) => {

    const mainNavItems: NavItem[] = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Routes', icon: Route, href: '/routes' },
        { label: 'Drivers', icon: Users, href: '/drivers' },
        { label: 'Vehicles', icon: Bus, href: '/vehicles' },
    ];

    const handleNavClick = (path: string) => {
        if (onNavigate) onNavigate(path);
        console.log(`Navigating to: ${path}`);
    };

    return (
        <aside className="flex flex-col w-64 h-screen bg-white border-r border-slate-100 shadow-xl sticky top-0">

            {/* Brand Logo - Added tracking-tight for modern feel */}
            <div className="flex items-center h-24 px-8">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-[#2563EB]">
                    GoBus
                </h1>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {mainNavItems.map((item) => {
                    const isActive = activePath === item.href;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href)}
                            className={`
                                group relative w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-300 ease-out overflow-hidden
                                ${isActive
                                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/25 translate-x-1'
                                    : 'text-slate-500 hover:bg-blue-50 hover:text-[#2563EB] hover:pl-5'
                                }
                            `}
                        >
                            {/* Animated Background Reveal for Active State */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#1d4ed8] to-[#2563EB] opacity-100 z-0" />
                            )}

                            <Icon
                                size={22}
                                className={`
                                    relative z-10 transition-transform duration-300
                                    ${isActive
                                        ? 'text-white scale-110'
                                        : 'text-slate-400 group-hover:text-[#2563EB] group-hover:scale-110'
                                    }
                                `}
                            />
                            <span className="relative z-10 font-medium tracking-wide">
                                {item.label}
                            </span>

                            {/* Chevron for extra polish on active state (optional, adds direction) */}
                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white/40 ring-4 ring-white/10" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / User Profile Area - New Premium Addition */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#2563EB] font-bold text-lg group-hover:ring-2 group-hover:ring-blue-100 transition-all">
                        A
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#2563EB] transition-colors">Admin User</p>
                        <p className="text-xs text-slate-500 truncate">admin@gobus.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;