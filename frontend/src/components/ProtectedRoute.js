import { Navigate } from 'react-router-dom';
import { getAuth } from '../auth';

export default function ProtectedRoute({ children, roles }) {
  const { token, user } = getAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
