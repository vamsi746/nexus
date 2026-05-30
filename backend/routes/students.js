import express from 'express';
import Student from '../models/Student.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', protect, async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) { next(err); }
});

router.put('/me', protect, async (req, res, next) => {
  try {
    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      student = new Student({ userId: req.user._id });
    }
    Object.assign(student, req.body);
    await student.save();
    res.json(student);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) { next(err); }
});

router.put('/:id', protect, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    if (student.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(student, req.body);
    await student.save();
    res.json(student);
  } catch (err) { next(err); }
});

router.get('/:id/skills', async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json({ skills: student?.skills || [] });
  } catch (err) { next(err); }
});

router.post('/:id/skills', protect, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Not found' });
    student.skills = req.body.skills || [];
    await student.save();
    res.json(student);
  } catch (err) { next(err); }
});

export default router;
