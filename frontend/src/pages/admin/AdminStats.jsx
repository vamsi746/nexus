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

export default function AdminStats({ stats, startups, students, hackathons, opportunities, orders, pendingCount, onNavigate }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="chip" style={{ background: 'rgba(251,113,133,0.1)', color: '#FB7185', border: '1px solid rgba(251,113,133,0.25)' }}>🔒 Admin Access</span>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 10, color: 'var(--tx0)' }}>Global Control Panel</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Accounts" val={stats?.users || 0} icon="👥" color="#7C6EFA" />
        <StatCard label="Startups" val={stats?.startups || 0} icon="🚀" color="#22D3EE" />
        <StatCard label="Verified" val={startups.filter(s => s.verified).length} icon="✓" color="#34D399" />
        <StatCard label="Pending" val={pendingCount} icon="⏳" color="#F59E0B" />
        <StatCard label="Students" val={stats?.students || 0} icon="🎓" color="#FCD34D" />
        <StatCard label="Hackathons" val={stats?.hackathons || 0} icon="⚡" color="#EC4899" />
        <StatCard label="Opportunities" val={stats?.opportunities || 0} icon="💼" color="#818CF8" />
        <StatCard label="Service Orders" val={stats?.orders || 0} icon="🏢" color="#FB7185" />
        <StatCard label="Revenue" val={`$${(stats?.revenue || 0).toLocaleString()}`} icon="💰" color="#34D399" />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--tx0)' }}>Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {[
          { label: 'Verification Queue', count: pendingCount, icon: '✅', color: '#F59E0B', action: 'verification' },
          { label: 'Manage Startups', count: startups.length, icon: '🚀', color: '#22D3EE', action: 'startups' },
          { label: 'Manage Students', count: students.length, icon: '🎓', color: '#FCD34D', action: 'students' },
          { label: 'Service Orders', count: orders.length, icon: '🏢', color: '#FB7185', action: 'orders' },
        ].map(item => (
          <Card key={item.label} style={{ cursor: 'pointer', padding: 20 }} onClick={() => onNavigate(item.action)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--tx2)', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--tx0)', marginTop: 4 }}>{item.count}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{item.icon}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
