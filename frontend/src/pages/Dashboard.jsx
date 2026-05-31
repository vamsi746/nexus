import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Card from '../components/shared/Card.jsx';
import Avatar from '../components/shared/Avatar.jsx';
import Badge from '../components/shared/Badge.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import StudentDashboard from './student/StudentDashboard.jsx';

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Admin and Account Manager State
  const [stats, setStats] = useState(null);
  const [startups, setStartups] = useState([]);
  const [students, setStudents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  // Startup State
  const [myStartup, setMyStartup] = useState(null);
  const [myOpportunities, setMyOpportunities] = useState([]);
  const [myHackathons, setMyHackathons] = useState([]);
  const [showOppModal, setShowOppModal] = useState(false);
  const [showHackModal, setShowHackModal] = useState(false);

  // Student State
  const [studentApps, setStudentApps] = useState([]);
  const [studentHacks, setStudentHacks] = useState([]);

  // Opportunity / Hackathon creation form state
  const [oppForm, setOppForm] = useState({ title: '', type: 'Full-Time', location: '', compensation: '', duration: 'Permanent', tags: '' });
  const [hackForm, setHackForm] = useState({ title: '', prizePool: '', spots: 0, maxSpots: 1000, deadline: '', status: 'open', tags: '', duration: '48 hours', description: '' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [token, user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'admin' || user.role === 'service_provider') {
        const statsRes = await api.get('/admin/stats');
        setStats(statsRes.data);

        const startupsRes = await api.get('/startups');
        setStartups(startupsRes.data);

        const ordersRes = await api.get('/admin/orders');
        setOrders(ordersRes.data);

        if (user.role === 'admin') {
          const studentsRes = await api.get('/admin/students');
          setStudents(studentsRes.data);
          const hacksRes = await api.get('/admin/hackathons');
          setHackathons(hacksRes.data);
        }
      } else if (user.role === 'startup_admin') {
        // Fetch startup detail owned by this user
        const allStartups = await api.get('/startups');
        const mine = allStartups.data.find(s => s.userId === user.id || s.userId?._id === user.id || s.name);
        if (mine) {
          setMyStartup(mine);
          
          // Get opportunities and hackathons
          const oppsRes = await api.get('/opportunities');
          setMyOpportunities(oppsRes.data.filter(o => o.company === mine.name || o.startupId === mine._id));

          const hackRes = await api.get('/hackathons');
          setMyHackathons(hackRes.data.filter(h => h.startupName === mine.name || h.startupId === mine._id));
        }
      } else if (user.role === 'student') {
        const appsRes = await api.get('/opportunities/applied');
        setStudentApps(appsRes.data);

        const hacksRes = await api.get('/hackathons/registered');
        setStudentHacks(hacksRes.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── ADMIN ACTIONS ───
  const toggleVerifyStartup = async (id) => {
    try {
      const res = await api.put(`/admin/startups/${id}/verify`);
      setStartups(prev => prev.map(s => s._id === id ? { ...s, verified: res.data.startup.verified } : s));
    } catch (err) {
      alert('Verification state update failed');
    }
  };

  const toggleTrending = async (id) => {
    try {
      const res = await api.put(`/admin/startups/${id}/trending`);
      setStartups(prev => prev.map(s => s._id === id ? { ...s, isTrending: res.data.startup.isTrending } : s));
    } catch (err) {
      alert('Trending toggle failed');
    }
  };

  const deleteStartup = async (id) => {
    if (!confirm('Are you sure you want to delete this startup profile and its associated user account?')) return;
    try {
      await api.delete(`/admin/startups/${id}`);
      setStartups(prev => prev.filter(s => s._id !== id));
      fetchDashboardData();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  const toggleHackathonTrending = async (id) => {
    try {
      const res = await api.put(`/admin/hackathons/${id}/trending`);
      setHackathons(prev => prev.map(h => h._id === id ? { ...h, isTrending: res.data.hackathon.isTrending } : h));
    } catch (err) {
      alert('Hackathon trending toggle failed');
    }
  };

  const deleteHackathon = async (id) => {
    if (!confirm('Are you sure you want to delete this hackathon?')) return;
    try {
      await api.delete(`/admin/hackathons/${id}`);
      setHackathons(prev => prev.filter(h => h._id !== id));
      fetchDashboardData();
    } catch (err) {
      alert('Hackathon deletion failed');
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student profile and user?')) return;
    try {
      await api.delete(`/admin/students/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
      fetchDashboardData();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  // ─── ACCOUNT MANAGER ACTIONS ───
  const updateOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/admin/orders/${editingOrder._id}`, editingOrder);
      setOrders(prev => prev.map(o => o._id === editingOrder._id ? res.data.order : o));
      setEditingOrder(null);
      fetchDashboardData();
    } catch (err) {
      alert('Order update failed');
    }
  };

  // ─── STARTUP ACTIONS ───
  const updateStartupProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/startups/${myStartup._id}`, myStartup);
      setMyStartup(res.data);
      alert('Startup profile updated successfully');
    } catch (err) {
      alert('Profile update failed');
    }
  };

  const createOpportunity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...oppForm,
        company: myStartup.name,
        color: myStartup.color || '#7C6EFA',
        initials: myStartup.initials || 'ST',
        tags: oppForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        startupId: myStartup._id
      };
      const res = await api.post('/opportunities', payload);
      setMyOpportunities(prev => [res.data, ...prev]);
      setShowOppModal(false);
      setOppForm({ title: '', type: 'Full-Time', location: '', compensation: '', duration: 'Permanent', tags: '' });
    } catch (err) {
      alert('Opportunity creation failed');
    }
  };

  const createHackathon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...hackForm,
        startupName: myStartup.name,
        color: myStartup.color || '#7C6EFA',
        initials: myStartup.initials || 'ST',
        tags: hackForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        startupId: myStartup._id
      };
      const res = await api.post('/hackathons', payload);
      setMyHackathons(prev => [res.data, ...prev]);
      setShowHackModal(false);
      setHackForm({ title: '', prizePool: '', spots: 0, maxSpots: 1000, deadline: '', status: 'open', tags: '', duration: '48 hours', description: '' });
    } catch (err) {
      alert('Hackathon creation failed');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <div style={{ fontSize: 32, animation: 'spin 1s infinite linear', display: 'inline-block', marginBottom: 16 }}>⚡</div>
        <h3 style={{ color: 'var(--tx1)' }}>Loading your dashboard...</h3>
      </div>
    );
  }

  if (!user) return null;

  // Route admin & service_provider to the new Admin Dashboard
  if (user.role === 'admin' || user.role === 'service_provider') {
    return <AdminDashboard />;
  }

  // Route student to the new Student Dashboard
  if (user.role === 'student') {
    return <StudentDashboard />;
  }

  // ─── RENDER ADMIN DASHBOARD ───
  const renderAdmin = () => {
    const pendingList = startups.filter(s => !s.verified);
    return (
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
          <div>
            <span className="chip" style={{ background: 'rgba(251,113,133,0.1)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.25)' }}>🔒 Admin Access</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>Global Control Panel</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => fetchDashboardData()}>Refresh Data</button>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Accounts', val: stats?.users || 0, icon: '👥', color: '#7C6EFA' },
            { label: 'Registered Startups', val: stats?.startups || 0, icon: '🚀', color: '#22D3EE' },
            { label: 'Verified Startups', val: startups.filter(s => s.verified).length, icon: '✓', color: '#34D399' },
            { label: 'Student Members', val: stats?.students || 0, icon: '🎓', color: '#FCD34D' },
            { label: 'Service Projects', val: stats?.orders || 0, icon: '🏢', color: '#FB7185' },
          ].map(s => (
            <Card key={s.label} style={{ borderLeft: `3px solid ${s.color}`, padding: 20 }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: 13, color: 'var(--tx2)', fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--tx0)', marginTop: 8 }}>
                {s.val}
              </div>
            </Card>
          ))}
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 24 }}>
          {['verification', 'startups', 'hackathons', 'students', 'services'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`btn ${activeTab === t ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
              {t.toUpperCase()} {t === 'verification' && pendingList.length > 0 && <span style={{ background: '#FB7185', color: '#fff', borderRadius: '50%', padding: '1px 6px', fontSize: 10, marginLeft: 4 }}>{pendingList.length}</span>}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'verification' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Verification Queue ({pendingList.length})</h2>
            {pendingList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg2)', borderRadius: 12, color: 'var(--tx2)' }}>
                🎉 Zero pending verification requests. Nice job!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 14 }}>
                {pendingList.map(s => (
                  <Card key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div className="flex gap-3 items-center">
                      <Avatar initials={s.initials || 'ST'} color={s.color || '#7C6EFA'} size={44} />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx0)' }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 3 }}>
                          Stage: <b>{s.stage}</b> &middot; Location: {s.location} &middot; Raised: {s.raised}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-success btn-sm" onClick={() => toggleVerifyStartup(s._id)}>Verify &rarr;</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteStartup(s._id)}>Decline</button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'startups' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Manage Startups ({startups.length})</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {startups.map(s => (
                <Card key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div className="flex gap-3 items-center">
                    <Avatar initials={s.initials || 'ST'} color={s.color || '#7C6EFA'} size={40} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {s.name}
                        <span className="chip" style={{ background: s.verified ? 'rgba(52,211,153,0.1)' : 'rgba(252,211,77,0.1)', color: s.verified ? '#34D399' : '#FCD34D', fontSize: 10 }}>
                          {s.verified ? 'Verified' : 'Pending'}
                        </span>
                        {s.isTrending && (
                          <span className="chip" style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.25)', fontSize: 10 }}>
                            🔥 Trending
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                        Stage: {s.stage} &middot; Team: {s.teamSize || s.team} people &middot; Raised: {s.raised}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => toggleVerifyStartup(s._id)}>
                      {s.verified ? 'Revoke Verification' : 'Verify'}
                    </button>
                    <button className={`btn btn-sm ${s.isTrending ? 'btn-primary' : 'btn-ghost'}`} onClick={() => toggleTrending(s._id)}>
                      {s.isTrending ? 'Remove from Trending' : 'Set Trending'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteStartup(s._id)}>Delete</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hackathons' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Manage Hackathons ({hackathons.length})</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {hackathons.map(h => (
                <Card key={h._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div className="flex gap-3 items-center">
                    <Avatar initials={h.initials || 'H'} color={h.color || '#7C6EFA'} size={44} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{h.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                        <b>{h.startupName}</b> &middot; Prize: {h.prizePool} &middot; Status: <span style={{ color: h.status === 'open' ? '#34D399' : '#FCD34D' }}>{h.status?.toUpperCase()}</span>
                      </div>
                      {h.isTrending && (
                        <span className="chip" style={{ background: 'rgba(99,102,241,0.12)', color: '#818CF8', border: '1px solid rgba(99,102,241,0.25)', fontSize: 10, marginTop: 4 }}>
                          🔥 Trending
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className={`btn btn-sm ${h.isTrending ? 'btn-primary' : 'btn-ghost'}`} onClick={() => toggleHackathonTrending(h._id)}>
                      {h.isTrending ? 'Remove from Trending' : 'Set Trending'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteHackathon(h._id)}>Delete</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Registered Students ({students.length})</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {students.map(st => (
                <Card key={st._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div className="flex gap-3 items-center">
                    <Avatar initials={st.fullName?.slice(0, 2).toUpperCase() || 'ST'} color="#7C6EFA" size={40} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700 }}>{st.fullName}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                        🎓 {st.university} &middot; {st.degree} in {st.major} &middot; Class of {st.graduationYear}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(st._id)}>Delete Account</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Enterprise Service Orders ({orders.length})</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {orders.map(o => (
                <Card key={o._id} style={{ borderLeft: '3px solid var(--accent)' }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: 8 }}>
                    <div>
                      <span className="chip" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', fontSize: 10 }}>{o.serviceType?.toUpperCase()}</span>
                      <h4 style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{o.title || 'Custom Engagement'}</h4>
                      <p style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 4 }}>
                        Requested by: <b>{o.startupId?.name || 'Startup Company'}</b>
                      </p>
                    </div>
                    <div>
                      <span className="chip" style={{
                        background: o.status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(252,211,77,0.1)',
                        color: o.status === 'completed' ? '#34D399' : '#FCD34D'
                      }}>{o.status?.toUpperCase()}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--tx1)', margin: '10px 0' }}>{o.description}</p>
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 10 }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--tx2)' }}>REVENUE QUOTE</span>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#34D399' }}>${(o.budget || 0).toLocaleString()}</div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setEditingOrder(o)}>Update Quote / Status</button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER ACCOUNT MANAGER DASHBOARD ───
  const renderAccountManager = () => {
    return (
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
          <div>
            <span className="chip" style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.25)' }}>🏢 Account Manager Access</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>Revenue & Operations</h1>
          </div>
          <button className="btn btn-outline" onClick={() => fetchDashboardData()}>Refresh Invoices</button>
        </div>

        {/* REVENUE STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
          <Card style={{ borderLeft: '3px solid #34D399', background: 'linear-gradient(135deg, rgba(52,211,153,0.05) 0%, transparent 100%)' }}>
            <span style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>TOTAL QUOTED VOLUME</span>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#34D399', marginTop: 6 }}>${(stats?.revenue || 0).toLocaleString()}</div>
            <p style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 8 }}>Aggregated budget from all COE service contracts</p>
          </Card>
          <Card style={{ borderLeft: '3px solid #7C6EFA' }}>
            <span style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>TOTAL SERVICE REQUESTS</span>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent-light)', marginTop: 6 }}>{stats?.orders || 0} Inquiries</div>
            <p style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 8 }}>From brand kits to software deployment scale</p>
          </Card>
          <Card style={{ borderLeft: '3px solid #FCD34D' }}>
            <span style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>PENDING INQUIRIES</span>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#FCD34D', marginTop: 6 }}>{stats?.pendingOrders || 0} Reviewing</div>
            <p style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 8 }}>Require quote specifications and assignment</p>
          </Card>
        </div>

        {/* ORDERS & QUOTATION MANAGEMENT */}
        <div>
          <h2 className="section-title" style={{ marginBottom: 16 }}>COE Financial Invoices & Service Orders</h2>
          <div style={{ display: 'grid', gap: 14 }}>
            {orders.map(o => (
              <Card key={o._id} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 10 }}>
                  <div>
                    <span className="chip" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)', fontSize: 10 }}>
                      {o.serviceType?.toUpperCase()}
                    </span>
                    <h3 style={{ fontSize: 17, fontWeight: 700, marginTop: 6 }}>{o.title || 'Custom Service Execution'}</h3>
                    <p style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                      Client: <b>{o.startupId?.name || 'Startup Client'}</b> &middot; Stage: {o.startupId?.stage}
                    </p>
                  </div>
                  <div>
                    <span className="chip" style={{
                      background: o.status === 'completed' ? 'rgba(52,211,153,0.1)' : 'rgba(252,211,77,0.1)',
                      color: o.status === 'completed' ? '#34D399' : '#FCD34D'
                    }}>{o.status?.toUpperCase()}</span>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--tx1)', lineHeight: 1.6, marginBottom: 16 }}>{o.description}</p>
                <div className="flex justify-between items-center" style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--tx2)' }}>QUOTED INVOICE</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#34D399' }}>${(o.budget || 0).toLocaleString()}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setEditingOrder(o)}>Update Invoice / Status</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER STARTUP DASHBOARD ───
  const renderStartup = () => {
    return (
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
          <div>
            <span className="chip" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>🚀 Founder Portal</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>
              {myStartup ? myStartup.name : 'List Your Startup'}
            </h1>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => navigate(`/startup/${myStartup?.slug}`)}>View Public Profile</button>
          </div>
        </div>

        {myStartup ? (
          <div>
            {/* STARTUP STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              {[
                { label: 'Upvotes received', val: myStartup.upvoteCount || 0, icon: '▲', color: '#7C6EFA' },
                { label: 'Profile Views', val: myStartup.viewCount || 0, icon: '👁', color: '#22D3EE' },
                { label: 'Hiring Opportunities', val: myOpportunities.length, icon: '💼', color: '#34D399' },
                { label: 'Sponsored Hackathons', val: myHackathons.length, icon: '⚡', color: '#FCD34D' },
              ].map(s => (
                <Card key={s.label} style={{ padding: 18 }}>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 11, color: 'var(--tx2)', fontWeight: 600 }}>{s.label}</span>
                    <span style={{ color: s.color }}>{s.icon}</span>
                  </div>
                  <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                    {s.val}
                  </div>
                </Card>
              ))}
            </div>

            {/* TABS CONTROLLER */}
            <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 24 }}>
              {['profile', 'opportunities', 'hackathons'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`btn ${activeTab === t ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'profile' && (
              <Card>
                <h2 className="section-title" style={{ marginBottom: 20 }}>Edit Startup Profile Details</h2>
                <form onSubmit={updateStartupProfile}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Startup Name</label>
                      <input value={myStartup.name || ''} onChange={e => setMyStartup({ ...myStartup, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Initials</label>
                      <input value={myStartup.initials || ''} onChange={e => setMyStartup({ ...myStartup, initials: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Tagline (One-sentence description)</label>
                    <input value={myStartup.tagline || ''} onChange={e => setMyStartup({ ...myStartup, tagline: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Long Description</label>
                    <textarea style={{ height: 120, resize: 'vertical' }} value={myStartup.description || ''} onChange={e => setMyStartup({ ...myStartup, description: e.target.value })} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Founded Year</label>
                      <input type="number" value={myStartup.foundedYear || ''} onChange={e => setMyStartup({ ...myStartup, foundedYear: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Team Size</label>
                      <input type="number" value={myStartup.teamSize || ''} onChange={e => setMyStartup({ ...myStartup, teamSize: Number(e.target.value) })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Funding Stage</label>
                      <select value={myStartup.stage || 'Pre-Seed'} onChange={e => setMyStartup({ ...myStartup, stage: e.target.value })}>
                        {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Enterprise'].map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
                    <div className="form-group">
                      <label className="form-label">Total Raised Funding (e.g. $1.2M)</label>
                      <input value={myStartup.raised || ''} onChange={e => setMyStartup({ ...myStartup, raised: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location (City, Country)</label>
                      <input value={myStartup.location || ''} onChange={e => setMyStartup({ ...myStartup, location: e.target.value })} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">Save Profile Changes</button>
                </form>
              </Card>
            )}

            {activeTab === 'opportunities' && (
              <div>
                <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                  <h2 className="section-title">Open Jobs & Internships</h2>
                  <button className="btn btn-success btn-sm" onClick={() => setShowOppModal(true)}>+ Post Opportunity</button>
                </div>
                {myOpportunities.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg2)', borderRadius: 12, color: 'var(--tx2)' }}>
                    No opportunities posted yet. Click the button above to add one!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {myOpportunities.map(o => (
                      <Card key={o._id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx0)' }}>{o.title}</div>
                          <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                            {o.type} &middot; {o.location} &middot; {o.compensation} &middot; {o.duration}
                          </div>
                        </div>
                        <div>
                          <span className="chip" style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399' }}>{o.applicants} applicants</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'hackathons' && (
              <div>
                <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
                  <h2 className="section-title">Sponsored Hackathons</h2>
                  <button className="btn btn-success btn-sm" onClick={() => setShowHackModal(true)}>+ Host Hackathon</button>
                </div>
                {myHackathons.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg2)', borderRadius: 12, color: 'var(--tx2)' }}>
                    No hackathons hosted yet. Host a challenge to engage students!
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {myHackathons.map(h => (
                      <Card key={h._id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{h.title}</h3>
                            <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                              Prize Pool: <b style={{ color: '#34D399' }}>{h.prizePool}</b> &middot; Deadline: {h.deadline}
                            </div>
                          </div>
                          <Badge color="#7C6EFA">{h.status}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'var(--bg2)', borderRadius: 16 }}>
            <h3>Let's get your startup profile active!</h3>
            <p style={{ color: 'var(--tx2)', margin: '12px 0 24px' }}>Complete registration details to unlock dashboard analytics and opportunity listing slots.</p>
            <button className="btn btn-primary" onClick={() => navigate('/register?type=startup')}>Register Profile Now</button>
          </div>
        )}
      </div>
    );
  };

  // ─── RENDER STUDENT DASHBOARD ───
  const renderStudent = () => {
    return (
      <div>
        <div className="flex justify-between items-center" style={{ marginBottom: 32 }}>
          <div>
            <span className="chip" style={{ background: 'var(--accent-dim)', color: 'var(--accent-light)' }}>🎓 Student Workspace</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 10 }}>My Portfolio Workspace</h1>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => navigate('/profile')}>Edit Workspace Profile</button>
          </div>
        </div>

        {/* STUDENT WORKSPACE TABS */}
        <div className="flex gap-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 24 }}>
          {['applications', 'hackathons', 'quick_links'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`btn ${activeTab === t ? 'btn-primary' : 'btn-ghost'} btn-sm`}>
              {t.toUpperCase() === 'QUICK_LINKS' ? 'EXPLORE' : t.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'applications' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Submitted Job Applications ({studentApps.length})</h2>
            {studentApps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg2)', borderRadius: 12, color: 'var(--tx2)', fontSize: 13 }}>
                💼 No applications submitted yet. Visit the Jobs tab to apply for open roles!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {studentApps.map(app => (
                  <Card key={app._id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{app.opportunityId?.title || 'Applied Position'}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                        Client: <b>{app.opportunityId?.company || 'Startup Client'}</b> &middot; Location: {app.opportunityId?.location}
                      </div>
                    </div>
                    <div>
                      <span className="chip" style={{
                        background: app.status === 'accepted' ? 'rgba(52,211,153,0.1)' : app.status === 'rejected' ? 'rgba(251,113,133,0.1)' : 'rgba(252,211,77,0.1)',
                        color: app.status === 'accepted' ? '#34D399' : app.status === 'rejected' ? '#FB7185' : '#FCD34D'
                      }}>{app.status?.toUpperCase()}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hackathons' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: 16 }}>Registered Participations ({studentHacks.length})</h2>
            {studentHacks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg2)', borderRadius: 12, color: 'var(--tx2)', fontSize: 13 }}>
                ⚡ No hackathon registrations yet. Visit the Hackathons tab to build solutions!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {studentHacks.map(reg => (
                  <Card key={reg._id} style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{reg.hackathonId?.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                        Sponsor: <b>{reg.hackathonId?.startupName}</b> &middot; Duration: {reg.hackathonId?.duration}
                      </div>
                    </div>
                    <div>
                      <span className="chip" style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399' }}>REGISTERED</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === 'quick_links' || activeTab === 'overview') && (
          <div style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--bg2)', borderRadius: 16 }}>
            <h2>Discover What's Next</h2>
            <p style={{ color: 'var(--tx2)', margin: '12px auto 24px', maxWidth: 450, fontSize: 13, lineHeight: 1.6 }}>
              Browse listings, participate in active hackathons, and apply for opportunities directly through the main tabs!
            </p>
            <div className="flex gap-3 justify-center">
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/hackathons')}>Browse Live Hackathons</button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/opportunities')}>Browse Open Jobs</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── MODAL: UPDATE SERVICE ORDER INVOICE (ADMIN & ACCOUNT MANAGER ONLY) ───
  const renderOrderEditModal = () => {
    if (!editingOrder) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 24
      }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-accent)', borderRadius: 16, padding: 28, maxWidth: 500, width: '100%' }}>
          <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Update Service Quotation</h3>
          <form onSubmit={updateOrder}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Invoiced Budget Price ($ USD)</label>
              <input type="number" value={editingOrder.budget || 0} onChange={e => setEditingOrder({ ...editingOrder, budget: Number(e.target.value) })} />
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Service Order Status</label>
              <select value={editingOrder.status} onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value })}>
                {['inquiry', 'quoted', 'in_progress', 'review', 'completed', 'cancelled'].map(st => (
                  <option key={st} value={st}>{st.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Save Invoiced Quote</button>
              <button type="button" className="btn btn-ghost" onClick={() => setEditingOrder(null)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ─── MODAL: CREATE OPPORTUNITY (STARTUP ONLY) ───
  const renderOppModal = () => {
    if (!showOppModal) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 24
      }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-accent)', borderRadius: 16, padding: 28, maxWidth: 500, width: '100%' }}>
          <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Post New Hiring Opportunity</h3>
          <form onSubmit={createOpportunity}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Position Title</label>
              <input placeholder="e.g. Lead Full-Stack Architect" value={oppForm.title} onChange={e => setOppForm({ ...oppForm, title: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Hiring Type</label>
                <select value={oppForm.type} onChange={e => setOppForm({ ...oppForm, type: e.target.value })}>
                  {['Full-Time', 'Internship', 'Contract'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input placeholder="e.g. Permanent or 6 months" value={oppForm.duration} onChange={e => setOppForm({ ...oppForm, duration: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Job Location</label>
                <input placeholder="Remote / SF" value={oppForm.location} onChange={e => setOppForm({ ...oppForm, location: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Compensation / Month or Year</label>
                <input placeholder="e.g. $5K-$8K or $120K" value={oppForm.compensation} onChange={e => setOppForm({ ...oppForm, compensation: e.target.value })} required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Skills tags (comma separated)</label>
              <input placeholder="e.g. React, Node, AWS, TypeScript" value={oppForm.tags} onChange={e => setOppForm({ ...oppForm, tags: e.target.value })} required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Post Opportunity Listing</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowOppModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // ─── MODAL: HOST HACKATHON (STARTUP ONLY) ───
  const renderHackModal = () => {
    if (!showHackModal) return null;
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 24
      }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border-accent)', borderRadius: 16, padding: 28, maxWidth: 500, width: '100%' }}>
          <h3 style={{ fontFamily: 'Arial, sans-serif', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Host Sponsored Global Hackathon</h3>
          <form onSubmit={createHackathon}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Hackathon Event Title</label>
              <input placeholder="e.g. Global AI & Robotics Build Sprint" value={hackForm.title} onChange={e => setHackForm({ ...hackForm, title: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Brief Description</label>
              <textarea style={{ height: 80 }} placeholder="Design novel energy distribution solutions for off-grid communities..." value={hackForm.description} onChange={e => setHackForm({ ...hackForm, description: e.target.value })} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Total Prize Pool ($ USD)</label>
                <input placeholder="e.g. $50,000" value={hackForm.prizePool} onChange={e => setHackForm({ ...hackForm, prizePool: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input placeholder="e.g. 72 hours" value={hackForm.duration} onChange={e => setHackForm({ ...hackForm, duration: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
              <div className="form-group">
                <label className="form-label">Spots Capacity Limit</label>
                <input type="number" value={hackForm.maxSpots} onChange={e => setHackForm({ ...hackForm, maxSpots: Number(e.target.value) })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline Date</label>
                <input placeholder="e.g. Jun 15, 2025" value={hackForm.deadline} onChange={e => setHackForm({ ...hackForm, deadline: e.target.value })} required />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Category / Tech tags (comma separated)</label>
              <input placeholder="AI, Climate, Blockchain" value={hackForm.tags} onChange={e => setHackForm({ ...hackForm, tags: e.target.value })} required />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Publish Hackathon Event</button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowHackModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ minHeight: '80vh', padding: '60px 24px' }}>
      {user.role === 'admin' && renderAdmin()}
      {user.role === 'service_provider' && renderAccountManager()}
      {user.role === 'startup_admin' && renderStartup()}
      {user.role === 'student' && renderStudent()}

      {renderOrderEditModal()}
      {renderOppModal()}
      {renderHackModal()}
    </div>
  );
}
