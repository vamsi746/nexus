import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card.jsx';
import AdminTable, { SearchBar } from './AdminTable.jsx';

export default function AdminOpportunities({ opportunities }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return opportunities;
    const q = search.toLowerCase();
    return opportunities.filter(o => (o.title || '').toLowerCase().includes(q) || (o.company || '').toLowerCase().includes(q) || (o.type || '').toLowerCase().includes(q));
  }, [opportunities, search]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Opportunities <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <SearchBar value={search} onChange={setSearch} placeholder="Search opportunities..." />
      <Card>
        <AdminTable
          headers={[
            { key: 'title', label: 'Title' },
            { key: 'company', label: 'Company' },
            { key: 'type', label: 'Type' },
            { key: 'location', label: 'Location' },
            { key: 'compensation', label: 'Compensation' },
            { key: 'tags', label: 'Tags', wrap: true },
          ]}
          rows={filtered.map(o => ({
            title: <span style={{ fontWeight: 600, color: 'var(--tx0)' }}>{o.title}</span>,
            company: o.company || o.startupName || '-',
            type: o.type || '-',
            location: o.location || '-',
            compensation: o.compensation || '-',
            tags: <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{(o.tags || []).slice(0, 3).join(', ')}</span>,
          }))}
          emptyMsg="No opportunities found."
        />
      </Card>
    </div>
  );
}
