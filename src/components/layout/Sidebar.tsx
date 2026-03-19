import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebar } from '../../contexts/SidebarContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const { isCollapsed, setIsCollapsed, isMobile } = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics'
    },
    {
      icon: Users,
      label: 'Patients',
      path: '/patients'
    }
  ];

  return (
    <div className={`bg-white shadow-lg h-screen transition-all duration-300 ease-in-out flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    } fixed left-0 top-0 z-40 ${isMobile && isCollapsed ? '-translate-x-full' : ''}`}>
      <div className="p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Healthcare</h2>
                <p className="text-xs text-gray-500">Management System</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <X className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <nav className="px-2 py-4 flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    setIsCollapsed(true);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 '
                    : 'text-gray-700 hover:bg-gray-50'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};
