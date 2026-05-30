import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Student from '../models/Student.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

router.post('/register', async (req, res, next) => {
  try {
    const { email, password, role, name, university, degree, major, graduationYear, country, bio, skills, githubUrl, linkedinUrl, portfolioUrl, isOpenToWork } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, role: role || 'student' });

    if (role === 'startup_admin' || role === 'startup_member') {
      const slug = name?.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now().toString(36);
      await Startup.create({ userId: user._id, slug, name: name || '', initials: name?.slice(0,2).toUpperCase() || 'ST' });
    } else {
      await Student.create({ userId: user._id, fullName: name || '', university: university || '', degree: degree || '', major: major || '', graduationYear, country: country || '', bio: bio || '', skills: skills || [], githubUrl: githubUrl || '', linkedinUrl: linkedinUrl || '', portfolioUrl: portfolioUrl || '', isOpenToWork: isOpenToWork || false });
    }

    res.status(201).json({ token: generateToken(user._id), user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    user.lastLoginAt = new Date();
    await user.save();
    res.json({ token: generateToken(user._id), user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
