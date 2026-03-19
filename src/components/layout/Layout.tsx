import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from '../../contexts/SidebarContext';

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ title, subtitle, children }) => {
  const { isCollapsed, isMobile, setIsCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-500 ease-in-out ${
          !isMobile && !isCollapsed ? 'lg:ml-0' : 'ml-0'
        }`}
      >
        <Header title={title} subtitle={subtitle} showNavigation={false} />

        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};