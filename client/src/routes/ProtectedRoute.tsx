import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

/**
 * Guards all authenticated routes.
 * Redirects to /login if no valid auth state exists.
 */
export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
