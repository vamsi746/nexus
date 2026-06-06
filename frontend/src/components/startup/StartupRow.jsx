import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api.js';

export default function StartupRow({ startup, index = 0 }) {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(startup.upvoteCount || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleNavigate = () => {
    if (startup.slug) navigate(`/startup/${startup.slug}`);
    else navigate(`/startup/${startup._id}`);
  };

  const handleUpvote = async (e) => {
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
    <div
      onClick={handleNavigate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 20px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Rank number */}
      <div style={{
        width: 28, textAlign: 'right',
        fontSize: 13, fontWeight: 700,
        color: 'rgba(255,255,255,0.25)',
        fontFamily: 'Arial, sans-serif',
        flexShrink: 0
      }}>
        {index + 1}
      </div>

      {/* Logo */}
      {startup.logoUrl ? (
        <img
          src={startup.logoUrl}
          alt={startup.name}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0, display: 'block' }}
        />
      ) : null}
      {/* Fallback initials */}
      <div
        style={{
          width: 44, height: 44, borderRadius: 10,
          background: startup.color || '#6366F1',
          display: startup.logoUrl ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: '#fff',
          flexShrink: 0, letterSpacing: '-0.02em'
        }}
      >
        {startup.initials || startup.name?.slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <span style={{
            fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em'
          }}>
            {startup.name}
          </span>
          {startup.verified && (
            <span style={{ color: '#34D399', fontSize: 12 }}>&#10003;</span>
          )}
          {(startup.isTrending || startup.trending) && (
            <span style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#EC4899',
              border: '1px solid rgba(236,72,153,0.3)', borderRadius: 4,
              padding: '1px 5px'
            }}>Trending</span>
          )}
        </div>
        <div style={{
          fontSize: 13, color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.5,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {startup.tagline}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>{startup.category}</span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>•</span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.04em'
          }}>{startup.stage}</span>
          {startup.raised && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>•</span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: '#22D3EE'
              }}>{startup.raised}</span>
            </>
          )}
        </div>
      </div>

      {/* Upvote */}
      <button
        onClick={handleUpvote}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          padding: '6px 10px', borderRadius: 6,
          border: `1px solid ${hasVoted ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
          background: hasVoted ? 'linear-gradient(135deg, #F43F5E, #EC4899)' : 'transparent',
          cursor: 'pointer', flexShrink: 0,
          minWidth: 52,
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{
          fontSize: 10, color: hasVoted ? '#fff' : 'rgba(255,255,255,0.5)',
          lineHeight: 1
        }}>▲</span>
        <span style={{
          fontSize: 12, fontWeight: 800,
          color: hasVoted ? '#fff' : '#fff',
          fontFamily: 'Arial, sans-serif'
        }}>
          {upvotes.toLocaleString()}
        </span>
      </button>
    </div>
  );
}
