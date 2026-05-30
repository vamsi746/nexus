import { useState, useEffect } from 'react';
import api from '../services/api.js';
import Card from '../components/shared/Card.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = () => {
    api.get('/hackathons')
      .then(res => setHackathons(res.data))
      .catch(() => setHackathons([]));
  };

  const handleRegister = async (id) => {
    if (!token) {
      alert('Please log in to register for sponsored hackathons!');
      navigate('/login');
      return;
    }
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.post(`/hackathons/${id}/register`);
      setSuccessMsg(`⚡ Registered successfully! ${res.data.message || ''}`);
      fetchHackathons();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to complete registration.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      
      {/* BACKGROUND GLOW */}
      <div style={{
        position: 'absolute', top: 20, right: '10%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', zIndex: -1
      }} />

      {/* HEADER */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <span className="chip" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-light)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: 16 }}>
          🏆 Active Tournaments & Sprints
        </span>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.03em' }}>
          Sponsored Hackathons
        </h1>
        <p style={{ color: 'var(--tx1)', fontSize: 15, maxWidth: 550, margin: '0 auto' }}>
          Participate in live challenges sponsored by emerging startups. Win cash prize pools, build portfolio, and land immediate offers.
        </p>
      </div>

      {successMsg && <div className="notice notice-success" style={{ marginBottom: 24 }}>{successMsg}</div>}
      {errorMsg && <div className="notice notice-error" style={{ marginBottom: 24 }}>{errorMsg}</div>}

      {/* GRID CARDS — Sharp edge business-card layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {hackathons.map(h => {
          const statusConfig = {
            open:     { color: '#2A8A4A', label: 'OPEN' },
            upcoming: { color: '#0891B2', label: 'UPCOMING' },
            closed:   { color: '#DC2626', label: 'CLOSED' },
          };
          const sc = statusConfig[h.status] || statusConfig.open;
          const pct = Math.round((h.spots || 0) / (h.maxSpots || 1) * 100);

          return (
            <Card key={h._id || h.id} variant="clean" style={{
              background: '#111114',
              borderRadius: 0,
              padding: 36,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
              display: 'flex', flexDirection: 'column', gap: 0,
              position: 'relative',
              fontFamily: 'Arial, sans-serif'
            }}>
              {/* ── HERO IMAGE + OVERLAY TEXT ── */}
              {h.coverImageUrl && (
                <div style={{
                  height: 220,
                  margin: '-36px -36px 0 -36px',
                  backgroundImage: `url(${h.coverImageUrl})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(17,17,20,0.25) 0%, rgba(17,17,20,0.7) 55%, rgba(17,17,20,0.98) 100%)'
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 36, right: 36, paddingBottom: 24
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      marginBottom: 14
                    }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.5)'
                      }}>
                        {h.startupName || 'Startup'}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: sc.color,
                        borderBottom: `1px solid ${sc.color}`,
                        paddingBottom: 2
                      }}>
                        {sc.label}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: 24, fontWeight: 700, lineHeight: 1.2,
                      color: '#fff',
                      marginBottom: 8, letterSpacing: '-0.02em'
                    }}>
                      {h.title}
                    </h3>
                    <div style={{
                      fontSize: 13, fontWeight: 400,
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      {h.duration || '48h'} &nbsp;·&nbsp; Deadline {h.deadline || 'TBA'}
                    </div>
                  </div>
                </div>
              )}

              {!h.coverImageUrl && (
                <>
                  {/* ── TOP RULE ── */}
                  <div style={{
                    position: 'absolute', top: 0, left: 36, right: 36, height: 1,
                    background: 'rgba(255,255,255,0.08)'
                  }} />

                  {/* ── SPONSOR + STATUS ── */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 24
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)'
                    }}>
                      {h.startupName || 'Startup'}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: sc.color,
                      borderBottom: `1px solid ${sc.color}`,
                      paddingBottom: 2
                    }}>
                      {sc.label}
                    </span>
                  </div>

                  {/* ── TITLE ── */}
                  <h3 style={{
                    fontSize: 24, fontWeight: 700, lineHeight: 1.2,
                    color: '#fff',
                    marginBottom: 8, letterSpacing: '-0.02em'
                  }}>
                    {h.title}
                  </h3>

                  {/* ── DURATION / DEADLINE ── */}
                  <div style={{
                    fontSize: 13, fontWeight: 400,
                    color: 'rgba(255,255,255,0.45)',
                    marginBottom: 32
                  }}>
                    {h.duration || '48h'} &nbsp;·&nbsp; Deadline {h.deadline || 'TBA'}
                  </div>
                </>
              )}

              {/* ── MID RULE ── */}
              <div style={{
                height: 1,
                background: 'rgba(255,255,255,0.06)',
                marginBottom: 24
              }} />

              {/* ── META ROW ── */}
              <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 6
                  }}>Prize Pool</div>
                  <div style={{
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 16, fontWeight: 700,
                    color: '#fff'
                  }}>{h.prizePool || '$0'}</div>
                </div>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 6
                  }}>Seats Filled</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: '#fff'
                  }}>{pct}%</div>
                </div>
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.35)',
                    marginBottom: 6
                  }}>Max Spots</div>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: '#fff'
                  }}>{(h.maxSpots || 1000).toLocaleString()}</div>
                </div>
              </div>

              {/* ── TAGS ── */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
                {(h.tags || ['AI', 'Healthcare', 'React']).map(t => (
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
                  ID: {h._id?.slice(-6).toUpperCase() || 'NEXUS'}
                </div>
                <button
                  onClick={() => handleRegister(h._id)}
                  style={{
                    padding: '8px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer', border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                    color: '#FFFFFF',
                    transition: 'all 0.2s'
                  }}
                >
                  {h.status === 'upcoming' ? 'Remind Me \u2192' : 'Register \u2192'}
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

      {hackathons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
          <h3 style={{ fontWeight: 800, marginBottom: 8, color: 'var(--tx0)' }}>No hackathons found</h3>
          <p style={{ color: 'var(--tx2)', fontSize: 14 }}>Check back later for new challenges.</p>
        </div>
      )}

    </div>
  );
}
