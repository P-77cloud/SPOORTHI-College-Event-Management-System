import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, Sparkles, AlertCircle, Info } from 'lucide-react';

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    setLoading(true);
    api.get('/notifications')
      .then((res) => {
        if (res.success) {
          setNotifications(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.success) {
        showSuccess('All notifications marked as read');
        fetchNotifications();
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Notifications & Announcements</h1>
          <p className="page-subtitle">Event updates, coordinator broadcasts, and registration alerts</p>
        </div>
        <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm">
          <CheckCheck size={16} /> Mark All As Read
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Bell size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Notifications</h3>
          <p style={{ color: '#94a3b8' }}>You are all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className="glass-card"
              style={{
                padding: '1.25rem',
                borderLeft: notif.isRead ? '1px solid rgba(255, 255, 255, 0.08)' : '4px solid #6366f1',
                opacity: notif.isRead ? 0.75 : 1,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                    {notif.title}
                  </div>
                  <div style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '8px' }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Received: {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
                {!notif.isRead && <span className="badge badge-cultural">NEW</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;
