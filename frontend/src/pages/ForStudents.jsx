import { useNavigate } from 'react-router-dom';

export default function ForStudents() {
  const navigate = useNavigate();

  const resources = [
    {
      title: 'Startup Internships',
      desc: 'Apply to paid internships at vetted early-stage startups. Work on real products, not coffee runs.',
      cta: 'Browse Internships',
      route: '/opportunities',
    },
    {
      title: 'Live Hackathons',
      desc: 'Join sponsored engineering challenges. Win cash prizes, build portfolio, and land fast-track offers.',
      cta: 'View Hackathons',
      route: '/hackathons',
    },
    {
      title: 'Skill Accelerator',
      desc: 'Access curated learning paths, mentorship circles, and project-based cohorts led by industry operators.',
      cta: 'Explore Programs',
      route: '/coe',
    },
    {
      title: 'Student Community',
      desc: 'Connect with 148K+ members across 140 countries. Share projects, find co-founders, and get feedback.',
      cta: 'Join Network',
      route: '/register',
    },
  ];

  return (
    <div className="page-container" style={{ position: 'relative' }}>

      {/* HEADER */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <span className="chip" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-light)', border: '1px solid rgba(99, 102, 241, 0.25)', marginBottom: 16 }}>
          🎓 Student Hub
        </span>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 12, letterSpacing: '-0.03em' }}>
          Built for Students
        </h1>
        <p style={{ color: 'var(--tx1)', fontSize: 15, maxWidth: 550, margin: '0 auto' }}>
          Launch your career before you graduate. Internships, hackathons, mentorship, and a global network of builders.
        </p>
      </div>

      {/* RESOURCE CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
        {resources.map((r, idx) => (
          <div key={idx} style={{
            background: '#111114',
            borderRadius: 0,
            padding: 36,
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column', gap: 0,
            position: 'relative',
            fontFamily: 'Arial, sans-serif'
          }}>
            {/* TOP RULE */}
            <div style={{ position: 'absolute', top: 0, left: 36, right: 36, height: 1, background: 'rgba(255,255,255,0.08)' }} />

            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em', marginTop: 4 }}>
              {r.title}
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28 }}>
              {r.desc}
            </p>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 20 }} />

            <button
              onClick={() => navigate(r.route)}
              style={{
                padding: '8px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer', border: 'none',
                background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)', color: '#FFFFFF', transition: 'all 0.2s',
                alignSelf: 'flex-start'
              }}
            >
              {r.cta} →
            </button>

            <div style={{ position: 'absolute', bottom: 0, left: 36, right: 36, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>
        ))}
      </div>

      {/* STATS STRIP */}
      <div style={{
        display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: 'center',
        marginTop: 64, padding: '32px 24px',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'
      }}>
        {[
          { v: '148K+', l: 'Student Members' },
          { v: '320+', l: 'Hackathons Hosted' },
          { v: '$2.4B', l: 'Funding Facilitated' },
          { v: '140+', l: 'Countries Covered' },
        ].map(s => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent-light)', marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--tx2)' }}>{s.l}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
