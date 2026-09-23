import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, Lock, Mail, Shield, UserCheck, GraduationCap, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      showSuccess(`Welcome back, ${result.user.name}! Login successful.`);
      const role = result.user.role;
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'COORDINATOR') {
        navigate('/coordinator/dashboard');
      } else {
        const from = location.state?.from?.pathname || '/student/dashboard';
        navigate(from);
      }
    } else {
      showError(result.message);
    }
  };

  const autoFillDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Spoorthi@123');
    showSuccess(`Auto-filled ${demoRole} credentials`);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '2.5rem',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
            }}
          >
            <Sparkles size={28} color="#ffffff" />
          </div>

          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            Portal Login
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Sign in to access Student, Coordinator, or Admin services
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.75rem',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
            Instant Demo Account Fill
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => autoFillDemo('student@gmail.com', 'STUDENT')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', flex: 1 }}
            >
              <GraduationCap size={14} color="#34d399" /> Student
            </button>

            <button
              type="button"
              onClick={() => autoFillDemo('coordinator@spoorthi.com', 'COORDINATOR')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', flex: 1 }}
            >
              <UserCheck size={14} color="#a855f7" /> Coordinator
            </button>

            <button
              type="button"
              onClick={() => autoFillDemo('admin@spoorthi.com', 'ADMIN')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', flex: 1 }}
            >
              <Shield size={14} color="#6366f1" /> Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email / Gmail Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@gmail.com or @spoorthi.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#6366f1' }}>
                Forgot password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={18}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {submitting ? 'Authenticating...' : 'Sign In To Portal'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: '#94a3b8' }}>
          New Student?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
