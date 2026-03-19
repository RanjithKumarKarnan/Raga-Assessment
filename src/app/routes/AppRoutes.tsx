import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const LoginPage = React.lazy(() => import('../../modules/auth/pages/LoginPage'));
const SignupPage = React.lazy(() => import('../../modules/auth/pages/SignupPage'));
const DashboardPage = React.lazy(() => import('../../modules/dashboard/pages/DashboardPage'));
const AnalyticsPage = React.lazy(() => import('../../modules/analytics/pages/AnalyticsPage'));
const PatientsPage = React.lazy(() => import('../../modules/patients/pages/PatientsPage'));

export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/signup" 
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />
          } 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <PatientsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
