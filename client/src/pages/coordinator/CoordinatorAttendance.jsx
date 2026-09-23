import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { UserCheck, CheckCircle2, XCircle, Users, Search } from 'lucide-react';

const CoordinatorAttendance = () => {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';

  const [assignedEvents, setAssignedEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [registrations, setRegistrations] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({ total: 0, present: 0, absent: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterText, setFilterText] = useState('');

  const { showSuccess, showError } = useToast();

  useEffect(() => {
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
      fetchAttendanceData(selectedEventId);
    } else {
      setLoading(false);
    }
  }, [selectedEventId]);

  const fetchAttendanceData = (eventId) => {
    setLoading(true);
    api.get(`/registrations/event/${eventId}`)
      .then((res) => {
        if (res.success) {
          setRegistrations(res.data);
          const present = res.data.filter((r) => r.attendanceStatus === 'Present').length;
          const absent = res.data.filter((r) => r.attendanceStatus === 'Absent').length;
          setAttendanceSummary({ total: res.data.length, present, absent });
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  };

  const handleMarkStatus = async (reg, status) => {
    setUpdatingId(reg._id);
    try {
      const res = await api.post('/attendance', {
        eventId: selectedEventId,
        studentId: reg.student._id,
        registrationId: reg._id,
        status,
      });

      if (res.success) {
        showSuccess(`Marked ${reg.student.name} as '${status}'`);
        fetchAttendanceData(selectedEventId);
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    const term = filterText.toLowerCase();
    return (
      r.student?.name?.toLowerCase().includes(term) ||
      r.student?.usn?.toLowerCase().includes(term) ||
      r.registrationId?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Participant Attendance Marking</h1>
          <p className="page-subtitle">Mark Present or Absent for students attending assigned competitions</p>
        </div>

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

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TOTAL REGISTERED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{attendanceSummary.total}</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981' }}>PRESENT COUNT</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>{attendanceSummary.present}</div>
        </div>

        <div className="glass-card" style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#ef4444' }}>ABSENT COUNT</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ef4444' }}>{attendanceSummary.absent}</div>
        </div>
      </div>

      {/* Filter Input */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search student name or USN..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading attendance sheet...
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Registered Students Found</h3>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>USN / Roll No</th>
                  <th>Ticket ID</th>
                  <th>Payment Status</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Attendance Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg._id}>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{reg.student?.name}</td>
                    <td style={{ color: '#22d3ee', fontWeight: 600 }}>{reg.student?.usn || 'N/A'}</td>
                    <td style={{ fontFamily: 'monospace', color: '#f59e0b' }}>{reg.registrationId}</td>
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
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleMarkStatus(reg, 'Present')}
                          disabled={updatingId === reg._id}
                          className="btn btn-sm"
                          style={{
                            background: reg.attendanceStatus === 'Present' ? '#10b981' : 'rgba(16, 185, 129, 0.15)',
                            color: reg.attendanceStatus === 'Present' ? '#fff' : '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <CheckCircle2 size={14} /> Mark Present
                        </button>

                        <button
                          onClick={() => handleMarkStatus(reg, 'Absent')}
                          disabled={updatingId === reg._id}
                          className="btn btn-sm"
                          style={{
                            background: reg.attendanceStatus === 'Absent' ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                            color: reg.attendanceStatus === 'Absent' ? '#fff' : '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <XCircle size={14} /> Mark Absent
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
    </div>
  );
};

export default CoordinatorAttendance;
