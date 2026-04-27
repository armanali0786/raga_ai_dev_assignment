import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Redirects unauthenticated users to /login
export const ProtectedRoute: React.FC = () => {
  const { user, initialized } = useAppSelector((s) => s.auth);

  if (!initialized) {
    return <LoadingSpinner fullPage message="Initializing session…" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

// Redirects authenticated users away from /login
export const PublicRoute: React.FC = () => {
  const { user, initialized } = useAppSelector((s) => s.auth);

  if (!initialized) {
    return <LoadingSpinner fullPage message="Initializing session…" />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
