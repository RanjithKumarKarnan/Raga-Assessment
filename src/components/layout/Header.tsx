import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button } from '../ui/Button';
import { Menu } from 'lucide-react';

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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-2 lg:px-2 py-1">
        <div className="flex justify-between items-center py-[0.2rem]">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="p-2"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          
          {showNavigation && (
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className={window.location.pathname === '/dashboard' ? 'bg-blue-50 text-blue-600 border-blue-300' : ''}
              >
                Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/analytics')}
                className={window.location.pathname === '/analytics' ? 'bg-blue-50 text-blue-600 border-blue-300' : ''}
              >
                Analytics
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/patients')}
                className={window.location.pathname === '/patients' ? 'bg-blue-50 text-blue-600 border-blue-300' : ''}
              >
                Patients
              </Button>
              <div className="border-l border-gray-300 h-6 mx-2" />
              <Button
                variant="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
