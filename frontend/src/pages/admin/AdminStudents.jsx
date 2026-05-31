import { useMemo, useState } from 'react';
import Card from '../../components/shared/Card.jsx';
import AdminTable, { SearchBar } from './AdminTable.jsx';

export default function AdminStudents({ students, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return students;
    const q = search.toLowerCase();
    return students.filter(s => (s.name || '').toLowerCase().includes(q) || (s.university || '').toLowerCase().includes(q) || (s.major || '').toLowerCase().includes(q));
  }, [students, search]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Students <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({filtered.length})</span></h2>
      <SearchBar value={search} onChange={setSearch} placeholder="Search students..." />
      <Card>
        <AdminTable
          headers={[
            { key: 'name', label: 'Name' },
            { key: 'university', label: 'University' },
            { key: 'degree', label: 'Degree' },
            { key: 'major', label: 'Major' },
            { key: 'skills', label: 'Skills', wrap: true },
            { key: 'actions', label: 'Actions' },
          ]}
          rows={filtered.map(s => ({
            name: <span style={{ fontWeight: 600, color: 'var(--tx0)' }}>{s.name || s.userId?.name || 'N/A'}</span>,
            university: s.university || '-',
            degree: s.degree || '-',
            major: s.major || '-',
            skills: <span style={{ fontSize: 11, color: 'var(--tx2)' }}>{(s.skills || []).slice(0, 3).join(', ')}{s.skills?.length > 3 ? '...' : ''}</span>,
            actions: <button className="btn btn-danger btn-sm" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => onDelete(s._id)}>Delete</button>
          }))}
          emptyMsg="No students found."
        />
      </Card>
    </div>
  );
}
