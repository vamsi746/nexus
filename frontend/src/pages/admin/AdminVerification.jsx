import Card from '../../components/shared/Card.jsx';
import Avatar from '../../components/shared/Avatar.jsx';

export default function AdminVerification({ startups, onVerify, onDelete }) {
  const pendingList = startups.filter(s => !s.verified);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>Verification Queue <span style={{ color: 'var(--tx2)', fontSize: 16, fontWeight: 500 }}>({pendingList.length})</span></h2>
      {pendingList.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48, color: 'var(--tx2)' }}>🎉 Zero pending verification requests!</Card>
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {pendingList.map(s => (
            <Card key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar initials={s.initials || 'ST'} color={s.color || '#7C6EFA'} size={44} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx0)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--tx2)', marginTop: 2 }}>{s.stage} · {s.location} · {s.raised}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success btn-sm" onClick={() => onVerify(s._id)}>Verify →</button>
                <button className="btn btn-danger btn-sm" onClick={() => onDelete(s._id)}>Decline</button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
