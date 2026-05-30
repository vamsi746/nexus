import { useState, useEffect } from 'react';
import api from '../services/api.js';
import Card from '../components/shared/Card.jsx';
import Avatar from '../components/shared/Avatar.jsx';
import Badge from '../components/shared/Badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [type, setType] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const types = ['All', 'Internship', 'Full-Time', 'Contract'];

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = () => {
    api.get('/opportunities')
      .then(res => setOpportunities(res.data))
      .catch(() => setOpportunities([]));
  };

  const handleApply = async (id) => {
    if (!token) {
      alert('Please log in to apply for hiring opportunities!');
      navigate('/login');
      return;
    }
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.post(`/opportunities/${id}/apply`);
      setSuccessMsg(`🎉 Applied successfully! ${res.data.message || ''}`);
      fetchOpportunities();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit your application.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const filtered = opportunities.filter(o => type === 'All' || o.type === type);

  const typeColors = {
    'Full-Time': { bg: 'rgba(74,222,128,0.08)', color: '#2A8A4A', border: 'rgba(74,222,128,0.2)' },
    'Internship': { bg: 'rgba(99,102,241,0.08)', color: 'var(--accent-light)', border: 'rgba(99,102,241,0.2)' },
    'Contract': { bg: 'rgba(6,182,212,0.08)', color: '#0891B2', border: 'rgba(6,182,212,0.2)' },
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>

      {/* DECK ACCENTS */}
      <div style={{
        position: 'absolute', top: 40, left: '20%', width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', zIndex: -1
      }} />

      {/* HEADER */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <span className="chip" style={{ background: 'rgba(74, 222, 128, 0.08)', color: '#2A8A4A', border: '1px solid rgba(74, 222, 128, 0.2)', marginBottom: 16 }}>
          💼 Active Startup Positions
        </span>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.03em' }}>
          Hiring Opportunities
        </h1>
        <p style={{ color: 'var(--tx1)', fontSize: 15, maxWidth: 550, margin: '0 auto' }}>
          Join high-growth engineering and design teams sponsored by verified startup partners building the future.
        </p>
      </div>

      {successMsg && <div className="notice notice-success" style={{ marginBottom: 24 }}>{successMsg}</div>}
      {errorMsg && <div className="notice notice-error" style={{ marginBottom: 24 }}>{errorMsg}</div>}

      {/* TABS DECK */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {types.map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '8px 18px', borderRadius: 30, border: '1px solid',
                borderColor: type === t ? 'var(--accent)' : 'var(--border)',
                background: type === t ? 'var(--accent-dim)' : 'transparent',
                color: type === t ? '#FFFFFF' : 'var(--tx1)',
                cursor: 'pointer', fontSize: 12, fontWeight: 700,
                transition: 'var(--ease-smooth)', fontFamily: 'Arial, sans-serif'
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--tx2)' }}>
          Found <b>{filtered.length}</b> open listings
        </span>
      </div>

      {/* GRID CARDS — Sharp edge business-card layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {filtered.map(o => {
          const tc = typeColors[o.type] || typeColors['Contract'];

          return (
            <Card key={o._id || o.id} variant="clean" style={{
              background: '#111114',
              borderRadius: 0,
              padding: 36,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              display: 'flex', flexDirection: 'column', gap: 0,
              position: 'relative',
              fontFamily: 'Arial, sans-serif'
            }}>
              {/* ── TOP RULE ── */}
              <div style={{
                position: 'absolute', top: 0, left: 36, right: 36, height: 1,
                background: 'rgba(255,255,255,0.08)'
              }} />

              {/* ── COMPANY + TYPE ── */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: 24
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)'
                }}>
                  {o.company}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: tc.color,
                  borderBottom: `1px solid ${tc.color}`,
                  paddingBottom: 2
                }}>
                  {o.type}
                </span>
              </div>

              {/* ── ROLE TITLE ── */}
              <h3 style={{
                fontSize: 24, fontWeight: 700, lineHeight: 1.2,
                color: '#fff',
                marginBottom: 8, letterSpacing: '-0.02em'
              }}>
                {o.title || o.role}
              </h3>

              {/* ── LOCATION LINE ── */}
              <div style={{
                fontSize: 13, fontWeight: 400,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 32
              }}>
                {o.location || 'Remote'} &nbsp;·&nbsp; {o.posted || '1d ago'}
              </div>

              {/* ── MID RULE ── */}
              <div style={{
                height: 1,
                background: 'rgba(255,255,255,0.06)',
                marginBottom: 24
              }} />

              {/* ── META ROW ── */}
              <div style={{
                display: 'flex', gap: 28, marginBottom: 24
              }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 6
                  }}>Compensation</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: '#fff'
                  }}>{o.compensation || o.comp || 'Competitive'}</div>
                </div>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 6
                  }}>Applicants</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: '#fff'
                  }}>{o.applicants || 0}</div>
                </div>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 6
                  }}>Duration</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: '#fff'
                  }}>{o.duration || 'Open'}</div>
                </div>
              </div>

              {/* ── TAGS ── */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                {(o.tags || ['React', 'Node', 'AWS']).map(t => (
                  <span key={t} style={{
                    padding: '5px 12px', borderRadius: 0, fontSize: 11, fontWeight: 500,
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>{t}</span>
                ))}
              </div>

              {/* ── BOTTOM RULE ── */}
              <div style={{
                height: 1,
                background: 'rgba(255,255,255,0.06)',
                marginBottom: 20
              }} />

              {/* ── ACTION ROW ── */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{
                  fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase'
                }}>
                  ID: {o._id?.slice(-6).toUpperCase() || 'NEXUS'}
                </div>
                <button
                  onClick={() => handleApply(o._id)}
                  style={{
                    padding: '8px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer', border: 'none',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                    color: '#FFFFFF',
                    transition: 'all 0.2s'
                  }}
                >
                  Apply &rarr;
                </button>
              </div>

              {/* ── BOTTOM RULE (flush) ── */}
              <div style={{
                position: 'absolute', bottom: 0, left: 36, right: 36, height: 1,
                background: 'rgba(255,255,255,0.08)'
              }} />
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontWeight: 800, marginBottom: 8, color: 'var(--tx0)' }}>No positions found</h3>
          <p style={{ color: 'var(--tx2)', fontSize: 14 }}>Try changing the filter or check back later.</p>
        </div>
      )}

    </div>
  );
}
