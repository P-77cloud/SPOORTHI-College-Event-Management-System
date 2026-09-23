import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const EventCard = ({ event, isRegistered, onRegisterClick }) => {
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Cultural': return 'badge-cultural';
      case 'Arts': return 'badge-arts';
      case 'Technical/Academic': return 'badge-technical';
      case 'Sports': return 'badge-sports';
      default: return 'badge-primary';
    }
  };

  const isFull = event.registeredCount >= event.maxParticipants;

  return (
    <div
      className="glass-card glass-card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* Poster Image */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        <img
          src={event.posterUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
          alt={event.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 15, 25, 0.9) 0%, transparent 60%)',
          }}
        />

        {/* Category & Fee Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span className={`badge ${getCategoryBadgeClass(event.category)}`}>
            {event.category}
          </span>

          <span className={`badge ${event.registrationFee > 0 ? 'badge-paid' : 'badge-free'}`}>
            {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'FREE'}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontSize: '1.2rem',
            color: '#ffffff',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
          }}
        >
          {event.name}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {event.description}
        </p>

        {/* Meta details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={14} color="#6366f1" />
            <span>{event.date} ({event.startTime})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="#a855f7" />
            <span>{event.venue}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={14} color="#06b6d4" />
            <span>{event.registeredCount} / {event.maxParticipants} Seats Filled</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
          <Link
            to={`/events/${event._id}`}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1 }}
          >
            Details
          </Link>

          {isRegistered ? (
            <div
              className="btn btn-sm"
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                cursor: 'default',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={14} /> Registered
            </div>
          ) : isFull ? (
            <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.6 }}>
              Full
            </button>
          ) : (
            <button
              onClick={() => onRegisterClick && onRegisterClick(event)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.2 }}
            >
              Register Now <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
