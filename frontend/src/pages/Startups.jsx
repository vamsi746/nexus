import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import StartupRow from '../components/startup/StartupRow.jsx';

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Enterprise'];

const CATS = [
  { _id: 'all', name: 'All Products', icon: '◈', count: 1840 },
  { _id: 'AI & ML', name: 'AI & ML', icon: '⟁', count: 342 },
  { _id: 'FinTech', name: 'FinTech', icon: '◈', count: 218 },
  { _id: 'HealthTech', name: 'HealthTech', icon: '⊕', count: 189 },
  { _id: 'EdTech', name: 'EdTech', icon: '◉', count: 156 },
  { _id: 'SaaS & B2B', name: 'SaaS & B2B', icon: '⬡', count: 203 },
  { _id: 'CleanTech', name: 'CleanTech', icon: '✦', count: 94 },
  { _id: 'E-Commerce', name: 'E-Commerce', icon: '◆', count: 167 },
  { _id: 'Media', name: 'Media', icon: '▶', count: 145 },
  { _id: 'Deep Tech', name: 'Deep Tech', icon: '◉', count: 132 },
  { _id: 'Web3', name: 'Web3', icon: '◉', count: 112 },
];

export default function Startups() {
  const [searchParams] = useSearchParams();
  const [startups, setStartups] = useState([]);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('All');
  const [selectedCat, setSelectedCat] = useState('All Products');

  useEffect(() => {
    api.get('/startups').then(res => setStartups(res.data)).catch(() => setStartups([]));
  }, []);

  const isAllSelected = selectedCat === 'All' || selectedCat === 'All Products';

  const filtered = useMemo(() => startups.filter(s => {
    const matchCat = isAllSelected || (s.category === selectedCat || s.cat === selectedCat);
    const matchStage = stage === 'All' || s.stage === stage;
    const matchQ = !search || s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      (s.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchStage && matchQ;
  }), [startups, search, stage, selectedCat]);

  const trending = useMemo(() => filtered.filter(s => s.isTrending || s.trending), [filtered]);
  const rest = useMemo(() => filtered.filter(s => !s.isTrending && !s.trending), [filtered]);

  const SectionHeader = ({ label, title, count }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16, marginTop: 8 }}>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 4, padding: '2px 8px'
      }}>{label}</span>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{count}</span>
    </div>
  );

  const ListShell = ({ children }) => (
    <div style={{
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 12,
      background: 'rgba(255,255,255,0.015)',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ background: '#0A0A0C', minHeight: '100vh', padding: '0 0 80px' }}>
      {/* ─── HERO ─── */}
      <div style={{
        position: 'relative',
        padding: 'clamp(48px, 8vw, 100px) 24px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span style={{
            display: 'inline-block', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '4px 12px', marginBottom: 20
          }}>
            Product Launch Directory
          </span>
          <h1 style={{
            fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 900,
            letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', margin: '0 0 14px'
          }}>
            Discover What's Launching Today
          </h1>
          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
            maxWidth: 520, margin: '0 auto 28px'
          }}>
            The best new startups, every day. Browse trending products, upvote your favorites, and find your next investment.
          </p>

          {/* Search */}
          <div style={{
            maxWidth: 520, margin: '0 auto',
            position: 'relative'
          }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search startups, tags, tech..."
              style={{
                width: '100%', padding: '14px 20px 14px 48px',
                borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 15, fontWeight: 500,
                outline: 'none', fontFamily: 'Arial, sans-serif'
              }}
            />
            <span style={{
              position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
              fontSize: 15, color: 'rgba(255,255,255,0.3)'
            }}>🔍</span>
          </div>
        </div>
      </div>

      {/* ─── FILTER BAR ─── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 12px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {CATS.map(c => (
            <button key={c._id} onClick={() => setSelectedCat(c.name)} style={{
              padding: '7px 14px', borderRadius: 20,
              background: selectedCat === c.name ? '#fff' : 'rgba(255,255,255,0.04)',
              color: selectedCat === c.name ? '#0A0A0C' : 'rgba(255,255,255,0.65)',
              border: `1px solid ${selectedCat === c.name ? '#fff' : 'rgba(255,255,255,0.1)'}`,
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              transition: 'all 0.15s ease', fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.01em'
            }}>
              {c.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <select value={stage} onChange={e => setStage(e.target.value)} style={{ width: 150, flexShrink: 0 }}>
            <option value="All">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', alignSelf: 'center' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* Launching Today — trending */}
        {trending.length > 0 && (
          <>
            <SectionHeader label="Today" title="Launching Today" count={trending.length} />
            <ListShell>
              {trending.map((s, i) => (
                <StartupRow key={s._id || s.id} startup={s} index={i} />
              ))}
            </ListShell>
          </>
        )}

        {/* Trending */}
        {trending.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <SectionHeader label="Hot" title="Trending Startups" count={trending.length} />
            <ListShell>
              {[...trending].sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0)).map((s, i) => (
                <StartupRow key={s._id || s.id} startup={s} index={i} />
              ))}
            </ListShell>
          </div>
        )}

        {/* All / Previous */}
        <div style={{ marginTop: 40 }}>
          <SectionHeader label="Archive" title="Previous Launches" count={rest.length} />
          {rest.length === 0 && filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12,
              color: 'rgba(255,255,255,0.3)', fontSize: 14
            }}>
              No startups match your filters.
            </div>
          ) : (
            <ListShell>
              {rest.length > 0 ? rest.map((s, i) => (
                <StartupRow key={s._id || s.id} startup={s} index={i} />
              )) : filtered.map((s, i) => (
                <StartupRow key={s._id || s.id} startup={s} index={i} />
              ))}
            </ListShell>
          )}
        </div>
      </div>
    </div>
  );
}

