import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};
