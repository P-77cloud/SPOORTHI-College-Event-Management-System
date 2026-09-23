import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CreditCard, DollarSign } from 'lucide-react';

const AdminPayments = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    // Fetch all event registrations to build payment audit summary
    api.get('/events')
      .then(async (res) => {
        if (res.success && res.data) {
          const allRegsPromises = res.data.map((evt) => api.get(`/registrations/event/${evt._id}`));
          const results = await Promise.all(allRegsPromises);

          let combined = [];
          results.forEach((r, idx) => {
            if (r.success) {
              combined = combined.concat(r.data.map((item) => ({ ...item, eventName: res.data[idx].name })));
            }
          });

          setRegistrations(combined);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalCollected = registrations
    .filter((r) => r.paymentStatus === 'Successful')
    .reduce((acc, curr) => acc + (curr.event?.registrationFee || 30), 0);

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Mock Payment Transactions Audit Log</h1>
          <p className="page-subtitle">Track paid event revenue, transaction IDs & payment statuses</p>
        </div>

        <div className="glass-card" style={{ padding: '0.85rem 1.5rem', background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>TOTAL REVENUE COLLECTED</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>₹{totalCollected}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading mock payment audit logs...</div>
      ) : registrations.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>No Transactions Recorded</h3>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Transaction / Ticket ID</th>
                  <th>Student Name</th>
                  <th>USN</th>
                  <th>Competition Event</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg._id}>
                    <td style={{ fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>
                      {reg.payment?.transactionId || reg.registrationId}
                    </td>
                    <td style={{ fontWeight: 700, color: '#ffffff' }}>{reg.student?.name}</td>
                    <td style={{ color: '#22d3ee' }}>{reg.student?.usn || 'N/A'}</td>
                    <td style={{ color: '#cbd5e1' }}>{reg.event?.name || reg.eventName}</td>
                    <td style={{ fontWeight: 700, color: reg.paymentStatus === 'Successful' ? '#10b981' : '#cbd5e1' }}>
                      {reg.paymentStatus === 'FREE' ? 'FREE' : `₹${reg.payment?.amount || reg.event?.registrationFee || 30}`}
                    </td>
                    <td style={{ color: '#94a3b8' }}>{reg.payment?.paymentMethod || (reg.paymentStatus === 'FREE' ? 'N/A (FREE)' : 'Mock UPI')}</td>
                    <td>
                      <span className={`badge ${reg.paymentStatus === 'Successful' || reg.paymentStatus === 'FREE' ? 'badge-success' : reg.paymentStatus === 'Failed' ? 'badge-danger' : 'badge-warning'}`}>
                        {reg.paymentStatus}
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

export default AdminPayments;
