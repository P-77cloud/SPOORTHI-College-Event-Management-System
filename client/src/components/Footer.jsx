import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        background: '#070a12',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: '4rem',
      }}
    >
      <div className="max-w-7xl">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Col 1: Fest Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={20} color="#ffffff" />
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                SPOORTHI
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Annual National Level Inter-College Cultural, Sports, Arts, and Technical Fest. Empowering student talent and engineering excellence.
            </p>
            <div style={{ color: '#64748b', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="#6366f1" /> Official College Management System
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li><Link to="/" style={{ hover: { color: '#6366f1' } }}>Home Overview</Link></li>
              <li><Link to="/events">Browse All 15 Events</Link></li>
              <li><Link to="/about">Fest Rules & Committee</Link></li>
              <li><Link to="/login">Portal Login (Admin/Coord/Student)</Link></li>
              <li><Link to="/register">Student Registration</Link></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Event Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <li><span style={{ color: '#c084fc' }}>Cultural</span> (Song, Dance, Mono Acting, 1 Min)</li>
              <li><span style={{ color: '#f472b6' }}>Arts</span> (Rangoli, Poster, Mehendi, Face Paint)</li>
              <li><span style={{ color: '#22d3ee' }}>Technical</span> (Quiz, Debate)</li>
              <li><span style={{ color: '#fbbf24' }}>Sports</span> (Throwball, Volleyball, Badminton)</li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Fest Help Desk
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#6366f1" /> Campus Main Quadrangle & Auditoriums
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#6366f1" /> support@spoorthi.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#6366f1" /> +91 98765 43210 / +91 91234 56780
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748b',
          }}
        >
          <div>© {new Date().getFullYear()} SPOORTHI - College Event Management System. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for College Fest Excellence
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
