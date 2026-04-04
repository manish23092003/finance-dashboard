import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';

/**
 * Guards admin-only routes.
 * Redirects to /dashboard if user is not ADMIN.
 */
export default function AdminRoute() {
  const user = useAuthStore((s) => s.user);

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
