import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: '/', label: 'Home' },
    { id: '/startups', label: 'Startups' },
    { id: '/coe', label: 'COE' },
    { id: '/hackathons', label: 'Hackathons' },
    { id: '/opportunities', label: 'Opportunities' },
    { id: '/for-students', label: 'For Students' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: '#040405',
      borderBottom: '1px solid rgba(235,236,231,0.08)', padding: '0 24px'
    }}>
      <div style={{
        maxWidth: 1320, margin: '0 auto', height: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #22D3EE 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
            }}>✦</div>
            <span style={{
              fontFamily: 'Arial, sans-serif', fontWeight: 900, fontSize: 20,
              color: '#EBECE7', letterSpacing: '-0.02em'
            }}>LaunchNexus</span>
          </Link>

          <div style={{ display: 'flex', gap: 6 }} className="desktop-nav">
            {navItems.map(n => (
              <Link key={n.id} to={n.id} style={{
                padding: '8px 16px', borderRadius: 'var(--ra-md)', fontSize: 13, fontWeight: 600,
                color: isActive(n.id) ? '#EBECE7' : 'rgba(235,236,231,0.65)',
                background: isActive(n.id) ? 'rgba(235,236,231,0.1)' : 'transparent',
                border: isActive(n.id) ? '1px solid rgba(235,236,231,0.2)' : '1px solid transparent',
                transition: 'var(--ease-smooth)', textDecoration: 'none'
              }}>{n.label}</Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {user ? (
            <>
              <Link to="/dashboard" style={{
                padding: '8px 16px', borderRadius: 'var(--ra-md)', fontSize: 13, fontWeight: 700,
                color: '#040405', background: '#EBECE7', border: '1px solid #EBECE7',
                textDecoration: 'none', transition: 'all 0.2s'
              }}>Dashboard</Link>

              <Link to="/profile" style={{
                padding: '8px 16px', borderRadius: 'var(--ra-md)', fontSize: 13, fontWeight: 700,
                color: isActive('/profile') ? '#EBECE7' : 'rgba(235,236,231,0.65)',
                background: isActive('/profile') ? 'rgba(235,236,231,0.1)' : 'transparent',
                border: `1px solid ${isActive('/profile') ? 'rgba(235,236,231,0.2)' : 'transparent'}`,
                textDecoration: 'none', transition: 'all 0.2s'
              }}>Profile</Link>

              <span style={{ fontSize: 13, color: 'rgba(235,236,231,0.45)', marginLeft: 8 }}>{user.email}</span>
              <button onClick={logout} style={{
                padding: '8px 16px', borderRadius: 'var(--ra-sm)', fontSize: 12, fontWeight: 700,
                fontFamily: 'Arial, sans-serif', cursor: 'pointer', border: '1px solid rgba(235,236,231,0.25)',
                background: 'transparent', color: '#EBECE7', transition: 'all 0.2s'
              }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{
                padding: '8px 16px', borderRadius: 'var(--ra-sm)', fontSize: 12, fontWeight: 700,
                fontFamily: 'Arial, sans-serif', cursor: 'pointer', border: '1px solid rgba(235,236,231,0.25)',
                background: 'transparent', color: '#EBECE7', transition: 'all 0.2s'
              }}>
                Sign In
              </button>
              <button onClick={() => navigate('/register?type=student')} style={{
                padding: '8px 16px', borderRadius: 'var(--ra-sm)', fontSize: 12, fontWeight: 700,
                fontFamily: 'Arial, sans-serif', cursor: 'pointer', border: '1px solid #EBECE7',
                background: 'transparent', color: '#EBECE7', transition: 'all 0.2s'
              }}>
                For Students
              </button>
              <button onClick={() => navigate('/register?type=startup')} style={{
                padding: '8px 16px', borderRadius: 'var(--ra-sm)', fontSize: 12, fontWeight: 700,
                fontFamily: 'Arial, sans-serif', cursor: 'pointer', border: '1px solid #EBECE7',
                background: '#EBECE7', color: '#040405', transition: 'all 0.2s'
              }}>
                List Startup 🚀
              </button>
            </>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            display: 'none', background: 'transparent', border: '1px solid rgba(235,236,231,0.2)',
            color: '#EBECE7', padding: '6px 12px', borderRadius: 8, cursor: 'pointer'
          }}>&#9776;</button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 0',
          borderTop: '1px solid rgba(235,236,231,0.1)', background: '#040405'
        }} className="mobile-nav">
          {navItems.map(n => (
            <Link key={n.id} to={n.id} onClick={() => setMenuOpen(false)} style={{
              padding: '10px 16px', fontSize: 14, color: isActive(n.id) ? '#EBECE7' : 'rgba(235,236,231,0.65)',
              textDecoration: 'none'
            }}>{n.label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
