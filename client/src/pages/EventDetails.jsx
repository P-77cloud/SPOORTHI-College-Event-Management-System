import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  FileText,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);

  const { isAuthenticated, isStudent, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
    if (isAuthenticated && isStudent) {
      checkExistingRegistration();
    }
  }, [id, isAuthenticated]);

  const fetchEventDetails = () => {
    setLoading(true);
    api.get(`/events/${id}`)
      .then((res) => {
        if (res.success) {
          setEvent(res.data);
        }
      })
      .catch((err) => {
        showError('Event details error: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  const checkExistingRegistration = () => {
    api.get('/registrations/my')
      .then((res) => {
        if (res.success && res.data) {
          const match = res.data.find((reg) => reg.event._id === id);
          if (match) {
            setUserRegistration(match);
          }
        }
      })
      .catch(() => {});
  };

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showError('Please login as a student to register');
      navigate('/login');
      return;
    }

    if (!isStudent) {
      showError('Only students can register for events');
      return;
    }

    setRegistering(true);
    try {
      const res = await api.post('/registrations', { eventId: id });
      if (res.success) {
        if (res.requiresPayment) {
          showSuccess('Registration initiated! Please complete the ₹30 mock payment.');
          navigate(`/student/payment/${res.data._id}`);
        } else {
          showSuccess('Registration successful! Ticket pass generated.');
          fetchEventDetails();
          checkExistingRegistration();
        }
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Event Not Found</h2>
        <Link to="/events" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const isFull = event.registeredCount >= event.maxParticipants;

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <Link to="/events" className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Events Catalog
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Col: Poster & Coordinator */}
        <div>
          <div
            className="glass-card"
            style={{ padding: '0', overflow: 'hidden', marginBottom: '1.5rem' }}
          >
            <img
              src={event.posterUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
              alt={event.name}
              style={{ width: '100%', height: '340px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Assigned Coordinator Card */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="#6366f1" /> Assigned Event Coordinator
            </h4>

            {event.coordinator ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
                  {event.coordinator.name}
                </div>
                <div style={{ color: '#94a3b8' }}>Department: {event.coordinator.department || 'General'}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6366f1' }}>
                  <Mail size={16} /> {event.coordinator.email}
                </div>
                {event.coordinator.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                    <Phone size={16} /> +91 {event.coordinator.phone}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Coordinator details pending</div>
            )}
          </div>
        </div>

        {/* Right Col: Full Details & Registration Box */}
        <div>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <span className="badge badge-cultural">{event.category}</span>
              <span className={`badge ${event.registrationFee > 0 ? 'badge-paid' : 'badge-free'}`}>
                {event.registrationFee > 0 ? `₹${event.registrationFee} Registration Fee` : 'FREE Entry'}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '1rem', fontFamily: 'Outfit' }}>
              {event.name}
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {event.description}
            </p>

            {/* Event Schedule Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                padding: '1.25rem',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>DATE</div>
                <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Calendar size={16} color="#6366f1" /> {event.date}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>TIMINGS</div>
                <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Clock size={16} color="#a855f7" /> {event.startTime} - {event.endTime}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>VENUE</div>
                <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={16} color="#f59e0b" /> {event.venue}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>SEATS CAPACITY</div>
                <div style={{ color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Users size={16} color="#06b6d4" /> {event.registeredCount} / {event.maxParticipants} Registered
                </div>
              </div>
            </div>

            {/* Rules List */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#6366f1" /> Competition Rules & Guidelines
              </h3>
              {event.rules && event.rules.length > 0 ? (
                <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {event.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Standard SPOORTHI fest rulebook applies.</p>
              )}
            </div>

            {/* Registration CTA Panel */}
            <div
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Registration Fee</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: event.registrationFee > 0 ? '#f59e0b' : '#10b981' }}>
                  {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'FREE ENTRY'}
                </div>
              </div>

              {userRegistration ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <div className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    <CheckCircle2 size={16} /> Registered (ID: {userRegistration.registrationId})
                  </div>
                  {userRegistration.paymentStatus === 'Pending' && (
                    <Link
                      to={`/student/payment/${userRegistration._id}`}
                      className="btn btn-primary btn-sm"
                      style={{ marginTop: '4px' }}
                    >
                      Complete ₹30 Payment
                    </Link>
                  )}
                  {userRegistration.paymentStatus === 'Successful' && (
                    <Link to="/student/registrations" className="btn btn-secondary btn-sm">
                      View Digital Ticket Pass
                    </Link>
                  )}
                </div>
              ) : isFull ? (
                <button className="btn btn-secondary btn-lg" disabled>
                  Seats Full
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn btn-primary btn-lg"
                >
                  {registering
                    ? 'Processing...'
                    : event.registrationFee > 0
                    ? 'Register & Pay ₹30'
                    : 'Register For Free'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
