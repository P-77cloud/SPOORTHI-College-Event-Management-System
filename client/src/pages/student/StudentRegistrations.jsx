import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import QRBadgeModal from '../../components/QRBadgeModal';
import { Ticket, Calendar, MapPin, CheckCircle2, Clock, QrCode, AlertCircle } from 'lucide-react';

const StudentRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = () => {
    setLoading(true);
    api.get('/registrations/my')
      .then((res) => {
        if (res.success) {
          setRegistrations(res.data);
        }
      })
      .catch((err) => {
        showError('Failed to load registrations: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleCancelRegistration = async (id, eventName) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for '${eventName}'?`)) return;

    try {
      const res = await api.delete(`/registrations/${id}`);
      if (res.success) {
        showSuccess('Registration cancelled successfully');
        fetchRegistrations();
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Event Passes & Tickets</h1>
          <p className="page-subtitle">View your registered events, attendance status, and digital QR passes</p>
        </div>
        <Link to="/events" className="btn btn-primary btn-sm">
          + Register For More Events
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading your event passes...
        </div>
      ) : registrations.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Ticket size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            No Registered Events Found
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            You haven't registered for any SPOORTHI fest events yet.
          </p>
          <Link to="/events" className="btn btn-primary btn-sm">
            Browse All 15 Competitions
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {registrations.map((reg) => (
            <div key={reg._id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem' }}>
                {/* Event & Registration details */}
                <div style={{ flex: 1, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>{reg.event?.name}</h3>
                    <span className="badge badge-cultural">{reg.event?.category}</span>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#6366f1" /> {reg.event?.date} ({reg.event?.startTime})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#a855f7" /> {reg.event?.venue}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
                    <div style={{ color: '#94a3b8' }}>
                      Ticket ID: <strong style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{reg.registrationId}</strong>
                    </div>

                    {/* Attendance Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#64748b' }}>Attendance:</span>
                      <span className={`badge ${reg.attendanceStatus === 'Present' ? 'badge-success' : reg.attendanceStatus === 'Absent' ? 'badge-danger' : 'badge-warning'}`}>
                        {reg.attendanceStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span className={`badge ${reg.paymentStatus === 'Successful' || reg.paymentStatus === 'FREE' ? 'badge-success' : 'badge-warning'}`}>
                    Payment: {reg.paymentStatus}
                  </span>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {reg.paymentStatus === 'Pending' ? (
                      <Link to={`/student/payment/${reg._id}`} className="btn btn-primary btn-sm">
                        Pay ₹30 Now
                      </Link>
                    ) : (
                      <button onClick={() => setSelectedTicket(reg)} className="btn btn-secondary btn-sm">
                        <QrCode size={16} /> View Digital Pass
                      </button>
                    )}

                    <button
                      onClick={() => handleCancelRegistration(reg._id, reg.event?.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#ef4444' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <QRBadgeModal registration={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default StudentRegistrations;
