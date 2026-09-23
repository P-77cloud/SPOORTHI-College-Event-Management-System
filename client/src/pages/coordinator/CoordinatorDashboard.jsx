import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  Send,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError, showSuccess } = useToast();

  // Announcement state
  const [announcementEventId, setAnnouncementEventId] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = () => {
    setLoading(true);
    api.get('/coordinator/stats')
      .then((res) => {
        if (res.success) {
          setStats(res.data);
          if (res.data.assignedEvents && res.data.assignedEvents.length > 0) {
            setAnnouncementEventId(res.data.assignedEvents[0]._id);
          }
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  };

  const handleSendAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementTitle || !announcementMessage) {
      showError('Please provide title and message');
      return;
    }

    setSending(true);
    try {
      const res = await api.post('/notifications/announcement', {
        eventId: announcementEventId,
        title: announcementTitle,
        message: announcementMessage,
      });

      if (res.success) {
        showSuccess(res.message);
        setAnnouncementTitle('');
        setAnnouncementMessage('');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading coordinator dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div
        className="glass-card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a855f7', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
            <Sparkles size={16} /> EVENT COORDINATOR CONTROL PANEL
          </div>
          <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '0.35rem' }}>
            Welcome, {user?.name}
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Department: <strong>{user?.department}</strong> | Manage your assigned fest competitions
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/coordinator/events" className="btn btn-primary btn-sm">
            Assigned Events ({stats?.totalAssignedEvents || 0})
          </Link>
          <Link to="/coordinator/attendance" className="btn btn-secondary btn-sm">
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{stats?.totalAssignedEvents}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assigned Events</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#6366f1" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{stats?.totalParticipants}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total Participants</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={22} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{stats?.paidParticipants}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Paid / Confirmed</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={22} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{stats?.attendance?.presentCount || 0}</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Present Students</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Events List & Broadcast Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Assigned Events List */}
        <div style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>My Assigned Events</h3>
            <Link to="/coordinator/events" style={{ color: '#a855f7', fontSize: '0.85rem', fontWeight: 600 }}>
              View All Details →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.assignedEvents?.map((evt) => (
              <div key={evt._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ color: '#ffffff', fontSize: '1.1rem' }}>{evt.name}</h4>
                    <span className="badge badge-cultural">{evt.category}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Date: {evt.date} ({evt.startTime}) | Venue: {evt.venue}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                    Registered: {evt.registeredCount} / {evt.maxParticipants} max seats
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to={`/coordinator/participants?eventId=${evt._id}`} className="btn btn-secondary btn-sm">
                    <Users size={14} /> Participants
                  </Link>
                  <Link to={`/coordinator/attendance?eventId=${evt._id}`} className="btn btn-primary btn-sm">
                    <UserCheck size={14} /> Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Broadcast Form */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '1.25rem' }}>
            Send Event Announcement
          </h3>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <form onSubmit={handleSendAnnouncement}>
              <div className="form-group">
                <label className="form-label">Select Assigned Event</label>
                <select
                  className="form-select"
                  value={announcementEventId}
                  onChange={(e) => setAnnouncementEventId(e.target.value)}
                >
                  {stats?.assignedEvents?.map((evt) => (
                    <option key={evt._id} value={evt._id}>
                      {evt.name} ({evt.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Announcement Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Venue Change / Reporting Time"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Write clear instructions for registered participants..."
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={sending} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                {sending ? 'Sending...' : 'Broadcast Announcement'} <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
