import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card.jsx';
import AdminTable, { SearchBar } from './AdminTable.jsx';

export default function AdminHackathons({ hackathons, onTrending, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return hackathons;
    const q = search.toLowerCase();
    return hackathons.filter(h => (h.title || '').toLowerCase().includes(q) || (h.startupName || '').toLowerCase().includes(q));
  }, [hackathons, search]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Hackathons <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <SearchBar value={search} onChange={setSearch} placeholder="Search hackathons..." />
      <Card>
        <AdminTable
          headers={[
            { key: 'title', label: 'Title' },
            { key: 'startup', label: 'Host' },
            { key: 'prize', label: 'Prize' },
            { key: 'deadline', label: 'Deadline' },
            { key: 'trending', label: 'Trending' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={filtered.map(h => ({
            title: <span style={{ fontWeight: 600, color: 'var(--tx0)' }}>{h.title}</span>,
            startup: h.startupName || '-',
            prize: h.prizePool || '-',
            deadline: h.deadline || '-',
            trending: h.isTrending ? <span style={{ color: '#EC4899', fontWeight: 700 }}>🔥 Yes</span> : <span style={{ color: 'var(--tx3)' }}>No</span>,
            actions: (
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => onTrending(h._id)}>{h.isTrending ? 'Untrend' : 'Trend'}</button>
                <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => onDelete(h._id)}>Delete</button>
              </div>
            )
          }))}
          emptyMsg="No hackathons found."
        />
      </Card>
    </div>
  );
}
