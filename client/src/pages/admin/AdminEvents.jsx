import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, UserCheck } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cultural',
    description: '',
    posterUrl: '',
    date: '2026-10-18',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venue: 'Seminar Hall A',
    coordinator: '',
    maxParticipants: 50,
    registrationDeadline: '2026-10-17',
    rules: '',
    registrationFee: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchEventsAndCoordinators();
  }, []);

  const fetchEventsAndCoordinators = async () => {
    setLoading(true);
    try {
      const [eventsRes, coordRes] = await Promise.all([
        api.get('/events'),
        api.get('/admin/coordinators'),
      ]);

      if (eventsRes.success) setEvents(eventsRes.data);
      if (coordRes.success) {
        setCoordinators(coordRes.data);
        if (coordRes.data.length > 0 && !formData.coordinator) {
          setFormData((prev) => ({ ...prev, coordinator: coordRes.data[0]._id }));
        }
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setFormData({
      name: '',
      category: 'Cultural',
      description: '',
      posterUrl: '',
      date: '2026-10-18',
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venue: 'Seminar Hall A',
      coordinator: coordinators[0]?._id || '',
      maxParticipants: 50,
      registrationDeadline: '2026-10-17',
      rules: '',
      registrationFee: 0,
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (evt) => {
    setEditingEvent(evt);
    setFormData({
      name: evt.name,
      category: evt.category,
      description: evt.description,
      posterUrl: evt.posterUrl || '',
      date: evt.date,
      startTime: evt.startTime,
      endTime: evt.endTime,
      venue: evt.venue,
      coordinator: evt.coordinator?._id || coordinators[0]?._id || '',
      maxParticipants: evt.maxParticipants,
      registrationDeadline: evt.registrationDeadline || evt.date,
      rules: Array.isArray(evt.rules) ? evt.rules.join('\n') : evt.rules || '',
      registrationFee: evt.registrationFee || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      rules: typeof formData.rules === 'string' ? formData.rules.split('\n').filter(Boolean) : formData.rules,
    };

    try {
      let res;
      if (editingEvent) {
        res = await api.put(`/events/${editingEvent._id}`, payload);
      } else {
        res = await api.post('/events', payload);
      }

      if (res.success) {
        showSuccess(editingEvent ? 'Event updated successfully' : 'New event created');
        setShowModal(false);
        fetchEventsAndCoordinators();
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to cancel/delete event '${name}'? Registered participants will be notified.`)) return;

    try {
      const res = await api.delete(`/events/${id}`);
      if (res.success) {
        showSuccess('Event deleted and participants notified');
        fetchEventsAndCoordinators();
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Manage Fest Events</h1>
          <p className="page-subtitle">Create events, set rules, fees, venue timings, and assign coordinators</p>
        </div>

        <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Create New Fest Event
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading events...
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Fee</th>
                  <th>Assigned Coordinator</th>
                  <th>Seats Registered</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt._id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{evt.name}</td>
                    <td><span className="badge badge-cultural">{evt.category}</span></td>
                    <td style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{evt.date} ({evt.startTime})</td>
                    <td style={{ color: '#cbd5e1' }}>{evt.venue}</td>
                    <td>
                      <span className={`badge ${evt.registrationFee > 0 ? 'badge-paid' : 'badge-free'}`}>
                        {evt.registrationFee > 0 ? `₹${evt.registrationFee}` : 'FREE'}
                      </span>
                    </td>
                    <td style={{ color: '#a855f7', fontWeight: 600 }}>{evt.coordinator?.name || 'N/A'}</td>
                    <td>{evt.registeredCount} / {evt.maxParticipants}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button onClick={() => handleOpenEditModal(evt)} className="btn btn-secondary btn-sm">
                          <Edit size={14} /> Edit
                        </button>

                        <button onClick={() => handleDeleteEvent(evt._id, evt.name)} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1.5rem' }}>
              {editingEvent ? `Edit Event: ${editingEvent.name}` : 'Create New Event'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Event Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Cultural">Cultural</option>
                    <option value="Arts">Arts</option>
                    <option value="Technical/Academic">Technical/Academic</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Coordinator *</label>
                  <select
                    className="form-select"
                    value={formData.coordinator}
                    onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                    required
                  >
                    {coordinators.map((c) => (
                      <option key={c._id} value={c._id}>{c.name} ({c.department})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Registration Fee (₹) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.registrationFee}
                    onChange={(e) => setFormData({ ...formData, registrationFee: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Event Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Venue *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Poster Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.posterUrl}
                  onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rules (One rule per line)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  {submitting ? 'Saving...' : editingEvent ? 'Save Event Changes' : 'Create Event'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
