import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to their appropriate dashboard if they try to access an unauthorized route
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'staff') return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/portal/dashboard" replace />;
  }

  return children;
};

