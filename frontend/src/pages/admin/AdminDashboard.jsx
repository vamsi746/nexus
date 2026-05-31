import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import AdminLayout from './AdminLayout.jsx';
import AdminStats from './AdminStats.jsx';
import AdminVerification from './AdminVerification.jsx';
import AdminStartups from './AdminStartups.jsx';
import AdminStudents from './AdminStudents.jsx';
import AdminHackathons from './AdminHackathons.jsx';
import AdminOpportunities from './AdminOpportunities.jsx';
import AdminOrders from './AdminOrders.jsx';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [startups, setStartups] = useState([]);
  const [students, setStudents] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchAll();
  }, [token]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, suRes, stRes, hkRes, opRes, orRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/startups'),
        api.get('/admin/students'),
        api.get('/hackathons'),
        api.get('/opportunities'),
        api.get('/admin/orders'),
      ]);
      setStats(statsRes.data);
      setStartups(suRes.data);
      setStudents(stRes.data);
      setHackathons(hkRes.data);
      setOpportunities(opRes.data);
      setOrders(orRes.data);
    } catch (err) {
      console.error('Admin fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = useMemo(() => startups.filter(s => !s.verified).length, [startups]);

  // ─── ACTIONS ───
  const toggleVerify = useCallback(async (id) => {
    try {
      const res = await api.put(`/admin/startups/${id}/verify`);
      setStartups(prev => prev.map(s => s._id === id ? { ...s, verified: res.data.startup.verified } : s));
    } catch { alert('Verify failed'); }
  }, []);

  const toggleTrending = useCallback(async (id) => {
    try {
      const res = await api.put(`/admin/startups/${id}/trending`);
      setStartups(prev => prev.map(s => s._id === id ? { ...s, isTrending: res.data.startup.isTrending } : s));
    } catch { alert('Trending failed'); }
  }, []);

  const deleteStartup = useCallback(async (id) => {
    if (!confirm('Delete this startup and its owner account?')) return;
    try { await api.delete(`/admin/startups/${id}`); setStartups(prev => prev.filter(s => s._id !== id)); } catch { alert('Delete failed'); }
  }, []);

  const deleteStudent = useCallback(async (id) => {
    if (!confirm('Delete this student and their account?')) return;
    try { await api.delete(`/admin/students/${id}`); setStudents(prev => prev.filter(s => s._id !== id)); } catch { alert('Delete failed'); }
  }, []);

  const toggleHackTrending = useCallback(async (id) => {
    try {
      const res = await api.put(`/admin/hackathons/${id}/trending`);
      setHackathons(prev => prev.map(h => h._id === id ? { ...h, isTrending: res.data.hackathon.isTrending } : h));
    } catch { alert('Trending failed'); }
  }, []);

  const deleteHackathon = useCallback(async (id) => {
    if (!confirm('Delete this hackathon?')) return;
    try { await api.delete(`/admin/hackathons/${id}`); setHackathons(prev => prev.filter(h => h._id !== id)); } catch { alert('Delete failed'); }
  }, []);

  const updateOrderStatus = useCallback(async (id, status) => {
    try {
      const res = await api.put(`/admin/orders/${id}`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: res.data.order.status } : o));
    } catch { alert('Update failed'); }
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <div style={{ fontSize: 32, animation: 'spin 1s infinite linear', display: 'inline-block', marginBottom: 16 }}>⚡</div>
        <h3 style={{ color: 'var(--tx1)' }}>Loading admin dashboard...</h3>
      </div>
    );
  }

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={setActiveSection} pendingCount={pendingCount}>
      {activeSection === 'overview' && (
        <AdminStats
          stats={stats} startups={startups} students={students} hackathons={hackathons}
          opportunities={opportunities} orders={orders} pendingCount={pendingCount}
          onNavigate={setActiveSection}
        />
      )}
      {activeSection === 'verification' && (
        <AdminVerification startups={startups} onVerify={toggleVerify} onDelete={deleteStartup} />
      )}
      {activeSection === 'startups' && (
        <AdminStartups startups={startups} onVerify={toggleVerify} onTrending={toggleTrending} onDelete={deleteStartup} />
      )}
      {activeSection === 'students' && (
        <AdminStudents students={students} onDelete={deleteStudent} />
      )}
      {activeSection === 'hackathons' && (
        <AdminHackathons hackathons={hackathons} onTrending={toggleHackTrending} onDelete={deleteHackathon} />
      )}
      {activeSection === 'opportunities' && (
        <AdminOpportunities opportunities={opportunities} />
      )}
      {activeSection === 'orders' && (
        <AdminOrders orders={orders} onUpdateStatus={updateOrderStatus} />
      )}
    </AdminLayout>
  );
}
