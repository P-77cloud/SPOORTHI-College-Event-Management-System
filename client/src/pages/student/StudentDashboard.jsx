import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import QRBadgeModal from '../../components/QRBadgeModal';
import {
  GraduationCap,
  Calendar,
  Ticket,
  Bell,
  CreditCard,
  User,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [regRes, notifRes] = await Promise.all([
        api.get('/registrations/my'),
        api.get('/notifications'),
      ]);

      if (regRes.success) setRegistrations(regRes.data);
      if (notifRes.success) setNotifications(notifRes.data.slice(0, 5));
    } catch (err) {
      showError('Failed to load dashboard data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const paidCount = registrations.filter((r) => r.paymentStatus === 'Successful' || r.paymentStatus === 'FREE').length;
  const pendingCount = registrations.filter((r) => r.paymentStatus === 'Pending').length;

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Welcome Header */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
            <Sparkles size={16} /> STUDENT PORTAL
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            Welcome, {user?.name}!
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            USN: <strong>{user?.usn || 'N/A'}</strong> | Department: <strong>{user?.department}</strong> | Sem: <strong>{user?.semester}</strong>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/events" className="btn btn-primary btn-sm">
            Browse Events
          </Link>
          <Link to="/student/profile" className="btn btn-secondary btn-sm">
            <User size={16} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ticket size={24} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{registrations.length}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Registrations</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{paidCount}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Confirmed Tickets</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Pending Payments</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Registrations + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: My Registered Events */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#6366f1" /> My Registered Events
            </h3>
            <Link to="/student/registrations" style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 600 }}>
              View All Passes →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading registered events...</div>
          ) : registrations.length === 0 ? (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <Ticket size={42} color="#6366f1" style={{ marginBottom: '1rem' }} />
              <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Event Registrations Yet</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Explore the 15 fest competitions and secure your entry pass.</p>
              <Link to="/events" className="btn btn-primary btn-sm">Explore Fest Events</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {registrations.slice(0, 4).map((reg) => (
                <div key={reg._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>{reg.event?.name}</span>
                      <span className="badge badge-cultural">{reg.event?.category}</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      Date: {reg.event?.date} ({reg.event?.startTime}) | Venue: {reg.event?.venue}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }}>
                      Ticket ID: {reg.registrationId}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${reg.paymentStatus === 'Successful' || reg.paymentStatus === 'FREE' ? 'badge-success' : 'badge-warning'}`}>
                      {reg.paymentStatus}
                    </span>

                    {reg.paymentStatus === 'Pending' ? (
                      <Link to={`/student/payment/${reg._id}`} className="btn btn-primary btn-sm">
                        Pay ₹30 Now
                      </Link>
                    ) : (
                      <button onClick={() => setSelectedTicket(reg)} className="btn btn-secondary btn-sm">
                        <Ticket size={14} /> Ticket Pass
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Notifications Widget */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={20} color="#a855f7" /> Latest Alerts
            </h3>
            <Link to="/student/notifications" style={{ fontSize: '0.85rem', color: '#a855f7', fontWeight: 600 }}>
              View All
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '1.25rem' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', padding: '1.5rem 0' }}>
                No notifications yet
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map((notif) => (
                  <div key={notif._id} style={{ paddingBottom: '10px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '2px' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {notif.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Pass Modal */}
      {selectedTicket && (
        <QRBadgeModal registration={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default StudentDashboard;
