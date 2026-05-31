import Card from '../../components/shared/Card.jsx';

export default function StudentApplications({ applications }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: 'var(--tx0)' }}>My Applications <span style={{ color: 'var(--tx2)', fontSize: 16 }}>({applications.length})</span></h2>
      {applications.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 48, color: 'var(--tx2)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>
          <div style={{ fontWeight: 700, marginBottom: 4 }}>No applications yet</div>
          <div style={{ fontSize: 13 }}>Browse opportunities and apply to track them here.</div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {applications.map(app => (
            <Card key={app._id} style={{ padding: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx0)' }}>{app.opportunityId?.title || 'Applied Position'}</div>
                <div style={{ fontSize: 12, color: 'var(--tx2)', marginTop: 4 }}>
                  {app.opportunityId?.company || 'Startup'} · {app.opportunityId?.type} · {app.opportunityId?.location}
                </div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>Applied {new Date(app.createdAt).toLocaleDateString()}</div>
              </div>
              <span className="chip" style={{
                background: app.status === 'accepted' ? 'rgba(52,211,153,0.12)' : app.status === 'rejected' ? 'rgba(251,113,133,0.12)' : 'rgba(252,211,77,0.12)',
                color: app.status === 'accepted' ? '#34D399' : app.status === 'rejected' ? '#FB7185' : '#FCD34D',
                border: `1px solid ${app.status === 'accepted' ? 'rgba(52,211,153,0.25)' : app.status === 'rejected' ? 'rgba(251,113,133,0.25)' : 'rgba(252,211,77,0.25)'}`,
                fontWeight: 700, fontSize: 11
              }}>
                {app.status?.toUpperCase() || 'PENDING'}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
