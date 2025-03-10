// frontend/src/routes/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      if (!isAuthenticated) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Si requiere rol de admin, verificarlo
      if (adminOnly) {
        const isUserAdmin = AuthService.isAdmin();
        setIsAuthorized(isUserAdmin);
      } else {
        // Usuario normal autenticado
        setIsAuthorized(true);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [adminOnly]);

  if (isLoading) {
    // Mostrar un spinner mientras verifica
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirigir a login si no está autorizado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autorizado, renderizar los hijos (componente protegido)
  return children;
};

export default ProtectedRoute;