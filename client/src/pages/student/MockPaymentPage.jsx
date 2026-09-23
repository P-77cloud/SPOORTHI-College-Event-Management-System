import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const MockPaymentPage = () => {
  const { registrationId } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Mock UPI');
  const [processing, setProcessing] = useState(false);

  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/registrations/my')
      .then((res) => {
        if (res.success && res.data) {
          const match = res.data.find((r) => r._id === registrationId);
          if (match) {
            setRegistration(match);
          } else {
            showError('Registration record not found');
          }
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, [registrationId]);

  const handleProcessPayment = async (simulateFail = false) => {
    setProcessing(true);
    try {
      const res = await api.post('/payments', {
        registrationId,
        paymentMethod,
        simulateFailure: simulateFail,
      });

      if (res.success) {
        // Trigger celebratory confetti on success
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        showSuccess('Payment Successful! Registration Confirmed.');
        setTimeout(() => {
          navigate('/student/registrations');
        }, 1500);
      }
    } catch (err) {
      showError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
        Loading checkout payment details...
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="max-w-7xl" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Invalid Registration Reference</h2>
      </div>
    );
  }

  const fee = registration.event?.registrationFee || 30;

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
            <ShieldCheck size={18} /> MOCK PAYMENT GATEWAY
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Complete Event Payment
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Testing checkout for SPOORTHI fest competition registration
          </p>

          {/* Event Summary Box */}
          <div
            style={{
              padding: '1.25rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Competition:</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>{registration.event?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Registration ID:</span>
              <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{registration.registrationId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>Total Fee Due:</span>
              <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1.4rem' }}>₹{fee}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Select Payment Method</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('Mock UPI')}
                className={`btn btn-sm ${paymentMethod === 'Mock UPI' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexDirection: 'column', gap: '4px', padding: '0.85rem 0.5rem' }}
              >
                <QrCode size={20} /> Mock UPI
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Mock Card')}
                className={`btn btn-sm ${paymentMethod === 'Mock Card' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexDirection: 'column', gap: '4px', padding: '0.85rem 0.5rem' }}
              >
                <CreditCard size={20} /> Mock Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Mock NetBanking')}
                className={`btn btn-sm ${paymentMethod === 'Mock NetBanking' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexDirection: 'column', gap: '4px', padding: '0.85rem 0.5rem' }}
              >
                <Building size={20} /> NetBanking
              </button>
            </div>
          </div>

          {/* Simulated UPI QR / Card Details */}
          {paymentMethod === 'Mock UPI' && (
            <div
              style={{
                textAlign: 'center',
                padding: '1.25rem',
                background: '#ffffff',
                borderRadius: '12px',
                marginBottom: '1.75rem',
              }}
            >
              <div
                style={{
                  width: '140px',
                  height: '140px',
                  margin: '0 auto 8px auto',
                  background: `url("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=spoorthi@upi%26pn=SpoorthiFest%26am=${fee}") center/contain no-repeat`,
                }}
              />
              <div style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 700 }}>
                Scan to pay ₹{fee} via Google Pay / PhonePe / Paytm
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleProcessPayment(false)}
              disabled={processing}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
            >
              {processing ? 'Processing Payment...' : `Simulate Successful ₹${fee} Payment`} <CheckCircle2 size={18} />
            </button>

            <button
              onClick={() => handleProcessPayment(true)}
              disabled={processing}
              className="btn btn-secondary btn-sm"
              style={{ color: '#ef4444' }}
            >
              Simulate Failed Payment (Testing Error Handling)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockPaymentPage;
