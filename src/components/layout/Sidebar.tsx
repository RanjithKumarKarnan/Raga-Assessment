import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSidebar } from '../../contexts/SidebarContext';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  LogOut,
  X,
  Activity,
  User
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
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
      icon: Users,
      label: 'Patients',
      path: '/patients'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics'
    }
  ];

  return (
    <div className={`bg-white border-r border-gray-100 h-screen transition-all duration-500 ease-in-out flex flex-col ${
      isCollapsed ? 'w-16 sm:w-20' : 'w-64'
    } fixed left-0 top-0 z-50 ${
      isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'
    } lg:relative lg:translate-x-0 lg:z-auto`}>
      {/* Logo/Brand Section */}
      <div className="flex justify-start px-[1rem] md:px-0 md:justify-center pb-1 pt-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors flex-1"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 text-left">
                <h2 className="text-lg font-bold text-gray-900 leading-tight">MediCare</h2>
                <p className="text-xs text-gray-500 font-medium">Healthcare System</p>
              </div>
            )}
          </button>
          {!isCollapsed && !isMobile && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2 py-4 flex-1">
        <div className="space-y-2">
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
                className={clsx(
                  "w-full flex items-center justify-start px-5 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={clsx(
                  "w-6 h-6 flex-shrink-0 transition-colors",
                  isActive ? "text-blue-700" : "text-gray-500 group-hover:text-gray-700"
                )} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="mt-auto border-t border-gray-100">
        <div className="p-3">
          {!isCollapsed ? (
            <div className="space-y-3">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.displayName || user?.email?.split('@')[0] || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'admin@medicare.com'}
                  </p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group border border-red-100"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
