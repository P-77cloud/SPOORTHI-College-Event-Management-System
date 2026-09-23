import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Search, Users, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

const CoordinatorParticipants = () => {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';

  const [assignedEvents, setAssignedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const { showError } = useToast();

  useEffect(() => {
    // Load assigned events for dropdown
    api.get('/coordinator/events')
      .then((res) => {
        if (res.success && res.data) {
          setAssignedEvents(res.data);
          if (!selectedEventId && res.data.length > 0) {
            setSelectedEventId(res.data[0]._id);
          }
        }
      })
      .catch((err) => showError(err.message));
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchParticipants(selectedEventId);
    } else {
      setLoading(false);
    }
  }, [selectedEventId]);

  const fetchParticipants = (eventId) => {
    setLoading(true);
    api.get(`/registrations/event/${eventId}`)
      .then((res) => {
        if (res.success) {
          setParticipants(res.data);
        }
      })
      .catch((err) => {
        showError('Participant lookup error: ' + err.message);
      })
      .finally(() => setLoading(false));
  };

  const filteredParticipants = participants.filter((p) => {
    const term = searchFilter.toLowerCase();
    return (
      p.student?.name?.toLowerCase().includes(term) ||
      p.student?.usn?.toLowerCase().includes(term) ||
      p.registrationId?.toLowerCase().includes(term) ||
      p.student?.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Event Participants Directory</h1>
          <p className="page-subtitle">Lookup registered students, USN, contact info & payment status</p>
        </div>

        {/* Dropdown to switch event */}
        <div style={{ minWidth: '240px' }}>
          <select
            className="form-select"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            {assignedEvents.map((evt) => (
              <option key={evt._id} value={evt._id}>
                {evt.name} ({evt.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Filter by Student Name, USN (e.g. 1SG21CS042), or Registration ID..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading registered participants...
        </div>
      ) : filteredParticipants.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Users size={40} color="#6366f1" style={{ marginBottom: '1rem' }} />
          <h3>No Participants Found</h3>
          <p style={{ color: '#94a3b8' }}>No student registrations match your filter criteria.</p>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Registration ID</th>
                  <th>Student Name</th>
                  <th>USN / Roll No</th>
                  <th>Department</th>
                  <th>Contact Info</th>
                  <th>Payment Status</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((reg) => (
                  <tr key={reg._id}>
                    <td style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>
                      {reg.registrationId}
                    </td>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>
                      {reg.student?.name}
                    </td>
                    <td style={{ color: '#22d3ee', fontWeight: 600 }}>
                      {reg.student?.usn || 'N/A'}
                    </td>
                    <td style={{ color: '#cbd5e1' }}>
                      {reg.student?.department} ({reg.student?.semester})
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      <div>{reg.student?.email}</div>
                      <div>{reg.student?.phone ? `+91 ${reg.student?.phone}` : 'No phone'}</div>
                    </td>
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

export default CoordinatorParticipants;
