import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import StudentLayout from './StudentLayout.jsx';
import StudentOverview from './StudentOverview.jsx';
import StudentOpportunities from './StudentOpportunities.jsx';
import StudentHackathons from './StudentHackathons.jsx';
import StudentApplications from './StudentApplications.jsx';
import StudentRegistrations from './StudentRegistrations.jsx';
import StudentProfile from './StudentProfile.jsx';

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [opportunities, setOpportunities] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [applications, setApplications] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [applying, setApplying] = useState(null);
  const [registering, setRegistering] = useState(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchAll();
  }, [token]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [oppRes, hackRes, appRes, regRes] = await Promise.all([
        api.get('/opportunities'),
        api.get('/hackathons'),
        api.get('/opportunities/applied'),
        api.get('/hackathons/registered'),
      ]);
      setOpportunities(oppRes.data);
      setHackathons(hackRes.data);
      setApplications(appRes.data);
      setRegistrations(regRes.data);
    } catch (err) {
      console.error('Student fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  const appliedIds = useMemo(() => new Set(applications.map(a => a.opportunityId?._id || a.opportunityId)), [applications]);
  const registeredIds = useMemo(() => new Set(registrations.map(r => r.hackathonId?._id || r.hackathonId)), [registrations]);

  const counts = {
    overview: 0,
    opportunities: opportunities.length,
    hackathons: hackathons.length,
    applications: applications.length,
    registrations: registrations.length,
    profile: 0,
  };

  const handleApply = useCallback(async (id) => {
    setApplying(id);
    try {
      const res = await api.post(`/opportunities/${id}/apply`);
      setApplications(prev => [res.data.application, ...prev]);
      alert('Applied successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(null);
    }
  }, []);

  const handleRegister = useCallback(async (id) => {
    setRegistering(id);
    try {
      const res = await api.post(`/hackathons/${id}/register`);
      setRegistrations(prev => [res.data.registration, ...prev]);
      setHackathons(prev => prev.map(h => h._id === id ? { ...h, spots: (h.spots || 0) + 1 } : h));
      alert('Registered successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  }, []);

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <div style={{ fontSize: 32, animation: 'spin 1s infinite linear', display: 'inline-block', marginBottom: 16 }}>⚡</div>
        <h3 style={{ color: 'var(--tx1)' }}>Loading student dashboard...</h3>
      </div>
    );
  }

  return (
    <StudentLayout activeSection={activeSection} setActiveSection={setActiveSection} counts={counts}>
      {activeSection === 'overview' && (
        <StudentOverview
          applications={applications} registrations={registrations}
          opportunities={opportunities} hackathons={hackathons}
          onNavigate={setActiveSection}
        />
      )}
      {activeSection === 'opportunities' && (
        <StudentOpportunities opportunities={opportunities} appliedIds={appliedIds} onApply={handleApply} applying={applying} />
      )}
      {activeSection === 'hackathons' && (
        <StudentHackathons hackathons={hackathons} registeredIds={registeredIds} onRegister={handleRegister} registering={registering} />
      )}
      {activeSection === 'applications' && (
        <StudentApplications applications={applications} />
      )}
      {activeSection === 'registrations' && (
        <StudentRegistrations registrations={registrations} />
      )}
      {activeSection === 'profile' && (
        <StudentProfile />
      )}
    </StudentLayout>
  );
}
