import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { User, Mail, BookOpen, Building2, Phone, GraduationCap, Save } from 'lucide-react';

const StudentProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    usn: user?.usn || '',
    department: user?.department || 'Computer Science',
    semester: user?.semester || '6th Sem',
    phone: user?.phone || '',
  });

  const [saving, setSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.success) {
        updateUserProfile(res.data);
        showSuccess('Profile updated successfully!');
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Student Profile</h1>
        <p className="page-subtitle">Manage your personal information and academic identification</p>
      </div>

      <div className="glass-card" style={{ maxWidth: '640px', padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email (Read Only)</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              disabled
              style={{ opacity: 0.7, cursor: 'not-allowed' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">USN / Roll Number</label>
              <input
                type="text"
                name="usn"
                className="form-input"
                value={formData.usn}
                onChange={handleChange}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                name="department"
                className="form-input"
                value={formData.department}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Semester</label>
              <input
                type="text"
                name="semester"
                className="form-input"
                value={formData.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1rem' }}>
            {saving ? 'Saving...' : 'Save Profile Changes'} <Save size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
