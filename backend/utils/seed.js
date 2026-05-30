import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Startup from '../models/Startup.js';
import Hackathon from '../models/Hackathon.js';
import Opportunity from '../models/Opportunity.js';
import Category from '../models/Category.js';
import User from '../models/User.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany();
  await Startup.deleteMany();
  await Hackathon.deleteMany();
  await Opportunity.deleteMany();
  await Category.deleteMany();

  const hashedPwd = await bcrypt.hash('123456', 10);

  // Admin Account
  await User.create({
    email: 'admin@nexus.com',
    password: hashedPwd,
    role: 'admin',
    isVerified: true
  });

  // Account Manager Account
  await User.create({
    email: 'accmanager@nexus.com',
    password: hashedPwd,
    role: 'service_provider',
    isVerified: true
  });

  // Founder Account
  const user = await User.create({
    email: 'founder@launchnexus.com',
    password: hashedPwd,
    role: 'startup_admin',
    isVerified: true,
  });
  const userId = user._id;

  const startups = [
    {
      name: 'NeuralPath AI', initials: 'NP', color: '#7C6EFA', stage: 'Seed', category: 'AI & ML',
      tagline: 'Autonomous AI agents that reduce enterprise ops costs by 60%',
      location: 'San Francisco, USA', flag: '🇺🇸', foundedYear: 2023, teamSize: 12, raised: '$2.4M',
      tags: ['AI Agents', 'Enterprise', 'Automation', 'SaaS'], upvoteCount: 847, viewCount: 12400,
      verified: true, isFeatured: true, isTrending: true,
      description: 'NeuralPath builds the orchestration layer for enterprise AI — enabling autonomous, multi-step workflow execution across any business system without custom code. Backed by Y Combinator W24.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'GreenVolt', initials: 'GV', color: '#34D399', stage: 'Series A', category: 'CleanTech',
      tagline: 'Decentralized P2P solar energy trading for emerging markets',
      location: 'Lagos, Nigeria', flag: '🇳🇬', foundedYear: 2022, teamSize: 34, raised: '$8.1M',
      tags: ['Clean Energy', 'Africa', 'Blockchain', 'Impact'], upvoteCount: 1203, viewCount: 28700,
      verified: true, isFeatured: true, isTrending: false,
      description: 'GreenVolt powers Africa\'s energy transition through a decentralized trading platform that lets solar panel owners sell excess energy directly to neighbors.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1509391363532-84c7b8f4a1b8?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'MediLens', initials: 'ML', color: '#FB7185', stage: 'Pre-Seed', category: 'HealthTech',
      tagline: 'CV-powered diagnostics for rural healthcare across SE Asia',
      location: 'Singapore', flag: '🇸🇬', foundedYear: 2023, teamSize: 8, raised: '$1.2M',
      tags: ['Health AI', 'Diagnostics', 'Impact', 'Computer Vision'], upvoteCount: 534, viewCount: 8900,
      verified: true, isFeatured: false, isTrending: true,
      description: 'MediLens deploys computer vision models on affordable hardware to give rural clinics diagnostic capabilities previously only available in tier-1 hospitals.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'EduVerse', initials: 'EV', color: '#FCD34D', stage: 'Seed', category: 'EdTech',
      tagline: 'Immersive VR classrooms making elite education globally accessible',
      location: 'Bangalore, India', flag: '🇮🇳', foundedYear: 2022, teamSize: 23, raised: '$3.7M',
      tags: ['VR/AR', 'Education', 'Accessibility', 'B2C'], upvoteCount: 692, viewCount: 15300,
      verified: true, isFeatured: false, isTrending: true,
      description: 'EduVerse lets students in any country attend live virtual classes taught by Ivy League educators in immersive, collaborative 3D environments.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'ChainPay', initials: 'CP', color: '#A78BFA', stage: 'Series A', category: 'FinTech',
      tagline: 'Instant cross-border B2B settlements via stablecoin rails',
      location: 'Dubai, UAE', flag: '🇦🇪', foundedYear: 2021, teamSize: 41, raised: '$12M',
      tags: ['Stablecoins', 'B2B Payments', 'Cross-Border', 'FinTech'], upvoteCount: 1567, viewCount: 41200,
      verified: true, isFeatured: true, isTrending: false,
      description: 'ChainPay enables real-time international B2B settlement at <0.1% cost through its proprietary stablecoin infrastructure. Processing $2.4B ARR.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'RoboFarm', initials: 'RF', color: '#22D3EE', stage: 'Seed', category: 'Deep Tech',
      tagline: 'Autonomous micro-robots increasing crop yield 40% with zero pesticides',
      location: 'Berlin, Germany', flag: '🇩🇪', foundedYear: 2022, teamSize: 19, raised: '$5.4M',
      tags: ['Robotics', 'AgriTech', 'Sustainability', 'Hardware'], upvoteCount: 781, viewCount: 18100,
      verified: true, isFeatured: false, isTrending: true,
      description: 'RoboFarm\'s swarms of matchbox-sized robots navigate crop rows with millimeter precision, applying targeted micro-doses and eliminating broad-spectrum pesticide use.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'ShopStack', initials: 'SS', color: '#F97316', stage: 'Series B', category: 'E-Commerce',
      tagline: 'AI-native commerce OS for D2C brands scaling to 9 figures',
      location: 'New York, USA', flag: '🇺🇸', foundedYear: 2020, teamSize: 87, raised: '$31M',
      tags: ['Commerce', 'AI', 'D2C', 'Shopify Alternative'], upvoteCount: 2103, viewCount: 67800,
      verified: true, isFeatured: true, isTrending: false,
      description: 'ShopStack replaces the Shopify + 20 apps setup with a single AI-powered commerce OS — from inventory to customer lifetime value optimization.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'DataWeave', initials: 'DW', color: '#818CF8', stage: 'Seed', category: 'SaaS & B2B',
      tagline: 'No-code data pipeline builder shipping analytics 10x faster',
      location: 'Toronto, Canada', flag: '🇨🇦', foundedYear: 2023, teamSize: 11, raised: '$1.8M',
      tags: ['No-Code', 'Data Engineering', 'Analytics', 'SaaS'], upvoteCount: 423, viewCount: 7600,
      verified: false, isFeatured: false, isTrending: true,
      description: 'DataWeave gives data teams a visual pipeline builder that auto-generates production-ready dbt, Airflow, and Spark code — no Python required.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Web3Vault', initials: 'W3', color: '#8B5CF6', stage: 'Seed', category: 'Web3',
      tagline: 'Enterprise-grade multi-chain custody for institutional crypto',
      location: 'Zurich, Switzerland', flag: '🇨🇭', foundedYear: 2023, teamSize: 14, raised: '$3.2M',
      tags: ['Web3', 'Blockchain', 'Security', 'Enterprise'], upvoteCount: 612, viewCount: 11200,
      verified: true, isFeatured: false, isTrending: false,
      description: 'Web3Vault provides SOC-2 compliant multi-sig custody across 14 blockchains, purpose-built for hedge funds, DAO treasuries, and neobanks entering digital assets.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'OceanGuard', initials: 'OG', color: '#0EA5E9', stage: 'Series A', category: 'CleanTech',
      tagline: 'Autonomous AI ocean trash removal fleets operating 24/7',
      location: 'Copenhagen, Denmark', flag: '🇩🇰', foundedYear: 2021, teamSize: 28, raised: '$9.5M',
      tags: ['Ocean Tech', 'Robotics', 'AI', 'Sustainability'], upvoteCount: 1876, viewCount: 34500,
      verified: true, isFeatured: true, isTrending: false,
      description: 'OceanGuard deploys solar-powered autonomous vessels that use computer vision to identify, collect, and sort marine plastic — scaling across 12 coastal cities.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'NexaLearn', initials: 'NL', color: '#F59E0B', stage: 'Pre-Seed', category: 'EdTech',
      tagline: 'AI tutor that personalizes STEM learning for every student',
      location: 'London, UK', flag: '🇬🇧', foundedYear: 2024, teamSize: 6, raised: '$850K',
      tags: ['Education', 'AI Tutor', 'STEM', 'Personalization'], upvoteCount: 298, viewCount: 5200,
      verified: true, isFeatured: false, isTrending: false,
      description: 'NexaLearn adapts math and science curricula in real-time based on student performance patterns — turning struggling learners into top performers within 8 weeks.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'PayFlow', initials: 'PF', color: '#10B981', stage: 'Series B', category: 'FinTech',
      tagline: 'Embedded payroll and compliance for global remote teams',
      location: 'Sydney, Australia', flag: '🇦🇺', foundedYear: 2020, teamSize: 64, raised: '$22M',
      tags: ['Payroll', 'Global Hiring', 'Compliance', 'FinTech'], upvoteCount: 2341, viewCount: 51200,
      verified: true, isFeatured: true, isTrending: false,
      description: 'PayFlow lets companies hire in 140+ countries without setting up local entities — handling payroll, tax, benefits, and equity in a single platform.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'NeuroFit', initials: 'NF', color: '#EF4444', stage: 'Seed', category: 'HealthTech',
      tagline: 'Brain-computer interface wearables for ADHD and focus',
      location: 'Boston, USA', flag: '🇺🇸', foundedYear: 2023, teamSize: 9, raised: '$2.1M',
      tags: ['Neurotech', 'Wearables', 'ADHD', 'BCI'], upvoteCount: 478, viewCount: 9800,
      verified: true, isFeatured: false, isTrending: false,
      description: 'NeuroFit builds EEG-enabled headbands that gamify attention training — clinically validated to improve focus scores by 40% in children and adults with ADHD.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'SonicGrid', initials: 'SG', color: '#EC4899', stage: 'Series A', category: 'Media',
      tagline: 'Generative audio engine for game studios and film composers',
      location: 'Stockholm, Sweden', flag: '🇸🇪', foundedYear: 2022, teamSize: 31, raised: '$7.8M',
      tags: ['Generative AI', 'Audio', 'Gaming', 'Creative Tools'], upvoteCount: 1045, viewCount: 22300,
      verified: true, isFeatured: false, isTrending: false,
      description: 'SonicGrid generates adaptive soundtracks, SFX, and voice lines on demand — trained on 500K+ hours of studio-grade audio, licensed for commercial use.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'DronePath', initials: 'DP', color: '#6366F1', stage: 'Series A', category: 'Deep Tech',
      tagline: 'Autonomous drone delivery network for last-mile logistics',
      location: 'São Paulo, Brazil', flag: '🇧🇷', foundedYear: 2021, teamSize: 47, raised: '$14M',
      tags: ['Drones', 'Logistics', 'Autonomy', 'Delivery'], upvoteCount: 1567, viewCount: 38900,
      verified: true, isFeatured: true, isTrending: false,
      description: 'DronePath operates a city-wide autonomous delivery network in Latin America — reducing last-mile costs by 70% and delivery time from hours to minutes.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'TerraCarbon', initials: 'TC', color: '#22C55E', stage: 'Seed', category: 'CleanTech',
      tagline: 'Satellite-verified carbon credit marketplace for reforestation',
      location: 'Nairobi, Kenya', flag: '🇰🇪', foundedYear: 2023, teamSize: 15, raised: '$4.1M',
      tags: ['Carbon Credits', 'Satellite', 'Reforestation', 'Climate'], upvoteCount: 823, viewCount: 16700,
      verified: true, isFeatured: false, isTrending: false,
      description: 'TerraCarbon uses satellite imagery and ML to verify reforestation projects — selling premium, auditable carbon credits to Fortune 500 sustainability programs.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'LegalBot', initials: 'LB', color: '#A855F7', stage: 'Pre-Seed', category: 'SaaS & B2B',
      tagline: 'AI legal assistant for startups — contracts, IP, and compliance',
      location: 'Berlin, Germany', flag: '🇩🇪', foundedYear: 2024, teamSize: 7, raised: '$1.1M',
      tags: ['Legal Tech', 'AI', 'Contracts', 'Startups'], upvoteCount: 389, viewCount: 7400,
      verified: true, isFeatured: false, isTrending: false,
      description: 'LegalBot drafts, reviews, and negotiates startup contracts in 90+ jurisdictions — from SAFE agreements to GDPR compliance, at 10% of traditional legal costs.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'ByteBazaar', initials: 'BB', color: '#F97316', stage: 'Series B', category: 'E-Commerce',
      tagline: 'Social commerce platform for creators selling digital products',
      location: 'Seoul, South Korea', flag: '🇰🇷', foundedYear: 2020, teamSize: 72, raised: '$28M',
      tags: ['Social Commerce', 'Creator Economy', 'Digital Goods', 'Asia'], upvoteCount: 3102, viewCount: 72100,
      verified: true, isFeatured: true, isTrending: false,
      description: 'ByteBazaar lets creators sell templates, courses, and digital art directly to fans — with built-in social discovery, live drops, and instant payouts.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4b994e?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'MindWell', initials: 'MW', color: '#06B6D4', stage: 'Seed', category: 'HealthTech',
      tagline: 'VR therapy platform for anxiety and PTSD treatment at home',
      location: 'Amsterdam, Netherlands', flag: '🇳🇱', foundedYear: 2023, teamSize: 10, raised: '$1.9M',
      tags: ['VR Therapy', 'Mental Health', 'Telemedicine', 'Wellness'], upvoteCount: 645, viewCount: 13400,
      verified: true, isFeatured: false, isTrending: false,
      description: 'MindWell combines clinically-validated exposure therapy protocols with immersive VR — enabling patients to receive treatment from home with real-time therapist guidance.',
      websiteUrl: '#', socialLinkedin: '#', socialTwitter: '#',
      coverImageUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const createdStartups = {};
  for (const s of startups) {
    s.slug = s.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    s.userId = userId;
    const created = await Startup.create(s);
    createdStartups[s.name] = created._id;
  }
  console.log('Startups seeded');

  const hackathons = [
    {
      title: 'AI for Healthcare Global Hackathon 2025', startupName: 'MediLens', color: '#FB7185', initials: 'ML',
      prizePool: '$50,000', spots: 2340, maxSpots: 5000, deadline: 'Jun 15, 2025', status: 'open',
      tags: ['AI', 'Healthcare', 'Open Source'], duration: '72 hours',
      description: 'Build AI solutions that improve healthcare access in underserved communities. Winners get mentorship + fast-track to MediLens partnership.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'CleanTech Innovation Challenge', startupName: 'GreenVolt', color: '#34D399', initials: 'GV',
      prizePool: '$30,000', spots: 1890, maxSpots: 3000, deadline: 'Jul 1, 2025', status: 'open',
      tags: ['CleanEnergy', 'Climate', 'Hardware'], duration: '7 days',
      description: 'Design novel energy distribution solutions for off-grid communities in Sub-Saharan Africa. Hardware and software submissions welcome.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1509391363532-84c7b8f4a1b8?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'FinTech Frontier Buildathon', startupName: 'ChainPay', color: '#A78BFA', initials: 'CP',
      prizePool: '$75,000', spots: 3100, maxSpots: 3500, deadline: 'Jun 28, 2025', status: 'open',
      tags: ['Blockchain', 'Payments', 'DeFi'], duration: '48 hours',
      description: 'Build the next generation of cross-border payment infrastructure. Top teams get seed investment consideration from ChainPay\'s VC network.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Enterprise AI Automation Sprint', startupName: 'NeuralPath AI', color: '#7C6EFA', initials: 'NP',
      prizePool: '$100,000', spots: 890, maxSpots: 2000, deadline: 'Aug 10, 2025', status: 'upcoming',
      tags: ['AI Agents', 'Enterprise', 'Automation'], duration: '5 days',
      description: 'Create autonomous AI agents that solve real enterprise bottlenecks. Grand prize winner joins NeuralPath as a founding team member.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'EdVerse Metaverse Build Sprint', startupName: 'EduVerse', color: '#FCD34D', initials: 'EV',
      prizePool: '$40,000', spots: 1560, maxSpots: 3000, deadline: 'Sep 5, 2025', status: 'open',
      tags: ['VR/AR', 'Education', 'Gaming'], duration: '96 hours',
      description: 'Build immersive educational experiences in VR/AR. Top projects get deployed in EduVerse classrooms with 50K+ active students.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'RoboFarm AgriTech Robotics Sprint', startupName: 'RoboFarm', color: '#22D3EE', initials: 'RF',
      prizePool: '$25,000', spots: 1200, maxSpots: 2500, deadline: 'Jul 20, 2025', status: 'open',
      tags: ['Robotics', 'AgriTech', 'Computer Vision'], duration: '48 hours',
      description: 'Design micro-robot swarms for precision agriculture. Grand prize includes pilot deployment on partner farms across Germany.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'ShopStack Commerce AI Hack', startupName: 'ShopStack', color: '#F97316', initials: 'SS',
      prizePool: '$60,000', spots: 2800, maxSpots: 4000, deadline: 'Aug 1, 2025', status: 'open',
      tags: ['E-Commerce', 'AI', 'Personalization'], duration: '72 hours',
      description: 'Build AI-powered storefront experiences that convert 2x better. Winning teams get ShopStack partner program access.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'DataWeave Analytics Pipeline Challenge', startupName: 'DataWeave', color: '#818CF8', initials: 'DW',
      prizePool: '$35,000', spots: 980, maxSpots: 2000, deadline: 'Jul 15, 2025', status: 'upcoming',
      tags: ['Data Engineering', 'No-Code', 'Analytics'], duration: '5 days',
      description: 'Create zero-code data pipelines that process 1M+ rows in under 10 seconds. Winners join DataWeave engineering team.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Web3Vault DeFi Security Bounty', startupName: 'Web3Vault', color: '#8B5CF6', initials: 'W3',
      prizePool: '$80,000', spots: 1500, maxSpots: 2000, deadline: 'Aug 25, 2025', status: 'open',
      tags: ['Web3', 'Security', 'Smart Contracts'], duration: '7 days',
      description: 'Find critical vulnerabilities in multi-chain custody protocols. Top auditors get recurring bounty contracts with Web3Vault.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'OceanGuard Marine AI Challenge', startupName: 'OceanGuard', color: '#0EA5E9', initials: 'OG',
      prizePool: '$45,000', spots: 2100, maxSpots: 3500, deadline: 'Sep 10, 2025', status: 'upcoming',
      tags: ['Ocean Tech', 'AI', 'Sustainability'], duration: '96 hours',
      description: 'Train computer vision models to identify plastic waste from drone footage. Winning models deployed on OceanGuard fleet.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'NexaLearn STEM Learning Games', startupName: 'NexaLearn', color: '#F59E0B', initials: 'NL',
      prizePool: '$20,000', spots: 3400, maxSpots: 5000, deadline: 'Jul 30, 2025', status: 'open',
      tags: ['EdTech', 'Gaming', 'Adaptive Learning'], duration: '48 hours',
      description: 'Build adaptive math games that personalize difficulty in real-time. Top entries integrated into NexaLearn platform.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'PayFlow Global Payroll API Sprint', startupName: 'PayFlow', color: '#10B981', initials: 'PF',
      prizePool: '$55,000', spots: 1800, maxSpots: 3000, deadline: 'Aug 15, 2025', status: 'open',
      tags: ['FinTech', 'API', 'Global Hiring'], duration: '72 hours',
      description: 'Build compliant payroll APIs for 140+ countries. Winners get fast-track to PayFlow integration partner status.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'NeuroFit BCI Developer Challenge', startupName: 'NeuroFit', color: '#EF4444', initials: 'NF',
      prizePool: '$30,000', spots: 800, maxSpots: 1500, deadline: 'Sep 20, 2025', status: 'upcoming',
      tags: ['Neurotech', 'Wearables', 'Health AI'], duration: '5 days',
      description: 'Develop attention-training games using EEG signal processing. Finalists receive NeuroFit dev kit and equity offer.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'SonicGrid Generative Audio Jam', startupName: 'SonicGrid', color: '#EC4899', initials: 'SG',
      prizePool: '$22,000', spots: 1600, maxSpots: 2500, deadline: 'Jul 10, 2025', status: 'open',
      tags: ['Generative AI', 'Audio', 'Creative Tools'], duration: '48 hours',
      description: 'Create AI-generated adaptive soundtracks for indie games. Winners get SonicGrid licensing deal + $5K advance.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'DronePath Autonomy Algorithm Cup', startupName: 'DronePath', color: '#6366F1', initials: 'DP',
      prizePool: '$70,000', spots: 900, maxSpots: 1500, deadline: 'Aug 30, 2025', status: 'open',
      tags: ['Drones', 'Autonomy', 'Computer Vision'], duration: '7 days',
      description: 'Build collision-avoidance algorithms for urban drone delivery. Winning team gets pilot program in São Paulo.',
      isTrending: true,
      coverImageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'TerraCarbon Reforestation AI Challenge', startupName: 'TerraCarbon', color: '#22C55E', initials: 'TC',
      prizePool: '$38,000', spots: 1300, maxSpots: 2500, deadline: 'Sep 1, 2025', status: 'upcoming',
      tags: ['Climate', 'Satellite', 'ML'], duration: '72 hours',
      description: 'Train ML models to detect deforestation from satellite imagery. Winners join TerraCarbon research lab in Nairobi.',
      isTrending: false,
      coverImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    },
  ];
  for (const h of hackathons) {
    h.startupId = createdStartups[h.startupName];
  }
  await Hackathon.insertMany(hackathons);
  console.log('Hackathons seeded');

  const opportunities = [
    { type: 'Internship', title: 'ML Research Intern', company: 'NeuralPath AI', color: '#7C6EFA', initials: 'NP', location: 'Remote / SF', compensation: '$3,200/mo', duration: '3 months', tags: ['Python', 'PyTorch', 'LLMs'], posted: '2d ago', applicants: 47 },
    { type: 'Full-Time', title: 'Frontend Engineer (React)', company: 'GreenVolt', color: '#34D399', initials: 'GV', location: 'Lagos, Nigeria (Hybrid)', compensation: '$60K–$80K', duration: 'Permanent', tags: ['React', 'TypeScript', 'Mobile'], posted: '1d ago', applicants: 89 },
    { type: 'Internship', title: 'Business Development Intern', company: 'ChainPay', color: '#A78BFA', initials: 'CP', location: 'Dubai, UAE', compensation: '$2,500/mo', duration: '6 months', tags: ['B2B Sales', 'FinTech', 'Growth'], posted: '3d ago', applicants: 134 },
    { type: 'Full-Time', title: 'Product Designer', company: 'EduVerse', color: '#FCD34D', initials: 'EV', location: 'Bangalore (Remote OK)', compensation: '₹18–28 LPA', duration: 'Permanent', tags: ['Figma', 'UX', 'VR/AR'], posted: '5d ago', applicants: 62 },
    { type: 'Contract', title: 'DevOps / Cloud Engineer', company: 'ShopStack', color: '#F97316', initials: 'SS', location: 'Remote', compensation: '$120–150/hr', duration: '6 months', tags: ['AWS', 'K8s', 'Terraform'], posted: '1d ago', applicants: 28 },
    { type: 'Internship', title: 'Data Science Intern', company: 'DataWeave', color: '#818CF8', initials: 'DW', location: 'Toronto / Remote', compensation: '$2,800/mo', duration: '4 months', tags: ['Python', 'SQL', 'dbt'], posted: '4d ago', applicants: 71 },
  ];
  for (const o of opportunities) {
    o.startupId = createdStartups[o.company];
  }
  await Opportunity.insertMany(opportunities);
  console.log('Opportunities seeded');

  const categories = [
    { name: 'All', slug: 'all', icon: '◈', count: 1840, sortOrder: 0 },
    { name: 'AI & ML', slug: 'ai', icon: '⟁', count: 342, sortOrder: 1 },
    { name: 'FinTech', slug: 'fintech', icon: '◈', count: 218, sortOrder: 2 },
    { name: 'HealthTech', slug: 'health', icon: '⊕', count: 189, sortOrder: 3 },
    { name: 'EdTech', slug: 'edtech', icon: '◉', count: 156, sortOrder: 4 },
    { name: 'SaaS & B2B', slug: 'saas', icon: '⬡', count: 203, sortOrder: 5 },
    { name: 'CleanTech', slug: 'clean', icon: '✦', count: 94, sortOrder: 6 },
    { name: 'Web3', slug: 'web3', icon: '⛬', count: 131, sortOrder: 7 },
    { name: 'E-Commerce', slug: 'ecom', icon: '⟐', count: 167, sortOrder: 8 },
    { name: 'Deep Tech', slug: 'deep', icon: '⊗', count: 78, sortOrder: 9 },
    { name: 'Media', slug: 'media', icon: '▷', count: 112, sortOrder: 10 },
  ];
  await Category.insertMany(categories);
  console.log('Categories seeded');

  console.log('✅ Done! Database seeded successfully.');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
