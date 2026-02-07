import React from 'react';
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ShoppingCart,
    Users,
    Home,
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
        { label: 'Products', icon: Package, href: '/products' },
        { label: 'Categories', icon: FolderOpen, href: '/categories' },
        { label: 'Orders', icon: ShoppingCart, href: '/orders' },
        { label: 'Users', icon: Users, href: '/users' },
    ];

    // Helper to handle navigation clicks
    const handleNavClick = (path: string) => {
        if (onNavigate) {
            onNavigate(path);
        }
        console.log(`Navigating to: ${path}`);
    };

    return (
        <aside className="flex flex-col w-64 h-screen px-5 py-8 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 text-white shadow-xl">
            {/* Brand Logo */}
            <div className="mb-10 px-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">L</div>
                <h1 className="text-xl font-serif font-bold text-white tracking-wide">
                    LUMIÈRE <span className="text-blue-400">ADMIN</span>
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
            <div className="mt-auto space-y-2 pt-6 border-t border-slate-700/50">
                {/* Back to Store */}
                <button
                    onClick={() => handleNavClick('/')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors group"
                >
                    <Home size={20} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                    Back to Store
                </button>

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