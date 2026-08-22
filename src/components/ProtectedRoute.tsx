import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Lista provisória de UIDs de administradores (MVP)
  // Futuramente substituiremos por Custom Claims no token.
  const ADMIN_UIDS = ['NQglP9uMWUSi9cmgGjJut6YOTzs1'];

  if (adminOnly && !ADMIN_UIDS.includes(currentUser.uid)) {
    return <Navigate to="/app" replace />;
  }

  return children;
}
