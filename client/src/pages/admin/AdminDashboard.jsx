import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  UserCheck,
  Calendar,
  Ticket,
  DollarSign,
  Clock,
  Sparkles,
  TrendingUp,
  BarChart2,
  ArrowRight,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    api.get('/admin/stats')
      .then((res) => {
        if (res.success) {
          setStats(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading admin control panel...
      </div>
    );
  }

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
            <Sparkles size={16} /> CHIEF ADMIN DASHBOARD
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            SPOORTHI Fest Administration
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Full control over coordinators, events, registration audit logs, and mock payment analytics
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/events" className="btn btn-primary btn-sm">
            + Create New Event
          </Link>
          <Link to="/admin/coordinators" className="btn btn-secondary btn-sm">
            + Add Coordinator
          </Link>
          <Link to="/admin/analytics" className="btn btn-outline btn-sm">
            <BarChart2 size={16} /> Analytics
          </Link>
        </div>
      </div>

      {/* Top 7 Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL STUDENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>{stats?.totalStudents}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#a855f7', fontWeight: 600 }}>COORDINATORS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>{stats?.totalCoordinators}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: 600 }}>TOTAL EVENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1', marginTop: '4px' }}>{stats?.totalEvents}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#22d3ee', fontWeight: 600 }}>REGISTRATIONS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#22d3ee', marginTop: '4px' }}>{stats?.totalRegistrations}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>PAID TICKETS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{stats?.paidRegistrations}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>PENDING PAYMENTS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>{stats?.pendingPayments}</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>MOCK REVENUE</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>₹{stats?.totalRevenue}</div>
        </div>
      </div>

      {/* Main Grid: Popular Events & Recent Registrations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left: Top Popular Events */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Popular Events (By Demand)</h3>
            <Link to="/admin/events" style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 600 }}>View All Events</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.popularEvents?.map((evt) => (
              <div key={evt._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{evt.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Category: {evt.category} | Coord: {evt.coordinator?.name || 'N/A'}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>{evt.registeredCount} Seats</div>
                  <span className="badge badge-cultural">Max {evt.maxParticipants}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Registrations Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Recent Registrations Log</h3>
            <Link to="/admin/registrations" style={{ color: '#a855f7', fontSize: '0.85rem', fontWeight: 600 }}>Master Log</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.recentRegistrations?.map((reg) => (
              <div key={reg._id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{reg.student?.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Event: {reg.event?.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>USN: {reg.student?.usn || 'N/A'}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${reg.paymentStatus === 'Successful' || reg.paymentStatus === 'FREE' ? 'badge-success' : 'badge-warning'}`}>
                    {reg.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
