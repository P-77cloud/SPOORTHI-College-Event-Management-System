import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  Sparkles,
  Calendar,
  User,
  LogOut,
  Bell,
  LayoutDashboard,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isCoordinator, isStudent } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then((res) => {
          if (res.success) {
            setUnreadCount(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (isAdmin) return '/admin/dashboard';
    if (isCoordinator) return '/coordinator/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(11, 15, 25, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="max-w-7xl"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '74px',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Outfit',
                fontSize: '1.45rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              SPOORTHI
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em' }}>
              COLLEGE EVENT MANAGEMENT SYSTEM
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/' ? '#6366f1' : '#cbd5e1',
              transition: 'color 0.2s',
            }}
          >
            Home
          </Link>

          <Link
            to="/events"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/events' ? '#6366f1' : '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Calendar size={16} />
            Events
          </Link>

          <Link
            to="/about"
            style={{
              fontWeight: 600,
              fontSize: '0.95rem',
              color: location.pathname === '/about' ? '#6366f1' : '#cbd5e1',
            }}
          >
            About
          </Link>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {isStudent && (
                <Link
                  to="/student/notifications"
                  style={{
                    position: 'relative',
                    padding: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-2px',
                        right: '-2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )}

              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                <LayoutDashboard size={16} />
                Dashboard ({user.role})
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Logout">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Student Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
