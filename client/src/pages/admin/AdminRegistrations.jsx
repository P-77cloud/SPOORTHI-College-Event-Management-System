import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Ticket, Search } from 'lucide-react';

const AdminRegistrations = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const { showError } = useToast();

  useEffect(() => {
    api.get('/events')
      .then((res) => {
        if (res.success && res.data) {
          setEvents(res.data);
          if (res.data.length > 0) {
            setSelectedEventId(res.data[0]._id);
          }
        }
      })
      .catch((err) => showError(err.message));
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations(selectedEventId);
    } else {
      setLoading(false);
    }
  }, [selectedEventId]);

  const fetchRegistrations = (eventId) => {
    setLoading(true);
    api.get(`/registrations/event/${eventId}`)
      .then((res) => {
        if (res.success) {
          setRegistrations(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  };

  const filtered = registrations.filter((reg) => {
    const term = filterText.toLowerCase();
    return (
      reg.student?.name?.toLowerCase().includes(term) ||
      reg.student?.usn?.toLowerCase().includes(term) ||
      reg.registrationId?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Master Registration Audit Log</h1>
          <p className="page-subtitle">View all registered students and payment passes by competition</p>
        </div>

        <div style={{ minWidth: '240px' }}>
          <select
            className="form-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {events.map((evt) => (
              <option key={evt._id} value={evt._id}>
                {evt.name} ({evt.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search student, USN, or Registration Ticket ID..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading master registrations...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Registrations Logged</h3>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Student Name</th>
                  <th>USN / Roll No</th>
                  <th>Department</th>
                  <th>Payment Status</th>
                  <th>Attendance</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => (
                  <tr key={reg._id}>
                    <td style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>{reg.registrationId}</td>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{reg.student?.name}</td>
                    <td style={{ color: '#22d3ee', fontWeight: 600 }}>{reg.student?.usn || 'N/A'}</td>
                    <td style={{ color: '#cbd5e1' }}>{reg.student?.department}</td>
                    <td>
                      <span className={`badge ${reg.paymentStatus === 'Successful' || reg.paymentStatus === 'FREE' ? 'badge-success' : 'badge-warning'}`}>
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${reg.attendanceStatus === 'Present' ? 'badge-success' : reg.attendanceStatus === 'Absent' ? 'badge-danger' : 'badge-warning'}`}>
                        {reg.attendanceStatus}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{new Date(reg.registrationDate).toLocaleDateString()}</td>
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

export default AdminRegistrations;
