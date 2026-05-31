import { useState, useMemo } from 'react';
import Card from '../../components/shared/Card.jsx';
import Avatar from '../../components/shared/Avatar.jsx';
import { SearchBar } from '../admin/AdminTable.jsx';

export default function StudentOpportunities({ opportunities, appliedIds, onApply, applying }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const types = ['All', 'Full-Time', 'Internship', 'Contract'];

  const filtered = useMemo(() => {
    let list = [...opportunities];
    if (typeFilter !== 'All') list = list.filter(o => o.type === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => (o.title || '').toLowerCase().includes(q) || (o.company || '').toLowerCase().includes(q) || (o.tags || []).join(' ').toLowerCase().includes(q));
    }
    return list;
  }, [opportunities, search, typeFilter]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Browse Opportunities <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by title, company, or skills..." />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ width: 160, flexShrink: 0 }}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48, color: 'var(--tx2)' }}>No opportunities match your search.</Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(o => {
            const isApplied = appliedIds.has(o._id);
            return (
              <Card key={o._id} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={o.initials || 'CO'} color={o.color || '#7C6EFA'} size={36} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx0)' }}>{o.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--tx2)' }}>{o.company || o.startupName || 'Startup'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <span className="chip" style={{ fontSize: 11 }}>{o.type}</span>
                  <span className="chip" style={{ fontSize: 11 }}>{o.location || 'Remote'}</span>
                  <span className="chip" style={{ fontSize: 11 }}>{o.duration || 'Permanent'}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--tx1)', lineHeight: 1.5 }}>{o.compensation || 'Competitive'}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
                  {(o.tags || []).slice(0, 4).map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', color: 'var(--tx2)', border: '1px solid rgba(255,255,255,0.1)' }}>{t}</span>
                  ))}
                </div>
                <button
                  className={`btn btn-sm ${isApplied ? 'btn-ghost' : 'btn-primary'}`}
                  style={{ marginTop: 8, width: '100%' }}
                  onClick={() => !isApplied && onApply(o._id)}
                  disabled={isApplied || applying === o._id}
                >
                  {applying === o._id ? 'Applying...' : isApplied ? '✓ Applied' : 'Apply Now'}
                </button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
