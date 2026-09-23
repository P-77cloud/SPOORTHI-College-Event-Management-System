import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { KeyRound, Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState('');
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.success) {
        setSentMessage(res.message);
        showSuccess('Reset instructions generated!');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: '75vh',
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
          maxWidth: '440px',
          padding: '2.5rem',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
          }}
        >
          <KeyRound size={26} color="#6366f1" />
        </div>

        <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.5rem' }}>
          Reset Account Password
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          Enter your registered Gmail address to receive password reset links.
        </p>

        {sentMessage ? (
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              color: '#34d399',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            {sentMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Email Address</label>
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
                  placeholder="student@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {loading ? 'Sending...' : 'Send Reset Link'} <Send size={16} />
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.75rem' }}>
          <Link to="/login" className="btn btn-secondary btn-sm">
            <ArrowLeft size={16} /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
