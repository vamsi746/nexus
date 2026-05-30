import express from 'express';
import Startup from '../models/Startup.js';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ userId: req.user._id });
    if (!startup) return res.status(404).json({ message: 'Startup profile not found' });
    res.json(startup);
  } catch (err) { next(err); }
});

router.put('/me', protect, async (req, res, next) => {
  try {
    let startup = await Startup.findOne({ userId: req.user._id });
    if (!startup) {
      const slug = 'company-' + Date.now().toString(36);
      startup = new Startup({ userId: req.user._id, slug });
    }
    Object.assign(startup, req.body);
    await startup.save();
    res.json(startup);
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const { stage, category, search, sort = '-upvoteCount' } = req.query;
    const filter = {};
    if (stage && stage !== 'All') filter.stage = stage;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    const startups = await Startup.find(filter).sort(sort);
    res.json(startups);
  } catch (err) { next(err); }
});

router.get('/featured', async (req, res, next) => {
  try {
    const startups = await Startup.find({ isFeatured: true }).limit(6);
    res.json(startups);
  } catch (err) { next(err); }
});

router.get('/trending', async (req, res, next) => {
  try {
    const startups = await Startup.find({ isTrending: true }).limit(8);
    res.json(startups);
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const startup = await Startup.findOne({ slug: req.params.slug });
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    startup.viewCount += 1;
    await startup.save();
    res.json(startup);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const data = { ...req.body, userId: req.user._id };
    const startup = await Startup.create(data);
    res.status(201).json(startup);
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Not found' });
    if (startup.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(startup, req.body);
    await startup.save();
    res.json(startup);
  } catch (err) { next(err); }
});

router.post('/:id/upvote', protect, async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Not found' });
    startup.upvoteCount += 1;
    await startup.save();
    res.json(startup);
  } catch (err) { next(err); }
});

// ─── STARTUP DISCUSSION COMMENTS ───
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ startupId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { next(err); }
});

router.post('/:id/comments', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Comment content required' });

    const comment = await Comment.create({
      startupId: req.params.id,
      userEmail: req.user.email,
      userRole: req.user.role === 'startup_admin' ? 'Founder' : req.user.role === 'admin' ? 'Admin' : 'Student',
      content
    });
    res.status(201).json(comment);
  } catch (err) { next(err); }
});

export default router;
