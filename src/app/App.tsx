import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { AppRoutes } from './routes/AppRoutes';
import { SidebarProvider } from '../contexts/SidebarContext';
import { notificationService } from '../services/notificationService';

export const App: React.FC = () => {
  useEffect(() => {
    notificationService.initialize();
    notificationService.scheduleDailyReport();
  }, []);

  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
          </div>
        </AppProvider>
      </SidebarProvider>
    </BrowserRouter>
  );
};
