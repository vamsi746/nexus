import Card from '../../components/shared/Card.jsx';

function StatCard({ label, val, icon, color }) {
  return (
    <Card style={{ borderLeft: `3px solid ${color}`, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--tx0)', marginTop: 8 }}>
        {val}
      </div>
    </Card>
  );
}

export default function StudentOverview({ applications, registrations, opportunities, hackathons, onNavigate }) {
  const appCount = applications.length;
  const regCount = registrations.length;
  const oppCount = opportunities.length;
  const hackCount = hackathons.length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="chip" style={{ background: 'rgba(34,211,238,0.1)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.25)' }}>🎓 Student Workspace</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: 'var(--tx0)' }}>My Portfolio Workspace</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Applications" val={appCount} icon="📝" color="#818CF8" />
        <StatCard label="Registrations" val={regCount} icon="🎯" color="#22D3EE" />
        <StatCard label="Open Jobs" val={oppCount} icon="💼" color="#34D399" />
        <StatCard label="Live Hackathons" val={hackCount} icon="⚡" color="#EC4899" />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--tx0)' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {[
          { label: 'Browse Opportunities', count: oppCount, icon: '💼', color: '#34D399', action: 'opportunities', desc: 'Find jobs & internships' },
          { label: 'Browse Hackathons', count: hackCount, icon: '⚡', color: '#EC4899', action: 'hackathons', desc: 'Join build challenges' },
          { label: 'My Applications', count: appCount, icon: '📝', color: '#818CF8', action: 'applications', desc: 'Track application status' },
          { label: 'My Registrations', count: regCount, icon: '🎯', color: '#22D3EE', action: 'registrations', desc: 'View hackathon registrations' },
        ].map(item => (
          <Card key={item.label} style={{ cursor: 'pointer', padding: 20 }} onClick={() => onNavigate(item.action)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--tx0)', marginTop: 4 }}>{item.count}</div>
                <div style={{ fontSize: 11, color: 'var(--tx3)', marginTop: 4 }}>{item.desc}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
