import Card from '../../components/shared/Card.jsx';

export default function StudentRegistrations({ registrations }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>My Hackathon Registrations <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({registrations.length})</span></h2>
      {registrations.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48, color: 'var(--tx2)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>No registrations yet</div>
          <div style={{ fontSize: 13 }}>Browse hackathons and register to track them here.</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {registrations.map(reg => (
            <Card key={reg._id} style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx0)' }}>{reg.hackathonId?.title || 'Hackathon'}</div>
                <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                  {reg.hackathonId?.startupName || 'Host'} · {reg.hackathonId?.duration} · 🏆 {reg.hackathonId?.prizePool || 'TBD'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>Registered {new Date(reg.createdAt).toLocaleDateString()}</div>
              </div>
              <span className="chip" style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)', fontWeight: 700, fontSize: 11 }}>
                ✓ REGISTERED
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
