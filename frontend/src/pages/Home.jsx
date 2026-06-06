import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import StartupRow from '../components/startup/StartupRow.jsx';
import Footer from '../components/layout/Footer.jsx';

/* ─── FALLBACK DATA ─── */
const FALLBACK_STARTUPS = [
  { _id: '1', name: 'NeuralPath AI', founder: 'Alex Chen', initials: 'NP', color: '#7C6EFA', logoUrl: 'https://www.google.com/s2/favicons?domain=openai.com&sz=256', stage: 'Seed', category: 'AI & ML', tagline: 'Autonomous AI agents that reduce enterprise ops costs by 60%', location: 'San Francisco', flag: '🇺🇸', foundedYear: 2023, teamSize: 12, raised: '$2.4M', tags: ['AI Agents', 'Enterprise'], upvoteCount: 847, viewCount: 12400, verified: true, isTrending: true, slug: 'neuralpath-ai' },
  { _id: '2', name: 'GreenVolt', founder: 'Amara Okafor', initials: 'GV', color: '#34D399', logoUrl: 'https://www.google.com/s2/favicons?domain=tesla.com&sz=256', stage: 'Series A', category: 'CleanTech', tagline: 'Decentralized P2P solar energy trading for emerging markets', location: 'Lagos', flag: '🇳🇬', foundedYear: 2022, teamSize: 34, raised: '$8.1M', tags: ['Clean Energy', 'Blockchain'], upvoteCount: 1203, viewCount: 28700, verified: true, isTrending: true, slug: 'greenvolt' },
  { _id: '3', name: 'MediLens', founder: 'Dr. Priya Sharma', initials: 'ML', color: '#FB7185', logoUrl: 'https://www.google.com/s2/favicons?domain=pfizer.com&sz=256', stage: 'Pre-Seed', category: 'HealthTech', tagline: 'CV-powered diagnostics for rural healthcare across SE Asia', location: 'Singapore', flag: '🇸🇬', foundedYear: 2023, teamSize: 8, raised: '$1.2M', tags: ['Health AI', 'Diagnostics'], upvoteCount: 534, viewCount: 8900, verified: true, isTrending: true, slug: 'medilens' },
  { _id: '4', name: 'EduVerse', founder: 'Ravi Patel', initials: 'EV', color: '#FCD34D', logoUrl: 'https://www.google.com/s2/favicons?domain=khanacademy.org&sz=256', stage: 'Seed', category: 'EdTech', tagline: 'Immersive VR classrooms making elite education globally accessible', location: 'Bangalore', flag: '🇮🇳', foundedYear: 2022, teamSize: 23, raised: '$3.7M', tags: ['VR/AR', 'Education'], upvoteCount: 692, viewCount: 15300, verified: true, isTrending: true, slug: 'eduverse' },
  { _id: '5', name: 'ChainPay', founder: 'Omar Hassan', initials: 'CP', color: '#A78BFA', logoUrl: 'https://www.google.com/s2/favicons?domain=wise.com&sz=256', stage: 'Series A', category: 'FinTech', tagline: 'Instant cross-border B2B settlements via stablecoin rails', location: 'Dubai', flag: '🇦🇪', foundedYear: 2021, teamSize: 41, raised: '$12M', tags: ['Stablecoins', 'Payments'], upvoteCount: 1567, viewCount: 41200, verified: true, isTrending: true, slug: 'chainpay' },
  { _id: '6', name: 'RoboFarm', founder: 'Lena Schmidt', initials: 'RF', color: '#22D3EE', logoUrl: 'https://www.google.com/s2/favicons?domain=nvidia.com&sz=256', stage: 'Seed', category: 'Deep Tech', tagline: 'Autonomous micro-robots increasing crop yield 40% with zero pesticides', location: 'Berlin', flag: '🇩🇪', foundedYear: 2022, teamSize: 19, raised: '$5.4M', tags: ['Robotics', 'AgriTech'], upvoteCount: 781, viewCount: 18100, verified: true, isTrending: true, slug: 'robofarm' },
  { _id: '7', name: 'ShopStack', founder: 'Jessica Wu', initials: 'SS', color: '#F97316', logoUrl: 'https://www.google.com/s2/favicons?domain=shopify.com&sz=256', stage: 'Series B', category: 'E-Commerce', tagline: 'AI-native commerce OS for D2C brands scaling to 9 figures', location: 'New York', flag: '🇺🇸', foundedYear: 2020, teamSize: 87, raised: '$31M', tags: ['Commerce', 'AI'], upvoteCount: 2103, viewCount: 67800, verified: true, isTrending: false, slug: 'shopstack' },
  { _id: '8', name: 'DataWeave', founder: 'Tom Brennan', initials: 'DW', color: '#818CF8', logoUrl: 'https://www.google.com/s2/favicons?domain=databricks.com&sz=256', stage: 'Seed', category: 'SaaS & B2B', tagline: 'No-code data pipeline builder shipping analytics 10x faster', location: 'Toronto', flag: '🇨🇦', foundedYear: 2023, teamSize: 11, raised: '$1.8M', tags: ['No-Code', 'Analytics'], upvoteCount: 423, viewCount: 7600, verified: false, isTrending: false, slug: 'dataweave' },
  { _id: '9', name: 'Web3Vault', founder: 'Niklas Weber', initials: 'W3', color: '#8B5CF6', logoUrl: 'https://www.google.com/s2/favicons?domain=coinbase.com&sz=256', stage: 'Seed', category: 'Web3', tagline: 'Enterprise-grade multi-chain custody for institutional crypto', location: 'Zurich', flag: '🇨🇭', foundedYear: 2023, teamSize: 14, raised: '$3.2M', tags: ['Web3', 'Security'], upvoteCount: 612, viewCount: 11200, verified: true, isTrending: false, slug: 'web3vault' },
  { _id: '10', name: 'OceanGuard', founder: 'Erik Larsen', initials: 'OG', color: '#0EA5E9', logoUrl: 'https://www.google.com/s2/favicons?domain=oceanconservancy.org&sz=256', stage: 'Series A', category: 'CleanTech', tagline: 'Autonomous AI ocean trash removal fleets operating 24/7', location: 'Copenhagen', flag: '🇩🇰', foundedYear: 2021, teamSize: 28, raised: '$9.5M', tags: ['Ocean Tech', 'AI'], upvoteCount: 1876, viewCount: 34500, verified: true, isTrending: false, slug: 'oceanguard' },
  { _id: '11', name: 'NexaLearn', founder: 'Sarah Miller', initials: 'NL', color: '#F59E0B', logoUrl: 'https://www.google.com/s2/favicons?domain=duolingo.com&sz=256', stage: 'Pre-Seed', category: 'EdTech', tagline: 'AI tutor that personalizes STEM learning for every student', location: 'London', flag: '🇬🇧', foundedYear: 2024, teamSize: 6, raised: '$850K', tags: ['Education', 'AI'], upvoteCount: 298, viewCount: 5200, verified: true, isTrending: false, slug: 'nexalearn' },
  { _id: '12', name: 'PayFlow', founder: 'David Park', initials: 'PF', color: '#10B981', logoUrl: 'https://www.google.com/s2/favicons?domain=stripe.com&sz=256', stage: 'Series B', category: 'FinTech', tagline: 'Embedded payroll and compliance for global remote teams', location: 'Sydney', flag: '🇦🇺', foundedYear: 2020, teamSize: 64, raised: '$22M', tags: ['Payroll', 'Global'], upvoteCount: 2341, viewCount: 51200, verified: true, isTrending: false, slug: 'payflow' },
];

/* ─── COMPACT BANNER ─── */
function Banner({ navigate }) {
  const [typed, setTyped] = useState('');
  const target = 'today.';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= target.length) {
        setTyped(target.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 120);
    return () => clearInterval(timer);
  }, []);

  return (
    <section style={{ padding: '16px 24px', background: '#0A0A0C' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        background: '#16161A',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap'
      }}>
        {/* Left: big tagline */}
        <div style={{ flex: '1 1 260px' }}>
          <h2 style={{
            fontSize: 'clamp(20px, 2.8vw, 30px)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0
          }}>
            Find tomorrow's market leaders{' '}
            <span style={{
              background: 'linear-gradient(90deg, #06B6D4, #8B5CF6, #EC4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{typed}</span>
            <span className="type-cursor">|</span>
          </h2>
        </div>

        {/* Center: description */}
        <p style={{
          fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: 0,
          flex: '1 1 240px'
        }}>
          LaunchNexus helps you find early-stage startups before they make it big.
        </p>

        {/* Right: buttons */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={() => navigate('/register?type=startup')} style={{
            padding: '8px 18px', borderRadius: 20,
            background: 'linear-gradient(135deg, #06B6D4, #22D3EE)',
            color: '#0A0A0C', fontSize: 13, fontWeight: 700,
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap'
          }}>Submit startup</button>
          <button onClick={() => navigate('/login')} style={{
            padding: '8px 18px', borderRadius: 20,
            background: 'rgba(255,255,255,0.08)', color: '#fff',
            fontSize: 13, fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', whiteSpace: 'nowrap'
          }}>Sign in</button>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS BAR ─── */
function StatsBar({ startups, opportunities, hackathons }) {
  const stats = [
    { val: (startups?.length || 0).toLocaleString(), label: 'Startups Listed' },
    { val: (opportunities?.length || 0).toLocaleString(), label: 'Open Jobs' },
    { val: (hackathons?.length || 0).toLocaleString(), label: 'Live Hackathons' },
    { val: '$14M+', label: 'Total Raised' },
  ];
  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: '#0A0A0C'
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 0
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '28px 24px', textAlign: 'center',
            borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
          }}>
            <div style={{
              fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.02em', fontFamily: 'Arial, sans-serif'
            }}>{s.val}</div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LAUNCHING TODAY (Product Hunt style) ─── */
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const next = new Date(now);
      next.setHours(24, 0, 0, 0);
      const diff = next - now;
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Next Launch In</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif' }}>{pad(timeLeft.hours)}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Hours</div>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginTop: -10 }}>:</span>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif' }}>{pad(timeLeft.minutes)}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mins</div>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginTop: -10 }}>:</span>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif' }}>{pad(timeLeft.seconds)}</div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Secs</div>
        </div>
      </div>
    </div>
  );
}

function LaunchingToday({ startups, navigate }) {
  const today = startups
    .filter(s => s.isTrending || s.trending)
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0))
    .slice(0, 5);
  if (!today.length) return null;

  return (
    <section style={{ padding: '48px 24px', background: '#0A0A0C' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 6px' }}>Today</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>New launches every day at 12:00 AM PDT</p>
          </div>
          <CountdownTimer />
        </div>

        {/* List */}
        {today.map((s, i) => {
          const logoUrl = s.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=${(s.color || '#444').replace('#', '')}&color=fff&size=128&rounded=true&bold=true`;
          const isLast = i === today.length - 1;
          return (
            <div
              key={s._id || s.id}
              onClick={() => navigate(`/startups/${s.slug}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 0',
                borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Logo */}
              <img
                src={logoUrl} alt={s.name}
                onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=${(s.color || '#444').replace('#', '')}&color=fff&size=128&rounded=true&bold=true`; }}
                style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'contain', display: 'block', flexShrink: 0, background: '#16161A' }}
                loading="lazy"
              />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{s.name}</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '0 0 8px', lineHeight: 1.4 }}>{s.tagline}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.category}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.stage}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)' }}>·</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.location}</span>
                </div>
              </div>

              {/* Upvote */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{s.upvoteCount || 0}</span>
              </div>
            </div>
          );
        })}

        {/* Footer link */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <button onClick={() => navigate('/startups')} style={{
            fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline', textUnderlineOffset: 3, padding: 0
          }}>View all companies →</button>
        </div>
      </div>
    </section>
  );
}

/* ─── TRENDING HOVER CARDS ─── */
function TrendingList({ navigate }) {
  const trending = [...FALLBACK_STARTUPS]
    .sort((a, b) => (b.upvoteCount || 0) - (a.upvoteCount || 0));
  if (!trending.length) return null;

  return (
    <section style={{ padding: '64px 24px', background: '#0A0A0C' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          
          <h2 style={{
            fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#fff',
            letterSpacing: '-0.02em', margin: '8px 0 6px'
          }}>Trending Startups</h2>
        </div>
        <div className="trend-grid">
          {trending.map((s) => {
            const logoUrl = s.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=${(s.color || '#444').replace('#', '')}&color=fff&size=128&rounded=true&bold=true`;
            return (
              <div
                key={s._id || s.id}
                className="trend-card"
                onClick={() => navigate(`/startups/${s.slug}`)}
              >
                <img
                  src={logoUrl} alt={s.name}
                  onError={e => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=${(s.color || '#444').replace('#', '')}&color=fff&size=128&rounded=true&bold=true`; }}
                  className="trend-logo"
                  style={{ objectFit: 'contain', display: 'block' }}
                  loading="lazy"
                />
                <div className="trend-name">{s.name}</div>
                <div className="trend-desc">
                  <p style={{ margin: '0 0 6px', color: '#0A0A0C', fontSize: 11, lineHeight: 1.45, fontWeight: 500, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{s.tagline}</p>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 10 }}>{s.category}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 10 }}>{s.stage}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(0,0,0,0.5)', background: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 10 }}>{s.location}</span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: '#8B5CF6' }}>▲ {s.upvoteCount?.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── LOGO WALL ─── */
function LogoWall() {
  const logos = [
    { name: 'NeuralPath', abbr: 'NP', color: '#7C6EFA' },
    { name: 'GreenVolt', abbr: 'GV', color: '#34D399' },
    { name: 'MediLens', abbr: 'ML', color: '#FB7185' },
    { name: 'ChainPay', abbr: 'CP', color: '#A78BFA' },
    { name: 'ShopStack', abbr: 'SS', color: '#F97316' },
    { name: 'RoboFarm', abbr: 'RF', color: '#22D3EE' },
    { name: 'DataWeave', abbr: 'DW', color: '#818CF8' },
    { name: 'Web3Vault', abbr: 'W3', color: '#8B5CF6' },
  ];
  return (
    <section style={{ padding: '64px 24px', background: '#0A0A0C', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 28
        }}>Trusted by top founders worldwide</p>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 24,
          alignItems: 'center', justifyItems: 'center'
        }}>
          {logos.map(l => (
            <div key={l.abbr} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: 0.5, filter: 'grayscale(1)',
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.filter = 'grayscale(0)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.filter = 'grayscale(1)'; }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: l.color, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, color: '#fff'
              }}>{l.abbr}</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA SECTION ─── */
function CTASection({ navigate }) {
  return (
    <section style={{
      padding: '80px 24px', background: '#0A0A0C',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 900,
          color: '#fff', letterSpacing: '-0.02em', marginBottom: 12
        }}>Ready to Launch?</h2>
        <p style={{
          fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 32
        }}>
          Join 5,200+ startups who list their product on LaunchNexus to reach early adopters, investors, and talent.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register?type=startup')} style={{
            padding: '14px 32px', borderRadius: 28,
            background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
            color: '#fff', fontSize: 14, fontWeight: 800,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(236,72,153,0.3)'
          }}>List Your Startup →</button>
          <button onClick={() => navigate('/for-students')} style={{
            padding: '14px 32px', borderRadius: 28,
            background: 'transparent', color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)', fontSize: 14, fontWeight: 700,
            cursor: 'pointer'
          }}>For Students</button>
        </div>
      </div>
    </section>
  );
}

/* ─── MAIN EXPORT ─── */
export default function Home() {
  const [startups, setStartups] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/startups').then(res => setStartups(res.data)).catch(() => setStartups([]));
    api.get('/opportunities').then(res => setOpportunities(res.data)).catch(() => setOpportunities([]));
    api.get('/hackathons').then(res => setHackathons(res.data)).catch(() => setHackathons([]));
  }, []);

  const displayStartups = startups.length ? startups : FALLBACK_STARTUPS;

  return (
    <>
      <Banner navigate={navigate} />
      <StatsBar startups={displayStartups} opportunities={opportunities} hackathons={hackathons} />
      <TrendingList navigate={navigate} />
      <LaunchingToday startups={displayStartups} navigate={navigate} />
      <LogoWall />
      <CTASection navigate={navigate} />
      <Footer />
    </>
  );
}
