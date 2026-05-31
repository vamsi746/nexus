import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card.jsx';
import Avatar from '../../components/shared/Avatar.jsx';
import AdminTable, { SearchBar } from './AdminTable.jsx';

export default function AdminStartups({ startups, onVerify, onTrending, onDelete }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...startups];
    if (statusFilter === 'verified') list = list.filter(s => s.verified);
    if (statusFilter === 'pending') list = list.filter(s => !s.verified);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q) || (s.stage || '').toLowerCase().includes(q));
    }
    return list;
  }, [startups, search, statusFilter]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Startups <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search startups..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 160, flexShrink: 0 }}>
          <option value="all">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <Card>
        <AdminTable
          headers={[
            { key: 'name', label: 'Startup' },
            { key: 'stage', label: 'Stage' },
            { key: 'location', label: 'Location' },
            { key: 'raised', label: 'Raised' },
            { key: 'verified', label: 'Status' },
            { key: 'trending', label: 'Trending' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={filtered.map(s => ({
            name: <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar initials={s.initials || 'ST'} color={s.color || '#7C6EFA'} size={28} /><span style={{ fontWeight: 600, color: 'var(--tx0)' }}>{s.name}</span></div>,
            stage: s.stage || '-',
            location: s.location || '-',
            raised: s.raised || '-',
            verified: s.verified ? <span style={{ color: '#34D399', fontWeight: 700 }}>✓ Verified</span> : <span style={{ color: '#F59E0B' }}>⏳ Pending</span>,
            trending: s.isTrending ? <span style={{ color: '#EC4899', fontWeight: 700 }}>🔥 Yes</span> : <span style={{ color: 'var(--tx3)' }}>No</span>,
            actions: (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => onVerify(s._id)}>{s.verified ? 'Unverify' : 'Verify'}</button>
                <button className="btn btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => onTrending(s._id)}>{s.isTrending ? 'Untrend' : 'Trend'}</button>
                <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => onDelete(s._id)}>Delete</button>
              </div>
            )
          }))}
          emptyMsg="No startups match your filters."
        />
      </Card>
    </div>
  );
}
