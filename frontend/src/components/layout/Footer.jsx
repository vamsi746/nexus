import { Link } from 'react-router-dom';

export default function Footer() {
  const cols = [
    { title: 'Platform', links: ['Discover Startups', 'Hackathons', 'Opportunities', 'COE Services'] },
    { title: 'Startups', links: ['Submit Startup', 'Verification', 'Dashboard', 'Analytics'] },
    { title: 'Students', links: ['Join Platform', 'Find Internships', 'Hackathons', 'University Portal'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
  ];

  return (
    <footer style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', padding: '50px 24px 24px' }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 32, marginBottom: 48
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: 'linear-gradient(135deg, var(--salmon), var(--salmon-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14
              }}>&#11042;</div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16,
                background: 'linear-gradient(90deg, var(--salmon-light), var(--salmon))', WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>LaunchNexus</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--tx2)', lineHeight: 1.7, maxWidth: 240 }}>
              The global platform connecting startups, students, and enterprise services to accelerate innovation.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {['Twitter', 'LinkedIn', 'GitHub', 'Discord'].map(s => (
                <button key={s} style={{
                  padding: '5px 10px', background: 'var(--bg2)',
                  border: '1px solid var(--border)', borderRadius: 6, color: 'var(--tx2)',
                  cursor: 'pointer', fontSize: 11, fontFamily: "'Space Grotesk', sans-serif"
                }}>{s}</button>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--tx0)', marginBottom: 12 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{
                  fontSize: 12, color: 'var(--tx2)', marginBottom: 8, cursor: 'pointer', transition: 'color 0.15s'
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--salmon-light)'}
                  onMouseLeave={e => e.target.style.color = 'var(--tx2)'}
                >{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24, borderTop: '1px solid var(--border)',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10
        }}>
          <div style={{ fontSize: 12, color: 'var(--tx2)' }}>
            &copy; 2025 LaunchNexus Global Ltd. &middot; All rights reserved
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'var(--tx2)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
