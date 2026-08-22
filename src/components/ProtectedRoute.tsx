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

  // Provisório: para MVP local, vamos aceitar qualquer usuário logado ou checar se o email é o do admin.
  // Futuramente substituiremos por Custom Claims no token.
  if (adminOnly && !currentUser.email?.includes('admin')) {
    // Para fins de dev, se você logar com uma conta "admin@...", você entra.
    // Ou remova a verificação `includes('admin')` se quiser testar livremente.
    return <Navigate to="/app" replace />;
  }

  return children;
}
