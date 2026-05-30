import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api.js';
import StartupCard from '../components/startup/StartupCard.jsx';

const STAGES = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Growth', 'Enterprise'];

export default function Discover() {
  const [searchParams] = useSearchParams();
  const [startups, setStartups] = useState([]);
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('All');
  const [selectedCat, setSelectedCat] = useState('All Products');
  const [cats, setCats] = useState([]);

  const CATS = cats.length ? cats : [
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
  ];

  useEffect(() => {
    api.get('/categories').then(res => setCats(res.data)).catch(() => setCats([]));
    api.get('/startups').then(res => setStartups(res.data)).catch(() => setStartups([]));
  }, []);

  const isAllSelected = selectedCat === 'All' || selectedCat === 'All Products';

  const filtered = startups.filter(s => {
    const matchCat = isAllSelected || (s.category === selectedCat || s.cat === selectedCat);
    const matchStage = stage === 'All' || s.stage === stage;
    const matchQ = !search || s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.tagline?.toLowerCase().includes(search.toLowerCase()) ||
      (s.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchStage && matchQ;
  });

  return (
    <div className="page-container" style={{ position: 'relative', background: '#0A0A0C', minHeight: '100vh', maxWidth: 'none', margin: 0, padding: '80px 48px' }}>
      
      {/* GLOW DECK ACCENTS */}
      <div style={{
        position: 'absolute', top: 40, left: '30%', width: 250, height: 250,
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', zIndex: -1
      }} />

      {/* HEADER DECK */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <span className="chip" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 16 }}>
          🔍 Tech Radar Directory
        </span>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.03em', color: '#FFFFFF' }}>
          Discover the Innovators
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 550, margin: '0 auto' }}>
          Browse and filter the next generation of highly scalable software products, micro-SaaS, and hardware solutions.
        </p>
      </div>

      {/* FILTER CONTROL DECK (Bento search panel style) */}
      <div style={{
        padding: '24px 28px', marginBottom: 40, borderRadius: 'var(--ra-lg)',
        display: 'flex', flexDirection: 'column', gap: 20,
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          
          {/* SEARCH BAR */}
          <div style={{ flex: '2 1 300px', position: 'relative' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by keywords, tags, or technology..."
              style={{ paddingLeft: 44 }}
            />
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--tx2)', fontSize: 16 }}>
              🔍
            </span>
          </div>

          {/* STAGE SELECTION */}
          <div style={{ flex: '1 1 180px' }}>
            <select value={stage} onChange={e => setStage(e.target.value)}>
              <option value="All">All Stages</option>
              {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* HORIZONTAL CATEGORY SCROLL */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
            Filter by Technology Vector:
          </div>
          <div className="scroll-x">
            {CATS.map(c => (
              <button
                key={c._id || c.id}
                onClick={() => setSelectedCat(c.name)}
                style={{
                  padding: '8px 18px', borderRadius: 30, border: '1px solid',
                  borderColor: selectedCat === c.name ? '#EBECE7' : 'rgba(255,255,255,0.15)',
                  background: selectedCat === c.name ? '#EBECE7' : '#111114',
                  color: selectedCat === c.name ? '#0A0A0C' : '#EBECE7',
                  cursor: 'pointer', fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
                  transition: 'var(--ease-smooth)', fontFamily: 'Arial, sans-serif'
                }}
              >
                <span style={{ marginRight: 6 }}>{c.icon || '◈'}</span>
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FILTER RESULT STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
          Showing <b style={{ color: '#FFFFFF' }}>{filtered.length}</b> verified startups
        </span>
      </div>

      {/* DYNAMIC LISTINGS GRID */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 24px', background: '#0A0A0C', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontWeight: 800, marginBottom: 8, color: '#EBECE7' }}>No innovations matching filters</h3>
          <p style={{ color: '#9A9A9D', fontSize: 13 }}>Try resetting the categories list, stage filters, or modifying keywords.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(365px, 1fr))', gap: 24 }}>
          {filtered.map(s => (
            <StartupCard key={s._id || s.id} startup={s} />
          ))}
        </div>
      )}
    </div>
  );
}
