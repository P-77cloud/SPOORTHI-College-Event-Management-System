import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { UserCheck, UserPlus, Trash2, Edit3, Mail, Phone, Building2, ShieldAlert } from 'lucide-react';

const AdminCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Spoorthi@123',
    department: 'Computer Science',
    phone: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = () => {
    setLoading(true);
    api.get('/admin/coordinators')
      .then((res) => {
        if (res.success) {
          setCoordinators(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  };

  const handleCreateCoordinator = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/admin/coordinators', formData);
      if (res.success) {
        showSuccess('Coordinator created successfully!');
        setShowModal(false);
        setFormData({ name: '', email: '', password: 'Spoorthi@123', department: 'Computer Science', phone: '' });
        fetchCoordinators();
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoordinator = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete coordinator '${name}'?`)) return;

    try {
      const res = await api.delete(`/admin/coordinators/${id}`);
      if (res.success) {
        showSuccess('Coordinator deleted');
        fetchCoordinators();
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.put(`/admin/coordinators/${id}`, {
        isDeactivated: !currentStatus,
      });
      if (res.success) {
        showSuccess(`Account ${!currentStatus ? 'deactivated' : 'activated'}`);
        fetchCoordinators();
      }
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Manage Event Coordinators</h1>
          <p className="page-subtitle">Create coordinator logins, assign events & monitor permissions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
          <UserPlus size={16} /> Create New Coordinator
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading coordinator directory...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {coordinators.map((coord) => (
            <div
              key={coord._id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                opacity: coord.isDeactivated ? 0.6 : 1,
                borderLeft: coord.isDeactivated ? '4px solid #ef4444' : '4px solid #a855f7',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>{coord.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#a855f7', fontWeight: 600 }}>
                    {coord.department}
                  </div>
                </div>

                <span className={`badge ${coord.isDeactivated ? 'badge-danger' : 'badge-success'}`}>
                  {coord.isDeactivated ? 'Deactivated' : 'Active'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="#6366f1" /> {coord.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="#10b981" /> {coord.phone ? `+91 ${coord.phone}` : 'No phone listed'}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                  Assigned Events ({coord.assignedEvents?.length || 0})
                </div>
                {coord.assignedEvents && coord.assignedEvents.length > 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
                    {coord.assignedEvents.map((e) => e.name).join(', ')}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>No active events assigned</div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleToggleStatus(coord._id, coord.isDeactivated)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  {coord.isDeactivated ? 'Activate' : 'Deactivate'}
                </button>

                <button
                  onClick={() => handleDeleteCoordinator(coord._id, coord.name)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coordinator Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1.5rem' }}>Create New Coordinator</h2>

            <form onSubmit={handleCreateCoordinator}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Prof. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="coordinator@spoorthi.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Computer Science"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="9123456780"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  {submitting ? 'Creating...' : 'Create Account'}
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

export default AdminCoordinators;
