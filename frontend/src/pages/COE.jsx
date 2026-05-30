import { useState, useEffect } from 'react';
import api from '../services/api.js';
import Card from '../components/shared/Card.jsx';

export default function COE() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data)).catch(() => setServices([]));
  }, []);

  const iconMap = {
    Sparkles: '✦',
    Diamond: '◈',
    Code: '⟨/⟩',
    Users: '◉',
    Scale: '⚖',
    Hexagon: '⬡',
    Star: '★',
    Shield: '⛨',
  };

  const resolveIcon = (icon) => iconMap[icon] || icon || '◈';

  return (
    <div className="page-container" style={{ position: 'relative' }}>
      
      {/* GLOW OVERLAYS */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 60%)', zIndex: -1
      }} />

      {/* HEADER STRIP */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <span className="chip" style={{
          background: 'rgba(208, 131, 128, 0.1)', color: 'var(--salmon-light)',
          border: '1px solid rgba(208, 131, 128, 0.25)', marginBottom: 16, display: 'inline-flex'
        }}>&#127979; Strategy Acceleration Centre</span>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 54px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.03em' }}>
          Enterprise COE Services
        </h1>
        <p style={{ fontSize: 16, color: 'var(--tx1)', maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
          Priced for startup models. Gain access to dedicated software, marketing, legal, and scaling expert squads.
        </p>
      </div>

      {/* STRATEGY GRID */}
      <section style={{
        background: '#0A0A0C',
        borderRadius: 'var(--ra-xl)', padding: '60px 48px', marginBottom: 60,
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
          {services.map(s => (
            <Card key={s.id || s._id} variant="neo" style={{ padding: 32, position: 'relative', background: '#111114' }}>
              {s.badge && (
                <span className="chip" style={{
                  position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 10, fontWeight: 700
                }}>{s.badge}</span>
              )}
              <div style={{ fontSize: 36, marginBottom: 20, color: '#fff' }}>{resolveIcon(s.icon)}</div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#fff', letterSpacing: '-0.02em' }}>{s.name}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {(s.items || []).map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ color: '#34D399', fontWeight: 700, fontSize: 12 }}>✓</span> {i}
                  </div>
                ))}
              </div>

              <div style={{
                paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Starting From</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 900, color: '#fff', marginTop: 4 }}>{s.price}</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Request Proposal &rarr;</button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* STRATEGY BOOKING PANEL */}
      <div className="glass-card" style={{
        marginTop: 56, borderRadius: 'var(--ra-lg)',
        padding: '50px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', bottom: -50, right: -50, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(208,131,128,0.06) 0%, transparent 70%)', zIndex: -1
        }} />
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, color: 'var(--tx0)' }}>Need a Tailored Engagement?</h2>
        <p style={{ color: 'var(--tx1)', maxWidth: 550, margin: '0 auto 28px', fontSize: 14, lineHeight: 1.6 }}>
          Our COE acceleration advisors review complex multi-vector development challenges and manage global scaling campaigns.
        </p>
        <button className="btn btn-primary btn-lg">Schedule Strategy Assessment &rarr;</button>
      </div>

    </div>
  );
}
