import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingSpinner } from '../LoadingSpinner';

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // ✅ Allow access to /reset-password without authentication
  const publicRoutes = ['/reset-password', '/forgot-password'];
  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}