import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './ui/Loader';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { isAuthenticated, role, user, profileRequired, pwdChangeRequired, isLoading } = useAuth();

  // Show page spinner while authentication state is loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader size="lg" text="Authenticating session..." />
      </div>
    );
  }

  // Redirect to login if not authenticated, password change is required, phone number is unverified, or profile is required
  if (!isAuthenticated || !role || (user && user.phno === 'N/A') || profileRequired || pwdChangeRequired) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed
  if (allowedRole) {
    const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
    if (!roles.includes(role)) {
      if (role === 'SADMIN') {
        return <Navigate to="/sadmin" replace />;
      }
      // If Admin attempts to access User pages or vice-versa, redirect to their default home dashboards
      return <Navigate to={role === 'ADMIN' ? '/admin' : '/user'} replace />;
    }
  }

  return children;
};
