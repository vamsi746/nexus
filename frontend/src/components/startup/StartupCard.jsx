import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../shared/Badge.jsx';
import StageTag from '../shared/StageTag.jsx';
import api from '../../services/api.js';

export default function StartupCard({ startup }) {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(startup.upvoteCount || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleClick = () => {
    if (startup.slug) navigate(`/startup/${startup.slug}`);
    else navigate(`/startup/${startup._id}`);
  };

  const handleCardUpvote = async (e) => {
    e.stopPropagation();
    if (hasVoted) return;
    try {
      const res = await api.post(`/startups/${startup._id}/upvote`);
      setUpvotes(res.data.upvoteCount);
      setHasVoted(true);
    } catch {
      setUpvotes(prev => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <div onClick={handleClick} style={{
      background: '#111114',
      border: '3px solid rgba(255,255,255,0.12)',
      boxShadow: '8px 8px 0 rgba(255,255,255,0.1)',
      borderRadius: 0,
      display: 'flex', flexDirection: 'column', gap: 0, padding: 32,
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      position: 'relative',
      transition: 'var(--ease-bounce)'
    }}>
      {/* ── HERO IMAGE + OVERLAY HEADER ── */}
      {startup.coverImageUrl && (
        <div style={{
          height: 180,
          margin: '-32px -32px 0 -32px',
          backgroundImage: `url(${startup.coverImageUrl})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(17,17,20,0.3) 0%, rgba(17,17,20,0.75) 60%, rgba(17,17,20,0.98) 100%)'
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 32, right: 32, paddingBottom: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.01em' }}>
                      {startup.name}
                    </span>
                    {startup.verified && <span title="Verified" style={{ color: '#818CF8', fontSize: 13 }}>&#10003;</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                    {startup.flag} {startup.location} &middot; Founded {startup.foundedYear || startup.founded || '2023'}
                  </div>
                </div>
              {(startup.isTrending || startup.trending) && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#818CF8', borderBottom: '1px solid #818CF8', paddingBottom: 2
                }}>
                  Trending
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!startup.coverImageUrl && (
        <>
          {/* ── TOP RULE ── */}
          <div style={{
            position: 'absolute', top: 0, left: 32, right: 32, height: 1,
            background: 'rgba(255,255,255,0.08)'
          }} />

          {/* ── HEADER ROW ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, marginTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.01em' }}>
                    {startup.name}
                  </span>
                  {startup.verified && <span title="Verified" style={{ color: '#818CF8', fontSize: 13 }}>&#10003;</span>}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                  {startup.flag} {startup.location} &middot; Founded {startup.foundedYear || startup.founded || '2023'}
                </div>
            </div>
            {(startup.isTrending || startup.trending) && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#818CF8', borderBottom: '1px solid #818CF8', paddingBottom: 2
              }}>
                Trending
              </span>
            )}
          </div>
        </>
      )}

      {/* ── TAGLINE ── */}
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 20 }}>
        {startup.tagline}
      </p>

      {/* ── TAGS ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
        {(startup.tags || []).slice(0, 3).map(t => (
          <span key={t} style={{
            padding: '4px 10px', borderRadius: 0, fontSize: 11, fontWeight: 500,
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>{t}</span>
        ))}
        <span style={{
          padding: '4px 10px', borderRadius: 0, fontSize: 11, fontWeight: 700,
          background: 'rgba(139,92,246,0.12)', color: '#A78BFA',
          border: '1px solid rgba(139,92,246,0.25)',
          textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>{startup.stage || 'Seed'}</span>
      </div>

      {/* ── MID RULE ── */}
      <div style={{
        height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20
      }} />

      {/* ── META ROW ── */}
      <div style={{ display: 'flex', gap: 28, marginBottom: 20 }}>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#9CA3AF', marginBottom: 6
          }}>Raised</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#22D3EE' }}>
            {startup.raised || startup.totalRaised || '-'}
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 6
          }}>Team Size</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
            {startup.team || startup.teamSize || '12'}
          </div>
        </div>
        <div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 6
          }}>Pageviews</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>
            {(startup.viewCount || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── BOTTOM RULE ── */}
      <div style={{
        height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16
      }} />

      {/* ── ACTION ROW ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase'
        }}>
          ID: {startup._id?.slice(-6).toUpperCase() || 'NEXUS'}
        </div>
        <button onClick={handleCardUpvote} style={{
          padding: '6px 14px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em',
          cursor: 'pointer', border: 'none',
          background: hasVoted ? 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)' : 'rgba(255,255,255,0.08)',
          color: hasVoted ? '#FFFFFF' : 'rgba(255,255,255,0.7)',
          transition: 'all 0.2s'
        }}>
          ▲ {upvotes.toLocaleString()}
        </button>
      </div>

      {/* ── BOTTOM RULE (flush) ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 32, right: 32, height: 1,
        background: 'rgba(255,255,255,0.08)'
      }} />
    </div>
  );
}
