import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const SecureRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default SecureRoute;
