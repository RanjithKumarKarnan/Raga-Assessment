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
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          !isMobile && !isCollapsed ? 'ml-64' : 'ml-0'
        }`}
      >
        <Header title={title} subtitle={subtitle} showNavigation={false} />

        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-2 lg:px-2 py-6">
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};