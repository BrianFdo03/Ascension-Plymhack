import React from 'react';
import {
    LayoutDashboard,
    Route,
    Users,
    Bus,
    LogOut
} from 'lucide-react';


// Define the shape of a navigation item
interface NavItem {
    label: string;
    icon: React.ElementType;
    href: string;
}

// Props interface
interface SidebarProps {
    activePath?: string; // To determine which item is highlighted
    onNavigate?: (path: string) => void; // Optional handler for clicks
}

const Sidebar: React.FC<SidebarProps> = ({
    activePath = '/dashboard',
    onNavigate
}) => {

    // Main navigation links
    const mainNavItems: NavItem[] = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
        { label: 'Routes', icon: Route, href: '/routes' },
        { label: 'Drivers', icon: Users, href: '/drivers' },
        { label: 'Vehicles', icon: Bus, href: '/vehicles' },
    ];

    // Helper to handle navigation clicks
    const handleNavClick = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        }
        // If you are using Next.js or React Router, you would add your router push logic here
        console.log(`Navigating to: ${path}`);
    };

    return (
        <aside className="flex flex-col w-64 h-screen px-5 py-8 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 text-white shadow-xl">
            {/* Brand Logo */}
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-wide">
                    GoBus
                </h1>
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
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' // Active State
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white' // Inactive State
                                }
              `}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 z-[-1]" />
                            )}
                            <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400 transition-colors'} />
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer Navigation (Store & Logout) */}
            <div className="mt-auto space-y-2 pt-6 border-t border-gray-200/50">
                {/* Logout */}
                <button
                    onClick={() => console.log('Logging out...')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
                >
                    <LogOut size={20} className="text-red-400" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;