import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Calendar,
  Award,
  Users,
  Trophy,
  ArrowRight,
  Flame,
  Music,
  Palette,
  Code,
  Activity,
  CheckCircle2,
} from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isStudent } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/events')
      .then((res) => {
        if (res.success) {
          setEvents(res.data);
        }
      })
      .catch((err) => {
        showError('Failed to load fest events: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRegisterClick = (event) => {
    if (!isAuthenticated) {
      showError('Please login as a Student to register for events');
      navigate('/login');
      return;
    }
    if (!isStudent) {
      showError('Only Students can register for fest events');
      return;
    }
    navigate(`/events/${event._id}`);
  };

  const categories = [
    { name: 'Cultural', icon: Music, color: '#c084fc', desc: 'Song, Dance, Mono Acting, 1 Minute' },
    { name: 'Arts', icon: Palette, color: '#f472b6', desc: 'Rangoli, Poster Making, Mehendi, Face Paint, Nail Art, Essay' },
    { name: 'Technical/Academic', icon: Code, color: '#22d3ee', desc: 'Quiz, Debate' },
    { name: 'Sports', icon: Activity, color: '#fbbf24', desc: 'Throwball, Volleyball, Badminton' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 4rem 1.5rem',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.15) 50%, transparent 80%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div className="max-w-7xl" style={{ position: 'relative', zIndex: 1 }}>
          <div
            className="badge badge-cultural"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}
          >
            <Sparkles size={14} /> ANNUAL NATIONAL COLLEGE FEST 2026
          </div>

          <h1
            style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1.25rem',
              fontFamily: 'Outfit',
            }}
          >
            Welcome to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitFillColor: 'transparent',
              }}
            >
              SPOORTHI
            </span>
          </h1>


          <h2
            style={{
              fontSize: '1.3rem',
              color: '#c4b5fd',
              textAlign: 'center',
              marginTop: '-0.5rem',
              marginBottom: '1.5rem',
              fontWeight: 700,
            }}
          >
            Sree Siddaganga College of Arts Science and Commerce for Women
          </h2>



          <p
            style={{
              fontSize: '1.2rem',
              color: '#94a3b8',
              maxWidth: '750px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.6,
            }}
          >
            The Ultimate College Event Platform! Compete in 15 exciting competitions across Cultural, Arts, Technical & Sports. Showcase your passion, win glory & celebrate excellence.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/events" className="btn btn-primary btn-lg">
              Explore All 15 Events <ArrowRight size={20} />
            </Link>
            {!isAuthenticated && (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Student Registration
              </Link>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.5rem',
              marginTop: '4rem',
              textAlign: 'left',
            }}
          >
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={26} color="#6366f1" />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>15</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Flagship Competitions</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={26} color="#a855f7" />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>1000+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Student Participants</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={26} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>₹50,000+</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Cash Prizes</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={26} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>3 Days</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Oct 15 - 17, 2026</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="max-w-7xl" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Event Categories
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
            Filter and discover events matched to your skills
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={idx}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="glass-card glass-card-interactive"
                style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: `${cat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconComp size={28} color={cat.color} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>{cat.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5 }}>{cat.desc}</p>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: cat.color, display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}>
                  View Category Events <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Events Carousel / Grid */}
      <section className="max-w-7xl" style={{ padding: '3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Featured Fest Events
            </h2>
            <p style={{ color: '#94a3b8' }}>
              Handpicked top competitions waiting for your registration
            </p>
          </div>
          <Link to="/events" className="btn btn-outline btn-sm">
            View All 15 Events
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
            Loading fest events from database...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {events.slice(0, 6).map((evt) => (
              <EventCard
                key={evt._id}
                event={evt}
                onRegisterClick={handleRegisterClick}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="max-w-7xl" style={{ padding: '3rem 1.5rem' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '2.5rem' }}>
            How SPOORTHI Event Flow Works
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#6366f1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>
                1
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Create Account</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Register with your Name, Email, USN, Department, and Phone number.</p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#a855f7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>
                2
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Browse Competitions</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Explore 15 events in Cultural, Arts, Technical & Sports categories.</p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>
                3
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Instant / ₹30 Mock Payment</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Free events register instantly! Paid events use our mock UPI/Card test payment.</p>
            </div>

            <div>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1rem' }}>
                4
              </div>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Digital Ticket & Attendance</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Receive your QR ticket pass & view attendance marked by assigned event coordinators.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
