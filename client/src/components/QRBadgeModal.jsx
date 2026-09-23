import React from 'react';
import { X, Sparkles, CheckCircle2, QrCode, Calendar, MapPin, User, Ticket } from 'lucide-react';

const QRBadgeModal = ({ registration, onClose }) => {
  if (!registration) return null;

  const { registrationId, event, student, paymentStatus, attendanceStatus, registrationDate } = registration;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '0',
          overflow: 'hidden',
          border: '1px solid rgba(168, 85, 247, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Ticket Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            padding: '1.5rem',
            position: 'relative',
            color: '#ffffff',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0, 0, 0, 0.2)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={20} color="#f59e0b" />
            <span style={{ fontFamily: 'Outfit', fontWeight: 800, letterSpacing: '0.05em', fontSize: '1.1rem' }}>
              SPOORTHI FEST PASS
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2 }}>{event?.name}</h2>
          <div style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '4px' }}>Category: {event?.category}</div>
        </div>

        {/* Ticket Details Body */}
        <div style={{ padding: '1.5rem', background: '#0f172a' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.25rem',
              fontSize: '0.88rem',
            }}
          >
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Participant Name
              </div>
              <div style={{ color: '#ffffff', fontWeight: 700 }}>{student?.name}</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                USN / Roll No
              </div>
              <div style={{ color: '#6366f1', fontWeight: 700 }}>{student?.usn || 'N/A'}</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Event Date & Time
              </div>
              <div style={{ color: '#cbd5e1' }}>{event?.date} ({event?.startTime})</div>
            </div>

            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                Venue
              </div>
              <div style={{ color: '#cbd5e1' }}>{event?.venue}</div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px dashed rgba(255, 255, 255, 0.15)',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.15)',
              padding: '1rem 0',
              margin: '1rem 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>TICKET / REG ID</div>
              <div style={{ color: '#f59e0b', fontFamily: 'monospace', fontWeight: 700, fontSize: '1.05rem' }}>
                {registrationId}
              </div>
            </div>

            <div>
              <span className={`badge ${paymentStatus === 'Successful' || paymentStatus === 'FREE' ? 'badge-success' : 'badge-warning'}`}>
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* QR Code Simulation Container */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '130px',
                height: '130px',
                background: `url("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(registrationId)}") center/contain no-repeat`,
                marginBottom: '8px',
              }}
            />
            <div style={{ color: '#0f172a', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              SCAN AT ENTRY GATE
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
              Close Ticket Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRBadgeModal; // Wait export correct component name
