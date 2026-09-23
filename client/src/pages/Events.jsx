import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Filter, Calendar, Sparkles } from 'lucide-react';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [feeType, setFeeType] = useState(searchParams.get('feeType') || 'all');

  const { isAuthenticated, isStudent } = useAuth();
  const { showError } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Cultural', 'Arts', 'Technical/Academic', 'Sports'];

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, feeType]);

  const fetchEvents = () => {
    setLoading(true);
    let url = '/events?';
    if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
    if (feeType !== 'all') url += `feeType=${feeType}&`;
    if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

    api.get(url)
      .then((res) => {
        if (res.success) {
          setEvents(res.data);
        }
      })
      .catch((err) => {
        showError('Failed to fetch events: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleRegisterClick = (event) => {
    if (!isAuthenticated) {
      showError('Please login as a Student to register for events');
      navigate('/login');
      return;
    }
    if (!isStudent) {
      showError('Only Students can register for events');
      return;
    }
    navigate(`/events/${event._id}`);
  };

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-cultural" style={{ marginBottom: '0.75rem' }}>
          <Sparkles size={14} /> SPOORTHI CATALOG
        </div>
        <h1 className="page-title">Fest Competitions & Events</h1>
        <p className="page-subtitle">
          Browse all 15 events, view detailed rules, check venue timings, and register.
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: 'flex', gap: '10px', width: '100%', flexWrap: 'wrap' }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={18}
              color="#94a3b8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
              placeholder="Search event name, venue, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Search Events
          </button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1rem',
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Fee Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Fee:</span>
            <button
              onClick={() => setFeeType('all')}
              className={`btn btn-sm ${feeType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All
            </button>
            <button
              onClick={() => setFeeType('free')}
              className={`btn btn-sm ${feeType === 'free' ? 'btn-primary' : 'btn-secondary'}`}
            >
              FREE
            </button>
            <button
              onClick={() => setFeeType('paid')}
              className={`btn btn-sm ${feeType === 'paid' ? 'btn-primary' : 'btn-secondary'}`}
            >
              ₹30 Paid
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Searching events in database...
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Calendar size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            No Events Found
          </h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            No fest events match your search parameters. Try resetting your category filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setFeeType('all');
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            Showing <strong>{events.length}</strong> event(s)
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {events.map((evt) => (
              <EventCard key={evt._id} event={evt} onRegisterClick={handleRegisterClick} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
