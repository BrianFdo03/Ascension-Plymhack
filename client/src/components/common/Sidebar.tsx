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
        // If you are using Next.js or React Router, you would add your router push logic here
        console.log(`Navigating to: ${path}`);
    };

    return (
        <aside className="flex flex-col w-64 h-screen px-5 py-8 bg-[#F9F7F2] border-r border-[#EFEBE0]">
            {/* Brand Logo */}
            <div className="mb-10 px-2">
                <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-wide">
                    LUMIÈRE ADMIN
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
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-xl
                ${isActive
                                    ? 'bg-white text-gray-900 shadow-sm' // Active State
                                    : 'text-gray-500 hover:bg-white/50 hover:text-gray-900' // Inactive State
                                }
              `}
                        >
                            <Icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-400'} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Footer Navigation (Store & Logout) */}
            <div className="mt-auto space-y-2 pt-6 border-t border-gray-200/50">
                {/* Back to Store */}
                <button
                    onClick={() => handleNavClick('/')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-white/50 rounded-xl transition-colors"
                >
                    <Home size={20} className="text-gray-400" />
                    Back to Store
                </button>

                {/* Logout */}
                <button
                    onClick={() => console.log('Logging out...')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                    <LogOut size={20} className="text-red-500" />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;