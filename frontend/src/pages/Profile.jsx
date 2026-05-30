import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import Card from '../components/shared/Card.jsx';

export default function Profile() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // General profile state
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [studentForm, setStudentForm] = useState({
    fullName: '', bio: '', university: '', degree: '', major: '', graduationYear: '', skills: '', githubUrl: '', linkedinUrl: '', portfolioUrl: '', country: '', isOpenToWork: false
  });

  const [startupForm, setStartupForm] = useState({
    name: '', initials: '', tagline: '', description: '', location: '', stage: 'Pre-Seed', raised: '', teamSize: '', websiteUrl: '', socialLinkedin: '', socialTwitter: '', flag: '🇺🇸'
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [token, user]);

  const fetchProfileData = async () => {
    if (!user) return;
    setLoading(true);
    setErrorMsg('');
    try {
      if (user.role === 'student') {
        const res = await api.get('/students/me');
        setStudentForm({
          fullName: res.data.fullName || '',
          bio: res.data.bio || '',
          university: res.data.university || '',
          degree: res.data.degree || '',
          major: res.data.major || '',
          graduationYear: res.data.graduationYear || '',
          skills: (res.data.skills || []).join(', '),
          githubUrl: res.data.githubUrl || '',
          linkedinUrl: res.data.linkedinUrl || '',
          portfolioUrl: res.data.portfolioUrl || '',
          country: res.data.country || '',
          isOpenToWork: res.data.isOpenToWork || false
        });
      } else if (user.role === 'startup_admin') {
        const res = await api.get('/startups/me');
        setStartupForm({
          name: res.data.name || '',
          initials: res.data.initials || '',
          tagline: res.data.tagline || '',
          description: res.data.description || '',
          location: res.data.location || '',
          stage: res.data.stage || 'Pre-Seed',
          raised: res.data.raised || '',
          teamSize: res.data.teamSize || '',
          websiteUrl: res.data.websiteUrl || '',
          socialLinkedin: res.data.socialLinkedin || '',
          socialTwitter: res.data.socialTwitter || '',
          flag: res.data.flag || '🇺🇸'
        });
      }
    } catch (err) {
      console.error('Error fetching profile data', err);
      setErrorMsg(err.response?.data?.message || 'Could not load your profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const payload = {
        ...studentForm,
        skills: studentForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        graduationYear: Number(studentForm.graduationYear)
      };
      await api.put('/students/me', payload);
      setSuccessMsg('🎓 Student profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleStartupSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const payload = {
        ...startupForm,
        teamSize: Number(startupForm.teamSize)
      };
      await api.put('/startups/me', payload);
      setSuccessMsg('🚀 Startup profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update startup profile.');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 24px' }}>
        <div style={{ fontSize: 32, animation: 'spin 1s infinite linear', display: 'inline-block', marginBottom: 16 }}>⚡</div>
        <h3 style={{ color: 'var(--tx1)' }}>Loading your profile data...</h3>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="page-container" style={{ maxWidth: 720, padding: '50px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 8 }}>My Profile Details</h1>
        <p style={{ color: 'var(--tx2)', fontSize: 14 }}>View and manage your registered overview information</p>
      </div>

      {successMsg && <div className="notice notice-success" style={{ marginBottom: 20 }}>{successMsg}</div>}
      {errorMsg && <div className="notice notice-error" style={{ marginBottom: 20 }}>{errorMsg}</div>}

      {/* STUDENT PROFILE FORM */}
      {user.role === 'student' && (
        <Card>
          <div className="flex gap-3 items-center" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎓</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Student Member Information</h2>
              <span style={{ fontSize: 11, color: 'var(--tx2)' }}>Account Email: {user.email}</span>
            </div>
          </div>
          <form onSubmit={handleStudentSubmit}>
            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Full Name</label>
              <input value={studentForm.fullName} onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })} required />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Bio (Introduce yourself to startups)</label>
              <textarea style={{ height: 90, resize: 'vertical' }} value={studentForm.bio} onChange={e => setStudentForm({ ...studentForm, bio: e.target.value })} />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">University / College</label>
              <input value={studentForm.university} onChange={e => setStudentForm({ ...studentForm, university: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Degree</label>
                <select value={studentForm.degree} onChange={e => setStudentForm({ ...studentForm, degree: e.target.value })}>
                  {["Bachelor's", "Master's", 'PhD', 'Diploma', 'Associate'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input type="number" value={studentForm.graduationYear} onChange={e => setStudentForm({ ...studentForm, graduationYear: e.target.value })} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Major / Field of Study</label>
                <input value={studentForm.major} onChange={e => setStudentForm({ ...studentForm, major: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input value={studentForm.country} onChange={e => setStudentForm({ ...studentForm, country: e.target.value })} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Skills (comma separated list)</label>
              <input placeholder="Python, React, TypeScript, Figma" value={studentForm.skills} onChange={e => setStudentForm({ ...studentForm, skills: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input placeholder="github.com/username" value={studentForm.githubUrl} onChange={e => setStudentForm({ ...studentForm, githubUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input placeholder="linkedin.com/in/username" value={studentForm.linkedinUrl} onChange={e => setStudentForm({ ...studentForm, linkedinUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Portfolio URL</label>
                <input placeholder="yourportfolio.com" value={studentForm.portfolioUrl} onChange={e => setStudentForm({ ...studentForm, portfolioUrl: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
              <input type="checkbox" id="openworkprofile" style={{ width: 'auto', accentColor: 'var(--accent)' }} checked={studentForm.isOpenToWork} onChange={e => setStudentForm({ ...studentForm, isOpenToWork: e.target.checked })} />
              <label htmlFor="openworkprofile" style={{ fontSize: 13, color: 'var(--tx1)', cursor: 'pointer' }}>I'm open to internship and job opportunities</label>
            </div>

            <button type="submit" className="btn btn-primary">Save Profile Overview</button>
          </form>
        </Card>
      )}

      {/* STARTUP FOUNDER PROFILE FORM */}
      {user.role === 'startup_admin' && (
        <Card>
          <div className="flex gap-3 items-center" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🚀</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Startup Profile Information</h2>
              <span style={{ fontSize: 11, color: 'var(--tx2)' }}>Authorized Founder: {user.email}</span>
            </div>
          </div>
          <form onSubmit={handleStartupSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Startup Name</label>
                <input value={startupForm.name} onChange={e => setStartupForm({ ...startupForm, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Initials / Abbreviation</label>
                <input value={startupForm.initials} onChange={e => setStartupForm({ ...startupForm, initials: e.target.value })} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Tagline (One sentence overview)</label>
              <input value={startupForm.tagline} onChange={e => setStartupForm({ ...startupForm, tagline: e.target.value })} required />
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label className="form-label">Detailed Description</label>
              <textarea style={{ height: 110, resize: 'vertical' }} value={startupForm.description} onChange={e => setStartupForm({ ...startupForm, description: e.target.value })} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Startup Stage</label>
                <select value={startupForm.stage} onChange={e => setStartupForm({ ...startupForm, stage: e.target.value })}>
                  {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Enterprise'].map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Raised Funding (e.g. $1.2M)</label>
                <input value={startupForm.raised} onChange={e => setStartupForm({ ...startupForm, raised: e.target.value })} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div className="form-group">
                <label className="form-label">Team Size (people)</label>
                <input type="number" value={startupForm.teamSize} onChange={e => setStartupForm({ ...startupForm, teamSize: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Flag Emoji</label>
                <input value={startupForm.flag} onChange={e => setStartupForm({ ...startupForm, flag: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Location (City, Country)</label>
                <input value={startupForm.location} onChange={e => setStartupForm({ ...startupForm, location: e.target.value })} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
              <div className="form-group">
                <label className="form-label">Website URL</label>
                <input placeholder="https://website.com" value={startupForm.websiteUrl} onChange={e => setStartupForm({ ...startupForm, websiteUrl: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input placeholder="https://linkedin.com/company/..." value={startupForm.socialLinkedin} onChange={e => setStartupForm({ ...startupForm, socialLinkedin: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Twitter / X URL</label>
                <input placeholder="https://x.com/..." value={startupForm.socialTwitter} onChange={e => setStartupForm({ ...startupForm, socialTwitter: e.target.value })} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">Save Startup Details</button>
          </form>
        </Card>
      )}

      {/* ADMIN OR ACC MANAGER PROFILE */}
      {(user.role === 'admin' || user.role === 'service_provider') && (
        <Card>
          <div className="flex gap-3 items-center" style={{ marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🔒</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700 }}>Management Account</h2>
              <span style={{ fontSize: 11, color: 'var(--tx2)' }}>Role: <b>{user.role?.toUpperCase()}</b></span>
            </div>
          </div>
          <div style={{ background: 'var(--bg2)', borderRadius: 10, padding: 16, border: '1px solid var(--border)', fontSize: 14 }}>
            <div style={{ marginBottom: 10 }}><b>Login Email:</b> {user.email}</div>
            <div style={{ color: 'var(--tx2)', fontSize: 12 }}>You have global administrative and operations credentials. To moderate content, please visit the global dashboard control panel.</div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/dashboard')}>Go to Dashboard Panel &rarr;</button>
        </Card>
      )}
    </div>
  );
}
