import express from 'express';
import Hackathon from '../models/Hackathon.js';
import Student from '../models/Student.js';
import HackathonRegistration from '../models/HackathonRegistration.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (err) { next(err); }
});

router.get('/trending', async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find({ isTrending: true }).limit(5);
    res.json(hackathons);
  } catch (err) { next(err); }
});

// ─── GET REGISTERED HACKATHONS FOR STUDENT ───
router.get('/registered', protect, async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const registrations = await HackathonRegistration.find({ studentId: student._id })
      .populate('hackathonId')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Not found' });
    res.json(hackathon);
  } catch (err) { next(err); }
});

router.post('/', protect, async (req, res, next) => {
  try {
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json(hackathon);
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hackathon);
  } catch (err) { next(err); }
});

// ─── DYNAMIC HACKATHON REGISTRATION ───
router.post('/:id/register', protect, async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });

    // Locate the student profile
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(403).json({ message: 'Only Student accounts can participate in hackathons.' });

    // Check duplicate registration
    const duplicate = await HackathonRegistration.findOne({
      hackathonId: hackathon._id,
      studentId: student._id
    });
    if (duplicate) {
      return res.status(400).json({ message: 'You are already registered for this hackathon.' });
    }

    // Create the registration
    const registration = await HackathonRegistration.create({
      hackathonId: hackathon._id,
      studentId: student._id,
      startupId: hackathon.startupId
    });

    hackathon.spots += 1;
    await hackathon.save();

    res.json({ message: 'Registered successfully!', hackathon, registration });
  } catch (err) { next(err); }
});

export default router;
