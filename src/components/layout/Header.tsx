import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button } from '../ui/Button';
import { Menu, User, LogOut } from 'lucide-react';
import { clsx } from 'clsx';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNavigation?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  showNavigation = true 
}) => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { setIsCollapsed, isMobile } = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </Button>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight truncate">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-medium truncate">{subtitle}</p>
              )}
            </div>
          </div>
          
          {showNavigation && (
            <div className="flex items-center space-x-2">
              <div className="hidden lg:flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className={clsx(
                    "px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
                    window.location.pathname === '/dashboard'
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  )}
                >
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/analytics')}
                  className={clsx(
                    "px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
                    window.location.pathname === '/analytics'
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  )}
                >
                  Analytics
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/patients')}
                  className={clsx(
                    "px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200",
                    window.location.pathname === '/patients'
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white"
                  )}
                >
                  Patients
                </Button>
              </div>
              
              <div className="flex items-center space-x-1 sm:space-x-2 pl-2 border-l border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-600 hidden sm:flex"
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
