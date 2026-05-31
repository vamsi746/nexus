import { useState, useEffect } from 'react';
import api from '../../services/api.js';
import Card from '../../components/shared/Card.jsx';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/me');
      setProfile(res.data);
    } catch {
      setProfile({ name: '', university: '', degree: '', major: '', skills: [], bio: '', github: '', linkedin: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/students/me', profile);
      setProfile(res.data);
      alert('Profile updated successfully!');
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: 'var(--tx2)' }}>Loading profile...</div>;

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>My Profile</h2>
      <Card>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="e.g. Alex Johnson" />
            </div>
            <div className="form-group">
              <label className="form-label">University / College</label>
              <input value={profile.university || ''} onChange={e => setProfile({ ...profile, university: e.target.value })} placeholder="e.g. Stanford University" />
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input value={profile.degree || ''} onChange={e => setProfile({ ...profile, degree: e.target.value })} placeholder="e.g. Bachelor of Science" />
            </div>
            <div className="form-group">
              <label className="form-label">Major</label>
              <input value={profile.major || ''} onChange={e => setProfile({ ...profile, major: e.target.value })} placeholder="e.g. Computer Science" />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input value={profile.github || ''} onChange={e => setProfile({ ...profile, github: e.target.value })} placeholder="https://github.com/username" />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input value={profile.linkedin || ''} onChange={e => setProfile({ ...profile, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="form-label">Bio</label>
            <textarea style={{ height: 100, resize: 'vertical' }} value={profile.bio || ''} onChange={e => setProfile({ ...profile, bio: e.target.value })} placeholder="Tell us about yourself, your interests and career goals..." />
          </div>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label">Skills (comma separated)</label>
            <input value={(profile.skills || []).join(', ')} onChange={e => setProfile({ ...profile, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} placeholder="e.g. React, Node.js, Python, AWS" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </Card>
    </div>
  );
}
