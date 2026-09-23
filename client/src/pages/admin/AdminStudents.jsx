import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, GraduationCap } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const { showError } = useToast();

  useEffect(() => {
    api.get('/admin/students')
      .then((res) => {
        if (res.success) {
          setStudents(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter((st) => {
    const term = filterText.toLowerCase();
    return (
      st.name?.toLowerCase().includes(term) ||
      st.email?.toLowerCase().includes(term) ||
      st.usn?.toLowerCase().includes(term) ||
      st.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">Registered Students Directory</h1>
        <p className="page-subtitle">Master roster of all registered students across departments</p>
      </div>

      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by student name, email, USN, or department..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading student roster...</div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Gmail / Email</th>
                  <th>USN / Roll No</th>
                  <th>Department & Sem</th>
                  <th>Phone</th>
                  <th>Event Registrations</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((st) => (
                  <tr key={st._id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{st.name}</td>
                    <td style={{ color: '#cbd5e1' }}>{st.email}</td>
                    <td style={{ color: '#6366f1', fontWeight: 600 }}>{st.usn || 'N/A'}</td>
                    <td style={{ color: '#cbd5e1' }}>{st.department} ({st.semester})</td>
                    <td style={{ color: '#94a3b8' }}>{st.phone ? `+91 ${st.phone}` : 'N/A'}</td>
                    <td><span className="badge badge-cultural">{st.registrationCount || 0} Events</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
