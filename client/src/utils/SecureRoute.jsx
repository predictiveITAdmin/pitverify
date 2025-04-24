import React from 'react'
import { useLocation, Navigate } from 'react-router-dom';

const SecureRoute = ({isAuthenticated, children}) => {
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/" state={{ from: location }} replace />;
}

export default SecureRoute