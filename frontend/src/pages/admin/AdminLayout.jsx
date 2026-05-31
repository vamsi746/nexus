import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'verification', label: 'Verification', icon: '✅' },
  { id: 'startups', label: 'Startups', icon: '🚀' },
  { id: 'students', label: 'Students', icon: '🎓' },
  { id: 'hackathons', label: 'Hackathons', icon: '⚡' },
  { id: 'opportunities', label: 'Opportunities', icon: '💼' },
  { id: 'orders', label: 'Service Orders', icon: '🏢' },
];

export default function AdminLayout({ activeSection, setActiveSection, pendingCount, children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 72px)', background: 'var(--bg0)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 800 }} />
      )}

      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 240, flexShrink: 0, background: 'var(--bg1)', borderRight: '1px solid var(--border)',
        padding: '20px 0', display: 'flex', flexDirection: 'column',
        position: sidebarOpen ? 'fixed' : 'relative', top: 72, left: 0, bottom: 0, zIndex: 900
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--tx3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin Console</div>
          <div style={{ fontSize: 13, color: 'var(--tx1)', marginTop: 4 }}>{user?.email}</div>
        </div>
        {SECTIONS.map(sec => (
          <button key={sec.id} onClick={() => { setActiveSection(sec.id); setSidebarOpen(false); }} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', width: '100%',
            background: activeSection === sec.id ? 'rgba(99,102,241,0.12)' : 'transparent',
            color: activeSection === sec.id ? '#818CF8' : 'var(--tx1)',
            border: 'none', borderLeft: activeSection === sec.id ? '3px solid #818CF8' : '3px solid transparent',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
          }}>
            <span>{sec.icon}</span> {sec.label}
            {sec.id === 'verification' && pendingCount > 0 && (
              <span style={{ marginLeft: 'auto', background: '#FB7185', color: '#fff', borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '28px 32px', overflow: 'auto', minWidth: 0 }}>
        <div className="mobile-only" style={{ marginBottom: 20, display: 'none' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--tx0)', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ☰ Menu
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
