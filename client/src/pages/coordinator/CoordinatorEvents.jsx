import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Calendar, MapPin, Users, UserCheck, Clock, Edit } from 'lucide-react';

const CoordinatorEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    api.get('/coordinator/events')
      .then((res) => {
        if (res.success) {
          setEvents(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">My Assigned Events</h1>
        <p className="page-subtitle">Security Enforced: Only events assigned to your coordinator account are shown</p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading assigned events...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Events Currently Assigned</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Contact Chief Admin to assign competitions to your profile.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {events.map((evt) => (
            <div key={evt._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-cultural">{evt.category}</span>
                <span className={`badge ${evt.registrationFee > 0 ? 'badge-paid' : 'badge-free'}`}>
                  {evt.registrationFee > 0 ? `₹${evt.registrationFee}` : 'FREE'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>{evt.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                {evt.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.5rem' }}>
                <div><Calendar size={14} color="#6366f1" style={{ display: 'inline', marginRight: '6px' }} /> Date: {evt.date} ({evt.startTime})</div>
                <div><MapPin size={14} color="#a855f7" style={{ display: 'inline', marginRight: '6px' }} /> Venue: {evt.venue}</div>
                <div><Users size={14} color="#06b6d4" style={{ display: 'inline', marginRight: '6px' }} /> Seats: {evt.registeredCount} / {evt.maxParticipants}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <Link to={`/coordinator/participants?eventId=${evt._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  <Users size={14} /> Participants List
                </Link>
                <Link to={`/coordinator/attendance?eventId=${evt._id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <UserCheck size={14} /> Attendance
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoordinatorEvents;
