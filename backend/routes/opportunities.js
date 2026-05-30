import express from 'express';
import Opportunity from '../models/Opportunity.js';
import Student from '../models/Student.js';
import OpportunityApplication from '../models/OpportunityApplication.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = {};
    if (type && type !== 'All') filter.type = type;
    const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (err) { next(err); }
});

// ─── GET APPLIED OPPORTUNITIES FOR STUDENT ───
router.get('/applied', protect, async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const applications = await OpportunityApplication.find({ studentId: student._id })
      .populate('opportunityId')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) { next(err); }
});

// ─── GET INCOMING APPLICANTS FOR STARTUP FOUNDER ───
router.get('/applicants', protect, async (req, res, next) => {
  try {
    // Find applications where startupId is owned by this user
    const student = await Student.findOne({ userId: req.user._id });
    // If user is a startup founder, let's locate their startup
    // (We will let the client query or search by startupId or grab the owner's startupId)
    res.json([]);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Not found' });
    res.json(opp);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const opp = await Opportunity.create(req.body);
    res.status(201).json(opp);
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const opp = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(opp);
  } catch (err) { next(err); }
});

// ─── DYNAMIC APPLY & LINK ───
router.post('/:id/apply', protect, async (req, res, next) => {
  try {
    const opp = await Opportunity.findById(req.params.id);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' });

    // Locate the student profile
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(403).json({ message: 'Only registered Student accounts can apply for opportunities.' });

    // Check duplicate application
    const duplicate = await OpportunityApplication.findOne({
      opportunityId: opp._id,
      studentId: student._id
    });
    if (duplicate) {
      return res.status(400).json({ message: 'You have already applied for this opportunity listing.' });
    }

    // Create the application linking student & startup
    const application = await OpportunityApplication.create({
      opportunityId: opp._id,
      studentId: student._id,
      startupId: opp.startupId
    });

    opp.applicants += 1;
    await opp.save();

    res.json({ message: 'Applied successfully!', opportunity: opp, application });
  } catch (err) { next(err); }
});

export default router;
