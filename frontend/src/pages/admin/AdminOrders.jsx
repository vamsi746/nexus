import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card.jsx';
import AdminTable, { SearchBar } from './AdminTable.jsx';

export default function AdminOrders({ orders, onUpdateStatus }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(o => (o.title || '').toLowerCase().includes(q) || (o.startupId?.name || '').toLowerCase().includes(q));
    }
    return list;
  }, [orders, search, statusFilter]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Service Orders <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 160, flexShrink: 0 }}>
          <option value="all">All Status</option>
          <option value="inquiry">Inquiry</option>
          <option value="quoted">Quoted</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <Card>
        <AdminTable
          headers={[
            { key: 'title', label: 'Title' },
            { key: 'startup', label: 'Startup' },
            { key: 'budget', label: 'Budget' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={filtered.map(o => ({
            title: <span style={{ fontWeight: 600, color: 'var(--tx0)' }}>{o.title}</span>,
            startup: o.startupId?.name || o.startupName || '-',
            budget: o.budget ? `$${o.budget.toLocaleString()}` : '-',
            status: (
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                background: o.status === 'completed' ? 'rgba(52,211,153,0.15)' : o.status === 'in_progress' ? 'rgba(99,102,241,0.15)' : o.status === 'cancelled' ? 'rgba(251,113,133,0.15)' : 'rgba(245,158,11,0.15)',
                color: o.status === 'completed' ? '#34D399' : o.status === 'in_progress' ? '#818CF8' : o.status === 'cancelled' ? '#FB7185' : '#F59E0B',
              }}>{(o.status || 'inquiry').replace('_', ' ').toUpperCase()}</span>
            ),
            actions: (
              <select value={o.status || 'inquiry'} onChange={e => onUpdateStatus(o._id, e.target.value)} style={{ fontSize: 12, padding: '4px 8px' }}>
                <option value="inquiry">Inquiry</option>
                <option value="quoted">Quoted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            )
          }))}
          emptyMsg="No orders match your filters."
        />
      </Card>
    </div>
  );
}
