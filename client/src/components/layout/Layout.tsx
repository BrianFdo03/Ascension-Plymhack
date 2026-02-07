import type { ReactNode } from 'react';
import Sidebar from '../common/Sidebar';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
}

const Layout = ({ children, title, action }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#FAFBFF]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {(title || action) && (
            <div className="flex justify-between items-center mb-8">
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {action && <div>{action}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
