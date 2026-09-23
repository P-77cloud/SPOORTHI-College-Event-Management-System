import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: '#6366f1', fontSize: '1.1rem', fontWeight: 600 }}>Authenticating session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div
          className="glass-card"
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            padding: '2.5rem',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <ShieldAlert size={56} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>
            Access Denied
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Your account role (<strong>{user.role}</strong>) does not have permission to access this area.
          </p>
          <Navigate to={user.role === 'ADMIN' ? '/admin/dashboard' : user.role === 'COORDINATOR' ? '/coordinator/dashboard' : '/student/dashboard'} replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
