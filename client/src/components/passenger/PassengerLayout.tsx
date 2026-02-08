import { ReactNode } from 'react';
import PassengerSidebar from './PassengerSidebar';
import AccessibilityPanel from './AccessibilityPanel';
import { useAccessibility } from '../../context/AccessibilityContext';

interface PassengerLayoutProps {
    children: ReactNode;
}

const PassengerLayout = ({ children }: PassengerLayoutProps) => {
    const { contrastMode } = useAccessibility();

    const getThemeClasses = () => {
        switch (contrastMode) {
            case 'high':
                return 'brightness-110 contrast-125';
            case 'dark':
                return 'bg-gray-900 text-gray-100';
            default:
                return 'bg-gray-50';
        }
    };

    return (
        <div className={`flex h-screen ${contrastMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <PassengerSidebar />
            <main className={`flex-1 overflow-y-auto transition-all duration-300 ${getThemeClasses()}`}>
                <div className="p-8">
                    {children}
                </div>
            </main>
            <AccessibilityPanel />
        </div>
    );
};

export default PassengerLayout;
