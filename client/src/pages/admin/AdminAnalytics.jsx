import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Activity } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => {
        if (res.success) {
          setAnalytics(res.data);
        }
      })
      .catch((err) => showError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const CATEGORY_COLORS = ['#c084fc', '#f472b6', '#22d3ee', '#fbbf24'];
  const PAYMENT_COLORS = ['#34d399', '#fbbf24', '#f87171', '#a78bfa'];

  if (loading) {
    return (
      <div style={{ padding: '5rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading fest analytics charts...
      </div>
    );
  }

  const categoryData = analytics?.categoryStats?.map((item) => ({
    name: item._id,
    registrations: item.totalRegistrations,
    events: item.totalEvents,
  })) || [];

  const paymentData = analytics?.paymentStats?.map((item) => ({
    name: item._id,
    value: item.count,
  })) || [];

  const attendanceData = analytics?.attendanceStats?.map((item) => ({
    name: item._id,
    count: item.count,
  })) || [];

  return (
    <div className="max-w-7xl animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div className="page-header">
        <h1 className="page-title">SPOORTHI Fest Analytics Dashboard</h1>
        <p className="page-subtitle">Interactive visual analytics for event popularity, revenue streams, and attendance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {/* Chart 1: Registrations By Category */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#6366f1" /> Registrations By Category
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar dataKey="registrations" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Payment Status Distribution */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieIcon size={20} color="#a855f7" /> Payment Status Distribution
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Legend formatter={(value) => <span style={{ color: '#cbd5e1' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Attendance Breakdown */}
        <div className="glass-card" style={{ padding: '1.75rem', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="#10b981" /> Attendance Breakdown (Present vs Absent)
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
