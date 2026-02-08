import { ReactNode } from 'react';
import DriverSidebar from './DriverSidebar';

interface DriverLayoutProps {
    children: ReactNode;
}

const DriverLayout = ({ children }: DriverLayoutProps) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <DriverSidebar />
            <div className="flex-1 lg:ml-64">
                {children}
            </div>
        </div>
    );
};

export default DriverLayout;
