import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useRole();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
