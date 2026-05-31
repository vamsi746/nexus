import { useState, useMemo } from 'react';
import Card from '../../components/shared/Card.jsx';
import Avatar from '../../components/shared/Avatar.jsx';
import { SearchBar } from '../admin/AdminTable.jsx';

export default function StudentHackathons({ hackathons, registeredIds, onRegister, registering }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return hackathons;
    const q = search.toLowerCase();
    return hackathons.filter(h => (h.title || '').toLowerCase().includes(q) || (h.startupName || '').toLowerCase().includes(q) || (h.tags || []).join(' ').toLowerCase().includes(q));
  }, [hackathons, search]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Browse Hackathons <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <SearchBar value={search} onChange={setSearch} placeholder="Search by title, host, or tech..." />

      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48, color: 'var(--tx2)' }}>No hackathons match your search.</Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(h => {
            const isRegistered = registeredIds.has(h._id);
            const spotsFull = h.spots >= h.maxSpots;
            return (
              <Card key={h._id} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={h.initials || 'HK'} color={h.color || '#EC4899'} size={36} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx0)' }}>{h.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)' }}>{h.startupName || 'Host'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span className="chip" style={{ fontSize: 11, background: 'rgba(236,72,153,0.12)', color: '#EC4899', border: '1px solid rgba(236,72,153,0.25)' }}>🏆 {h.prizePool || 'TBD'}</span>
                  <span className="chip" style={{ fontSize: 11 }}>{h.duration || '48 hours'}</span>
                  <span className="chip" style={{ fontSize: 11 }}>📅 {h.deadline || 'TBA'}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx1)', lineHeight: 1.5 }}>{h.description?.slice(0, 120) || 'Build something amazing.'}{h.description?.length > 120 ? '...' : ''}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{h.spots || 0} / {h.maxSpots || 1000} spots</span>
                  <button
                    className={`btn btn-sm ${isRegistered ? 'btn-ghost' : spotsFull ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={() => !isRegistered && !spotsFull && onRegister(h._id)}
                    disabled={isRegistered || spotsFull || registering === h._id}
                  >
                    {registering === h._id ? 'Registering...' : isRegistered ? '✓ Registered' : spotsFull ? 'Full' : 'Register'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
