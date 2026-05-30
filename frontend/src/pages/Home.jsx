import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import StartupCard from '../components/startup/StartupCard.jsx';
import Card from '../components/shared/Card.jsx';
import Footer from '../components/layout/Footer.jsx';

/* ─── PREMIUM FALLBACK DATA ─── */
const FALLBACK_STARTUPS = [
  { _id: '1', name: 'NeuralPath AI', initials: 'NP', color: '#7C6EFA', stage: 'Seed', category: 'AI & ML', tagline: 'Autonomous AI agents that reduce enterprise ops costs by 60%', location: 'San Francisco, USA', flag: '🇺🇸', foundedYear: 2023, teamSize: 12, raised: '$2.4M', tags: ['AI Agents', 'Enterprise', 'Automation', 'SaaS'], upvoteCount: 847, viewCount: 12400, verified: true, isTrending: true, slug: 'neuralpath-ai', coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80' },
  { _id: '2', name: 'GreenVolt', initials: 'GV', color: '#34D399', stage: 'Series A', category: 'CleanTech', tagline: 'Decentralized P2P solar energy trading for emerging markets', location: 'Lagos, Nigeria', flag: '🇳🇬', foundedYear: 2022, teamSize: 34, raised: '$8.1M', tags: ['Clean Energy', 'Africa', 'Blockchain', 'Impact'], upvoteCount: 1203, viewCount: 28700, verified: true, isTrending: false, slug: 'greenvolt', coverImageUrl: 'https://images.unsplash.com/photo-1509391363532-84c7b8f4a1b8?auto=format&fit=crop&w=1200&q=80' },
  { _id: '3', name: 'MediLens', initials: 'ML', color: '#FB7185', stage: 'Pre-Seed', category: 'HealthTech', tagline: 'CV-powered diagnostics for rural healthcare across SE Asia', location: 'Singapore', flag: '🇸🇬', foundedYear: 2023, teamSize: 8, raised: '$1.2M', tags: ['Health AI', 'Diagnostics', 'Impact', 'Computer Vision'], upvoteCount: 534, viewCount: 8900, verified: true, isTrending: true, slug: 'medilens', coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' },
  { _id: '4', name: 'EduVerse', initials: 'EV', color: '#FCD34D', stage: 'Seed', category: 'EdTech', tagline: 'Immersive VR classrooms making elite education globally accessible', location: 'Bangalore, India', flag: '🇮🇳', foundedYear: 2022, teamSize: 23, raised: '$3.7M', tags: ['VR/AR', 'Education', 'Accessibility', 'B2C'], upvoteCount: 692, viewCount: 15300, verified: true, isTrending: true, slug: 'eduverse', coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80' },
  { _id: '5', name: 'ChainPay', initials: 'CP', color: '#A78BFA', stage: 'Series A', category: 'FinTech', tagline: 'Instant cross-border B2B settlements via stablecoin rails', location: 'Dubai, UAE', flag: '🇦🇪', foundedYear: 2021, teamSize: 41, raised: '$12M', tags: ['Stablecoins', 'B2B Payments', 'Cross-Border', 'FinTech'], upvoteCount: 1567, viewCount: 41200, verified: true, isTrending: false, slug: 'chainpay', coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80' },
  { _id: '6', name: 'RoboFarm', initials: 'RF', color: '#22D3EE', stage: 'Seed', category: 'Deep Tech', tagline: 'Autonomous micro-robots increasing crop yield 40% with zero pesticides', location: 'Berlin, Germany', flag: '🇩🇪', foundedYear: 2022, teamSize: 19, raised: '$5.4M', tags: ['Robotics', 'AgriTech', 'Sustainability', 'Hardware'], upvoteCount: 781, viewCount: 18100, verified: true, isTrending: true, slug: 'robofarm', coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80' },
  { _id: '7', name: 'ShopStack', initials: 'SS', color: '#F97316', stage: 'Series B', category: 'E-Commerce', tagline: 'AI-native commerce OS for D2C brands scaling to 9 figures', location: 'New York, USA', flag: '🇺🇸', foundedYear: 2020, teamSize: 87, raised: '$31M', tags: ['Commerce', 'AI', 'D2C', 'Shopify Alternative'], upvoteCount: 2103, viewCount: 67800, verified: true, isTrending: false, slug: 'shopstack', coverImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80' },
  { _id: '8', name: 'DataWeave', initials: 'DW', color: '#818CF8', stage: 'Seed', category: 'SaaS & B2B', tagline: 'No-code data pipeline builder shipping analytics 10x faster', location: 'Toronto, Canada', flag: '🇨🇦', foundedYear: 2023, teamSize: 11, raised: '$1.8M', tags: ['No-Code', 'Data Engineering', 'Analytics', 'SaaS'], upvoteCount: 423, viewCount: 7600, verified: false, isTrending: true, slug: 'dataweave', coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
  { _id: '9', name: 'Web3Vault', initials: 'W3', color: '#8B5CF6', stage: 'Seed', category: 'Web3', tagline: 'Enterprise-grade multi-chain custody for institutional crypto', location: 'Zurich, Switzerland', flag: '🇨🇭', foundedYear: 2023, teamSize: 14, raised: '$3.2M', tags: ['Web3', 'Blockchain', 'Security', 'Enterprise'], upvoteCount: 612, viewCount: 11200, verified: true, isTrending: false, slug: 'web3vault', coverImageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1200&q=80' },
  { _id: '10', name: 'OceanGuard', initials: 'OG', color: '#0EA5E9', stage: 'Series A', category: 'CleanTech', tagline: 'Autonomous AI ocean trash removal fleets operating 24/7', location: 'Copenhagen, Denmark', flag: '🇩🇰', foundedYear: 2021, teamSize: 28, raised: '$9.5M', tags: ['Ocean Tech', 'Robotics', 'AI', 'Sustainability'], upvoteCount: 1876, viewCount: 34500, verified: true, isTrending: false, slug: 'oceanguard', coverImageUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80' },
  { _id: '11', name: 'NexaLearn', initials: 'NL', color: '#F59E0B', stage: 'Pre-Seed', category: 'EdTech', tagline: 'AI tutor that personalizes STEM learning for every student', location: 'London, UK', flag: '🇬🇧', foundedYear: 2024, teamSize: 6, raised: '$850K', tags: ['Education', 'AI Tutor', 'STEM', 'Personalization'], upvoteCount: 298, viewCount: 5200, verified: true, isTrending: false, slug: 'nexalearn', coverImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80' },
  { _id: '12', name: 'PayFlow', initials: 'PF', color: '#10B981', stage: 'Series B', category: 'FinTech', tagline: 'Embedded payroll and compliance for global remote teams', location: 'Sydney, Australia', flag: '🇦🇺', foundedYear: 2020, teamSize: 64, raised: '$22M', tags: ['Payroll', 'Global Hiring', 'Compliance', 'FinTech'], upvoteCount: 2341, viewCount: 51200, verified: true, isTrending: false, slug: 'payflow', coverImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80' },
  { _id: '13', name: 'NeuroFit', initials: 'NF', color: '#EF4444', stage: 'Seed', category: 'HealthTech', tagline: 'Brain-computer interface wearables for ADHD and focus', location: 'Boston, USA', flag: '🇺🇸', foundedYear: 2023, teamSize: 9, raised: '$2.1M', tags: ['Neurotech', 'Wearables', 'ADHD', 'BCI'], upvoteCount: 478, viewCount: 9800, verified: true, isTrending: false, slug: 'neurofit', coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80' },
  { _id: '14', name: 'SonicGrid', initials: 'SG', color: '#EC4899', stage: 'Series A', category: 'Media', tagline: 'Generative audio engine for game studios and film composers', location: 'Stockholm, Sweden', flag: '🇸🇪', foundedYear: 2022, teamSize: 31, raised: '$7.8M', tags: ['Generative AI', 'Audio', 'Gaming', 'Creative Tools'], upvoteCount: 1045, viewCount: 22300, verified: true, isTrending: false, slug: 'sonicgrid', coverImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80' },
  { _id: '15', name: 'DronePath', initials: 'DP', color: '#6366F1', stage: 'Series A', category: 'Deep Tech', tagline: 'Autonomous drone delivery network for last-mile logistics', location: 'São Paulo, Brazil', flag: '🇧🇷', foundedYear: 2021, teamSize: 47, raised: '$14M', tags: ['Drones', 'Logistics', 'Autonomy', 'Delivery'], upvoteCount: 1567, viewCount: 38900, verified: true, isTrending: false, slug: 'dronepath', coverImageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80' },
  { _id: '16', name: 'TerraCarbon', initials: 'TC', color: '#22C55E', stage: 'Seed', category: 'CleanTech', tagline: 'Satellite-verified carbon credit marketplace for reforestation', location: 'Nairobi, Kenya', flag: '🇰🇪', foundedYear: 2023, teamSize: 15, raised: '$4.1M', tags: ['Carbon Credits', 'Satellite', 'Reforestation', 'Climate'], upvoteCount: 823, viewCount: 16700, verified: true, isTrending: false, slug: 'terracarbon', coverImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
  { _id: '17', name: 'LegalBot', initials: 'LB', color: '#A855F7', stage: 'Pre-Seed', category: 'SaaS & B2B', tagline: 'AI legal assistant for startups — contracts, IP, and compliance', location: 'Berlin, Germany', flag: '🇩🇪', foundedYear: 2024, teamSize: 7, raised: '$1.1M', tags: ['Legal Tech', 'AI', 'Contracts', 'Startups'], upvoteCount: 389, viewCount: 7400, verified: true, isTrending: false, slug: 'legalbot', coverImageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80' },
  { _id: '18', name: 'ByteBazaar', initials: 'BB', color: '#F97316', stage: 'Series B', category: 'E-Commerce', tagline: 'Social commerce platform for creators selling digital products', location: 'Seoul, South Korea', flag: '🇰🇷', foundedYear: 2020, teamSize: 72, raised: '$28M', tags: ['Social Commerce', 'Creator Economy', 'Digital Goods', 'Asia'], upvoteCount: 3102, viewCount: 72100, verified: true, isTrending: false, slug: 'bytebazaar', coverImageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4b994e?auto=format&fit=crop&w=1200&q=80' },
  { _id: '19', name: 'MindWell', initials: 'MW', color: '#06B6D4', stage: 'Seed', category: 'HealthTech', tagline: 'VR therapy platform for anxiety and PTSD treatment at home', location: 'Amsterdam, Netherlands', flag: '🇳🇱', foundedYear: 2023, teamSize: 10, raised: '$1.9M', tags: ['VR Therapy', 'Mental Health', 'Telemedicine', 'Wellness'], upvoteCount: 645, viewCount: 13400, verified: true, isTrending: false, slug: 'mindwell', coverImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80' },
];

const FALLBACK_HACKATHONS = [
  { _id: 'h1', title: 'AI for Healthcare Global Hackathon 2025', startupName: 'MediLens', color: '#FB7185', initials: 'ML', prizePool: '$50,000', spots: 2340, maxSpots: 5000, deadline: 'Jun 15, 2025', status: 'open', tags: ['AI', 'Healthcare', 'Open Source'], duration: '72 hours', description: 'Build AI solutions that improve healthcare access in underserved communities.', isTrending: true, coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' },
  { _id: 'h2', title: 'CleanTech Innovation Challenge', startupName: 'GreenVolt', color: '#34D399', initials: 'GV', prizePool: '$30,000', spots: 1890, maxSpots: 3000, deadline: 'Jul 1, 2025', status: 'open', tags: ['CleanEnergy', 'Climate', 'Hardware'], duration: '7 days', description: 'Design novel energy distribution solutions for off-grid communities.', isTrending: true, coverImageUrl: 'https://images.unsplash.com/photo-1509391363532-84c7b8f4a1b8?auto=format&fit=crop&w=1200&q=80' },
  { _id: 'h3', title: 'FinTech Frontier Buildathon', startupName: 'ChainPay', color: '#A78BFA', initials: 'CP', prizePool: '$75,000', spots: 3100, maxSpots: 3500, deadline: 'Jun 28, 2025', status: 'open', tags: ['Blockchain', 'Payments', 'DeFi'], duration: '48 hours', description: 'Build the next generation of cross-border payment infrastructure.', isTrending: true, coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80' },
  { _id: 'h4', title: 'EdVerse Metaverse Build Sprint', startupName: 'EduVerse', color: '#FCD34D', initials: 'EV', prizePool: '$40,000', spots: 1560, maxSpots: 3000, deadline: 'Sep 5, 2025', status: 'open', tags: ['VR/AR', 'Education', 'Gaming'], duration: '96 hours', description: 'Build immersive educational experiences in VR/AR.', isTrending: true, coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80' },
  { _id: 'h5', title: 'Enterprise AI Automation Sprint', startupName: 'NeuralPath AI', color: '#7C6EFA', initials: 'NP', prizePool: '$100,000', spots: 890, maxSpots: 2000, deadline: 'Aug 10, 2025', status: 'upcoming', tags: ['AI Agents', 'Enterprise', 'Automation'], duration: '5 days', description: 'Create autonomous AI agents that solve real enterprise bottlenecks.', isTrending: false, coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80' },
];

const FALLBACK_SERVICES = [
  { id: 1, name: 'Brand & Identity', icon: '✦', color: 'var(--accent)', desc: 'Logo, pitch decks, and full visual guidelines by our creative network.', items: ['Brand Guidelines', 'Pitch Deck Overhaul', 'Marketing Materials'], price: 'From $499', badge: 'Popular' },
  { id: 2, name: 'Digital Growth Strategy', icon: '◈', color: '#8B5CF6', desc: 'Full-funnel growth: performance ads, search optimization, and content engines.', items: ['SEO Overhaul', 'Meta/Google Ads', 'Data Engineering'], price: 'From $799/mo', badge: 'Active' },
  { id: 3, name: 'Dedicated Development', icon: '⟨/⟩', color: 'var(--accent-light)', desc: 'MVP engineering squads, scaling cloud infrastructure, and product scoping.', items: ['MVP Sprint', 'DevOps Architecture', 'React scaling'], price: 'From $150/hr', badge: 'Top Rated' },
];

/* ─── WALLET STACK COMPONENT ─── */
function WalletStack({ startups, allStartups, navigate }) {
  const [browseCat, setBrowseCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const trending = startups.filter(s => s.isTrending);
  if (!trending.length) return null;

  const browseList = allStartups && allStartups.length ? allStartups : startups;

  // Derive categories from all startups
  const allCats = ['All', ...Array.from(new Set(browseList.map(s => s.category).filter(Boolean)))];
  const filteredStartups = browseList.filter(s => {
    const matchesCat = browseCat === 'All' || s.category === browseCat;
    const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const catIcons = {
    'All': '◈',
    'AI & ML': '⟁',
    'FinTech': '◈',
    'HealthTech': '⊕',
    'EdTech': '◉',
    'SaaS & B2B': '⬡',
    'CleanTech': '✦',
    'Web3': '◉',
    'E-Commerce': '◈',
    'Deep Tech': '◇',
    'Media': '◉',
  };

  const fallbackImages = [
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <section style={{ padding: '80px 24px', background: '#0A0A0C' }}>
      {/* HEADER */}
      <div style={{
        maxWidth: 1320, margin: '0 auto',
        textAlign: 'center',
        marginBottom: 48
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 20,
          background: 'rgba(236,72,153,0.12)',
          border: '1px solid rgba(236,72,153,0.22)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: '#EC4899',
          marginBottom: 12
        }}>🔥 Trending Now</div>
        <h2 className="section-title" style={{ margin: '0 0 6px' }}>Trending Startups</h2>
        <p className="section-sub" style={{ margin: '0 auto 24px', maxWidth: 480 }}>Hand-picked by our editorial team — the ones to watch this week</p>
      </div>

      {/* TRENDING GRID — small cards */}
      <div style={{
        maxWidth: 1320, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 18
      }}>
        {trending.map((startup, idx) => {
          const img = startup.coverImageUrl || [
            'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80'
          ][idx % 5];
          return (
            <div key={startup._id || startup.id || idx}
              onClick={() => navigate(`/startups/${startup.slug}`)}
              style={{
                borderRadius: 14,
                overflow: 'hidden',
                background: '#141418',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Image */}
              <div style={{
                height: 120,
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(20,20,24,0.9) 100%)'
                }} />
                <span style={{
                  position: 'absolute', top: 8, left: 8,
                  padding: '3px 8px', borderRadius: 6,
                  background: 'rgba(236,72,153,0.2)', color: '#EC4899',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', border: '1px solid rgba(236,72,153,0.3)'
                }}>🔥</span>
              </div>
              {/* Info */}
              <div style={{ padding: '12px 14px 16px' }}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: '#fff',
                  letterSpacing: '-0.01em', lineHeight: 1.3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>{startup.name}</div>
                <div style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4,
                  textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600
                }}>{startup.category}</div>
                <div style={{
                  display: 'flex', gap: 10, marginTop: 8,
                  fontSize: 11, color: 'rgba(255,255,255,0.5)'
                }}>
                  <span>{startup.raised}</span>
                  <span>•</span>
                  <span>{startup.upvoteCount?.toLocaleString()} ▲</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BROWSE ALL CTA */}
      <div style={{ maxWidth: 1320, margin: '40px auto 0', textAlign: 'center' }}>
        <button onClick={() => navigate('/startups')} style={{
          padding: '12px 28px', borderRadius: 24,
          background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
          color: '#fff', fontSize: 13, fontWeight: 700,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 4px 18px rgba(236,72,153,0.4)',
          transition: 'all 0.3s'
        }}>Browse All Startups →</button>
      </div>

      {/* ─── BROWSE BY CATEGORY — BLACK CARD ─── */}
      <div style={{
        maxWidth: 1320, margin: '80px auto 0',
        background: '#0A0A0C',
        borderRadius: 28,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        minHeight: 500
      }}>
        {/* Top bar: search + categories */}
        <div style={{
          padding: '28px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)'
        }}>
          {/* Search — centered */}
          <div style={{ marginBottom: 22, textAlign: 'center' }}>
            <input
              type="text"
              placeholder="Browse by category or startup name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', maxWidth: 480,
                padding: '12px 20px', borderRadius: 12,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, fontWeight: 500,
                outline: 'none',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center'
              }}
            />
          </div>

          {/* Category pills with icons */}
          <div style={{
            fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            marginBottom: 10,
            textAlign: 'center'
          }}>Filter by technology vector:</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {allCats.map(cat => (
              <button key={cat} onClick={() => setBrowseCat(cat)} style={{
                padding: '7px 14px', borderRadius: 20,
                background: browseCat === cat ? 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)' : 'rgba(255,255,255,0.05)',
                color: '#fff', fontSize: 12, fontWeight: 700,
                border: `1px solid ${browseCat === cat ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.02em',
                display: 'inline-flex', alignItems: 'center', gap: 6
              }}>
                <span style={{ fontSize: 13 }}>{catIcons[cat] || '◈'}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 32px 24px',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            marginBottom: 14
          }}>
            Showing {filteredStartups.length} verified startup{filteredStartups.length !== 1 ? 's' : ''}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 18
          }}>
            {filteredStartups.map((startup, idx) => {
              const img = startup.coverImageUrl || fallbackImages[idx % fallbackImages.length];
              return (
                <div key={startup._id || startup.id || idx}
                  onClick={() => navigate(`/startups/${startup.slug}`)}
                  style={{
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: '#141418',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  {/* Image */}
                  <div style={{
                    height: 120,
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(180deg, transparent 40%, rgba(20,20,24,0.9) 100%)'
                    }} />
                  </div>
                  {/* Name */}
                  <div style={{ padding: '12px 14px 16px' }}>
                    <div style={{
                      fontSize: 13, fontWeight: 800, color: '#fff',
                      letterSpacing: '-0.01em', lineHeight: 1.3,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{startup.name}</div>
                    <div style={{
                      fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4,
                      textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600
                    }}>{startup.category}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredStartups.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              No startups match your search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── HACKATHON CAROUSEL COMPONENT ─── */
function HackathonCarousel({ hackathons, navigate }) {
  const [active, setActive] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const trending = hackathons.filter(h => h.isTrending).slice(0, 5);
  if (!trending.length) return null;

  useEffect(() => {
    const updateCount = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % Math.max(1, trending.length - visibleCount + 1)), 6000);
    return () => clearInterval(timer);
  }, [trending.length, visibleCount]);

  const totalSets = Math.max(1, trending.length - visibleCount + 1);
  const safeActive = active % totalSets;

  const statusConfig = {
    open:     { color: '#34D399', label: 'OPEN' },
    upcoming: { color: '#FCD34D', label: 'UPCOMING' },
    closed:   { color: '#DC2626', label: 'CLOSED' },
  };

  return (
    <section style={{ padding: '80px 24px', background: '#0A0A0C' }}>
      {/* HEADER */}
      <div style={{ maxWidth: 1320, margin: '0 auto', textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 20,
          background: 'rgba(34,211,238,0.12)',
          border: '1px solid rgba(34,211,238,0.22)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: '#22D3EE',
          marginBottom: 12
        }}>⚡ Build & Win</div>
        <h2 className="section-title" style={{ margin: '0 0 6px' }}>Trending Hackathons</h2>
        <p className="section-sub" style={{ margin: '0 auto 16px', maxWidth: 480 }}>Solve challenging engineering prompts sponsored by verified startups — prizes, mentorship, and fast-track offers.</p>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/hackathons')}>Browse All Hackathons</button>
      </div>

      {/* 3-CARD CAROUSEL */}
      <div style={{ maxWidth: 1200, margin: '0 auto', overflow: 'hidden' }}>
        <div style={{
          display: 'flex',
          transform: `translateX(-${safeActive * (100 / visibleCount)}%)`,
          transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
        }}>
          {trending.map((h, idx) => {
            const sc = statusConfig[h.status] || statusConfig.open;
            const pct = Math.round((h.spots || 0) / (h.maxSpots || 1) * 100);
            const isLast = idx === trending.length - 1;
            return (
              <div key={h._id || h.id || idx} style={{
                flex: `0 0 ${100 / visibleCount}%`,
                minWidth: 320,
                paddingRight: isLast ? 0 : 20,
                boxSizing: 'border-box'
              }}>
                <div style={{
                  height: '100%',
                  background: '#0A0A0C',
                  border: '1px solid rgba(255,255,255,0.06)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
                  display: 'flex', flexDirection: 'column', gap: 0,
                  position: 'relative',
                  fontFamily: 'Arial, sans-serif'
                }}>
                {/* ── TOP RULE ── */}
                <div style={{
                  position: 'absolute', top: 0, left: 24, right: 24, height: 1,
                  background: 'rgba(255,255,255,0.06)'
                }} />

                {/* Cover image area */}
                <div style={{
                  height: 160,
                  backgroundImage: `url(${h.coverImageUrl || 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80'})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(10,10,12,0.3) 0%, rgba(10,10,12,0.85) 100%)'
                  }} />
                </div>

                <div style={{ padding: 28, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* ── SPONSOR + STATUS ── */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                    marginBottom: 18
                  }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)'
                    }}>
                      {h.startupName || 'Startup'}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: sc.color,
                      borderBottom: `1px solid ${sc.color}`,
                      paddingBottom: 2
                    }}>
                      {sc.label}
                    </span>
                  </div>

                  {/* ── TITLE ── */}
                  <h3 style={{
                    fontSize: 20, fontWeight: 700, lineHeight: 1.2,
                    color: '#fff',
                    marginBottom: 8, letterSpacing: '-0.02em'
                  }}>
                    {h.title}
                  </h3>

                  {/* ── DURATION / DEADLINE ── */}
                  <div style={{
                    fontSize: 13, fontWeight: 400,
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: 24
                  }}>
                    {h.duration || '48h'} &nbsp;·&nbsp; Deadline {h.deadline || 'TBA'}
                  </div>

                  {/* ── MID RULE ── */}
                  <div style={{
                    height: 1,
                    background: 'rgba(255,255,255,0.06)',
                    marginBottom: 20
                  }} />

                  {/* ── META ROW ── */}
                  <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                    <div>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        marginBottom: 6
                      }}>Prize Pool</div>
                      <div style={{
                        fontFamily: 'Arial, sans-serif',
                        fontSize: 16, fontWeight: 700,
                        color: '#fff'
                      }}>{h.prizePool || '$0'}</div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        marginBottom: 6
                      }}>Seats Filled</div>
                      <div style={{
                        fontSize: 16, fontWeight: 700,
                        color: '#fff'
                      }}>{pct}%</div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.35)',
                        marginBottom: 6
                      }}>Max Spots</div>
                      <div style={{
                        fontSize: 16, fontWeight: 700,
                        color: '#fff'
                      }}>{(h.maxSpots || 1000).toLocaleString()}</div>
                    </div>
                  </div>

                  {/* ── TAGS ── */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                    {(h.tags || ['AI', 'Healthcare', 'React']).map(t => (
                      <span key={t} style={{
                        padding: '5px 12px', borderRadius: 0, fontSize: 11, fontWeight: 500,
                        background: 'rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.6)',
                        border: '1px solid rgba(255,255,255,0.08)'
                      }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ flex: 1 }} />

                  {/* ── ACTION ROW ── */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginTop: 'auto'
                  }}>
                    <div style={{
                      fontSize: 11, fontWeight: 500, letterSpacing: '0.05em',
                      color: 'rgba(255,255,255,0.3)',
                      textTransform: 'uppercase'
                    }}>
                      ID: {h._id?.slice(-6).toUpperCase() || 'NEXUS'}
                    </div>
                    <button
                      onClick={() => navigate('/hackathons')}
                      style={{
                        padding: '8px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
                        textTransform: 'uppercase', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)',
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.85)',
                        transition: 'all 0.2s',
                        borderRadius: 20
                      }}
                    >
                      View Challenge →
                    </button>
                  </div>
                </div>

                {/* ── BOTTOM RULE (flush) ── */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 24, right: 24, height: 1,
                  background: 'rgba(255,255,255,0.06)'
                }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot nav */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 32 }}>
        {Array.from({ length: totalSets }).map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            width: i === safeActive ? 28 : 8, height: 8, borderRadius: 4,
            background: i === safeActive ? '#F59E0B' : 'rgba(0,0,0,0.2)',
            border: 'none', cursor: 'pointer',
            transition: 'all 0.4s ease'
          }} />
        ))}
      </div>
    </section>
  );
}

/* ─── HERO CAROUSEL COMPONENT ─── */
function HeroCarousel({ navigate }) {
  const [active, setActive] = useState(0);

  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
      label: 'Startups',
      stat: '5,200+',
      statLabel: 'Startups Listed',
      headline: 'Launchpad for\nVisionary Founders',
      body: 'Connect with early adopters, investors, and a global user base ready to try emerging products.',
      cta1: { text: 'List Your Startup', route: '/register?type=startup' },
      cta2: { text: 'Browse Startups', route: '/startups' },
    },
    {
      img: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      label: 'Hackathons',
      stat: '$2.4M+',
      statLabel: 'Prizes Awarded',
      headline: 'Build, Compete,\nWin Big',
      body: 'Join sponsored engineering challenges. Cash prizes, fast-track offers, and real portfolio projects.',
      cta1: { text: 'Join a Hackathon', route: '/hackathons' },
      cta2: { text: 'Sponsor One', route: '/register?type=startup' },
    },
    {
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      label: 'Opportunities',
      stat: '12,400+',
      statLabel: 'Jobs & Internships',
      headline: 'Talent Meets\nHigh-Growth Startups',
      body: 'Paid internships and full-time roles at vetted early-stage companies across 140 countries.',
      cta1: { text: 'Find Opportunities', route: '/opportunities' },
      cta2: { text: 'For Students', route: '/for-students' },
    },
    {
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      label: 'COE',
      stat: '320+',
      statLabel: 'COE Programs',
      headline: 'Enterprise-Grade\nAcceleration',
      body: 'From brand identity to cloud architecture — scaling services built for startup velocity.',
      cta1: { text: 'Explore COE', route: '/coe' },
      cta2: { text: 'Get a Quote', route: '/coe' },
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActive(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const s = slides[active];

  return (
    <section style={{
      position: 'relative',
      minHeight: 'clamp(500px, 85vh, 880px)',
      background: '#0A0A0C',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 24px'
    }}>
      {/* ─── PLAYER CARD (full images, text overlaid) ─── */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 2000,
        minHeight: 'clamp(420px, 70vh, 760px)',
        borderRadius: 32,
        overflow: 'hidden',
        background: '#0A0A0C',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 32px 100px rgba(0,0,0,0.35)',
      }}>

        {/* FULL-CARD IMAGES */}
        {slides.map((slide, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.img})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === active ? 1 : 0,
            transition: 'opacity 1.2s ease',
            transform: i === active ? 'scale(1.04)' : 'scale(1)',
          }} />
        ))}

        {/* DARK OVERLAY for text readability */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(10,10,12,0.88) 0%, rgba(10,10,12,0.70) 40%, rgba(10,10,12,0.25) 70%, rgba(10,10,12,0.10) 100%)',
          zIndex: 2
        }} />

        {/* CONTENT (left side, over images) */}
        <div style={{
          position: 'relative', zIndex: 3,
          height: '100%', display: 'flex', alignItems: 'center',
          padding: 'clamp(24px, 4vw, 64px) clamp(20px, 4vw, 56px)'
        }}>
          <div style={{ maxWidth: 520 }}>
            {/* Mini stat row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#fff', fontWeight: 700
              }}>{s.statLabel.charAt(0)}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{s.stat}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{s.statLabel}</div>
              </div>
            </div>

            {/* CHIP */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 20,
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.28)',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: '#F59E0B',
              marginBottom: 'clamp(12px, 2vw, 24px)', alignSelf: 'flex-start'
            }}>
              ⚡ {s.label} Focus
            </div>

            {/* HEADLINE */}
            <h1 style={{
              fontSize: 'clamp(24px, 5vw, 54px)', fontWeight: 900,
              lineHeight: 1.08, letterSpacing: '-0.03em',
              color: '#fff', marginBottom: 'clamp(10px, 2vw, 18px)'
            }}>
              {s.headline.replace(/\n/g, ' ')}
            </h1>

            {/* BODY */}
            <p style={{
              fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.6, color: 'rgba(255,255,255,0.60)',
              marginBottom: 'clamp(16px, 3vw, 38px)', maxWidth: 420
            }}>
              {s.body}
            </p>

            {/* CTAS */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate(s.cta1.route)} style={{
                padding: 'clamp(10px, 1.5vw, 12px) clamp(18px, 2vw, 28px)', borderRadius: 26,
                background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                color: '#fff', fontSize: 'clamp(13px, 1.5vw, 14px)', fontWeight: 700,
                border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
                transition: 'all 0.3s', flex: '1 1 140px'
              }}>{s.cta1.text}</button>
              <button onClick={() => navigate(s.cta2.route)} style={{
                padding: 'clamp(10px, 1.5vw, 12px) clamp(18px, 2vw, 28px)', borderRadius: 26,
                background: 'transparent',
                color: '#fff', fontSize: 'clamp(13px, 1.5vw, 14px)', fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer',
                transition: 'all 0.3s', flex: '1 1 140px'
              }}>{s.cta2.text} →</button>
            </div>
          </div>
        </div>

        {/* DOT NAVIGATION — bottom-left */}
        <div style={{
          position: 'absolute', bottom: 'clamp(12px, 2vw, 28px)', left: 'clamp(16px, 4vw, 56px)', zIndex: 5,
          display: 'flex', gap: 8, alignItems: 'center'
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? 28 : 8, height: 8, borderRadius: 4,
              background: i === active ? '#F43F5E' : 'rgba(255,255,255,0.25)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.4s ease'
            }} />
          ))}
          <span style={{
            fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.30)',
            marginLeft: 10, fontFamily: 'Arial, sans-serif', letterSpacing: '0.05em'
          }}>0{active + 1} / 0{slides.length}</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [startups, setStartups] = useState([]);
  const [allStartups, setAllStartups] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [trendingHackathons, setTrendingHackathons] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/startups/trending').then(res => setStartups(res.data)).catch(() => setStartups([]));
    api.get('/startups').then(res => setAllStartups(res.data)).catch(() => setAllStartups([]));
    api.get('/hackathons/trending').then(res => setTrendingHackathons(res.data)).catch(() => setTrendingHackathons([]));
    api.get('/hackathons').then(res => setHackathons(res.data)).catch(() => setHackathons([]));
    api.get('/services').then(res => setServices(res.data.slice(0, 3))).catch(() => setServices([]));
  }, []);

  const displayStartups = startups.length ? startups : FALLBACK_STARTUPS;
  const displayAllStartups = allStartups.length ? allStartups : FALLBACK_STARTUPS;
  const displayHackathons = hackathons.length ? hackathons : FALLBACK_HACKATHONS;
  const displayServices = services.length ? services : FALLBACK_SERVICES;

  return (
    <>
      {/* HERO — DARK CAROUSEL */}
      <HeroCarousel navigate={navigate} />

      {/* TRENDING STARTUPS — WALLET STACK */}
      <WalletStack startups={displayStartups} allStartups={displayAllStartups} navigate={navigate} />

      {/* TRENDING HACKATHONS — DARK CAROUSEL */}
      <HackathonCarousel hackathons={trendingHackathons.length ? trendingHackathons : FALLBACK_HACKATHONS} navigate={navigate} />

      {/* ENTERPRISE SERVICES ACCELERATOR */}
      <section style={{
        padding: '80px 24px',
        background: '#0A0A0C',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          {/* CENTERED HEADER */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="chip" style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--accent-light)',
              border: '1px solid rgba(99, 102, 241, 0.22)',
              marginBottom: 12
            }}>🏢 COE ACCELERATION</span>
            <h2 className="section-title" style={{ marginTop: 12, color: '#fff' }}>Enterprise Services for Startups</h2>
            <p className="section-sub" style={{ margin: '12px auto 20px', maxWidth: 560, color: 'rgba(255,255,255,0.5)' }}>
              Acceleration-tier scaling support covering legal, design, marketing and software dev
            </p>
            <button onClick={() => navigate('/coe')} style={{
              padding: '10px 24px', borderRadius: 24,
              background: '#fff', color: '#0A0A0C',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.04em',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>Explore COE &rarr;</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {displayServices.map(s => (
              <Card key={s.id || s._id} variant="neo" style={{ padding: 32, position: 'relative', background: '#EBECE7' }}>
                {s.badge && (
                  <span className="chip" style={{
                    position: 'absolute', top: 20, right: 20, background: 'rgba(10,10,12,0.06)',
                    color: '#1A1A1D', border: '1px solid rgba(10,10,12,0.1)', fontSize: 10, fontWeight: 700
                  }}>{s.badge}</span>
                )}
                <div style={{ fontSize: 36, marginBottom: 20, color: '#1A1A1D' }}>{s.icon || '✦'}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: '#1A1A1D', letterSpacing: '-0.02em' }}>{s.name}</h3>
                <p style={{ fontSize: 14, color: '#3A3A3D', lineHeight: 1.7, marginBottom: 24 }}>{s.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {(s.items || []).map(i => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#3A3A3D' }}>
                      <span style={{ color: '#2A8A4A', fontWeight: 700, fontSize: 12 }}>✓</span> {i}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center" style={{ paddingTop: 20, borderTop: '1px solid rgba(10,10,12,0.1)' }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Starting From</div>
                    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 22, fontWeight: 900, color: '#1A1A1D', marginTop: 4 }}>
                      {s.price}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/coe')} style={{ color: '#1A1A1D' }}>Inquire Quote &rarr;</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}
