import express from 'express';
import ServiceOrder from '../models/ServiceOrder.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  res.json([
    { id: 1, name: 'Brand & Identity', icon: 'Sparkles', color: '#FCD34D', desc: 'Logo, brand guidelines, pitch decks, and full visual identity by our global creative team.', items: ['Logo & Brand Kit', 'Pitch Deck Design', 'Social Media Kit', 'Brand Strategy'], price: 'From $499', badge: 'Most Popular' },
    { id: 2, name: 'Digital Marketing', icon: 'Diamond', color: '#7C6EFA', desc: 'Full-funnel digital marketing: SEO, paid ads, content strategy, and social media management.', items: ['SEO & SEM', 'Paid Ads (Meta/Google)', 'Content Marketing', 'Performance Analytics'], price: 'From $799/mo', badge: '' },
    { id: 3, name: 'Software Development', icon: 'Code', color: '#22D3EE', desc: 'Dedicated engineering teams for MVP builds, scaling infrastructure, and product iteration.', items: ['MVP Development', 'Full-Stack Teams', 'DevOps & Cloud', 'QA & Testing'], price: 'From $150/hr', badge: 'Top Rated' },
    { id: 4, name: 'HR & Global Talent', icon: 'Users', color: '#34D399', desc: 'End-to-end HR: talent acquisition, onboarding, payroll, and global employer-of-record services.', items: ['Global Recruitment', 'EOR Services', 'Payroll Management', 'HR Compliance'], price: 'From $299/mo', badge: '' },
    { id: 5, name: 'Legal & Compliance', icon: 'Scale', color: '#FB7185', desc: 'Startup-friendly legal support covering incorporation, IP, contracts, and regulatory compliance.', items: ['Incorporation', 'IP Protection', 'Contract Review', 'Regulatory Advice'], price: 'From $199', badge: '' },
    { id: 6, name: 'IT Infrastructure', icon: 'Hexagon', color: '#A78BFA', desc: 'Managed IT: cloud architecture, cybersecurity, DevOps automation, and 24/7 technical support.', items: ['Cloud Architecture', 'Cybersecurity', 'DevOps Setup', '24/7 Support'], price: 'From $499/mo', badge: '' },
  ]);
});

router.post('/inquire', protect, async (req, res, next) => {
  try {
    const order = await ServiceOrder.create(req.body);
    res.status(201).json(order);
  } catch (err) { next(err); }
});

export default router;
