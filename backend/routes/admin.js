import express from 'express';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Student from '../models/Student.js';
import ServiceOrder from '../models/ServiceOrder.js';
import Hackathon from '../models/Hackathon.js';
import Opportunity from '../models/Opportunity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper middleware for role protection
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

// ─── ADMIN & ACC MANAGER STATS ───
router.get('/stats', protect, authorize('admin', 'service_provider'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStartups = await Startup.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalHackathons = await Hackathon.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    
    // Service orders & payments stats
    const totalOrders = await ServiceOrder.countDocuments();
    const pendingOrders = await ServiceOrder.countDocuments({ status: 'inquiry' });
    const ordersResult = await ServiceOrder.aggregate([
      { $group: { _id: null, totalBudget: { $sum: '$budget' } } }
    ]);
    const totalRevenue = ordersResult[0]?.totalBudget || 0;

    res.json({
      users: totalUsers,
      startups: totalStartups,
      students: totalStudents,
      hackathons: totalHackathons,
      opportunities: totalOpportunities,
      orders: totalOrders,
      pendingOrders,
      revenue: totalRevenue
    });
  } catch (err) { next(err); }
});

// ─── STARTUP MANAGEMENT (ADMIN ONLY) ───
router.get('/startups', protect, authorize('admin'), async (req, res, next) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });
    res.json(startups);
  } catch (err) { next(err); }
});

router.put('/startups/:id/verify', protect, authorize('admin'), async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    
    startup.verified = !startup.verified;
    await startup.save();
    res.json({ message: `Startup ${startup.verified ? 'verified' : 'unverified'} successfully`, startup });
  } catch (err) { next(err); }
});

router.put('/startups/:id/trending', protect, authorize('admin'), async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    startup.isTrending = !startup.isTrending;
    await startup.save();
    res.json({ message: `Startup ${startup.isTrending ? 'added to' : 'removed from'} trending`, startup });
  } catch (err) { next(err); }
});

router.delete('/startups/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });

    // Optionally delete the associated user
    if (startup.userId) {
      await User.findByIdAndDelete(startup.userId);
    }
    await Startup.findByIdAndDelete(req.params.id);
    res.json({ message: 'Startup and its associated owner account deleted successfully' });
  } catch (err) { next(err); }
});

// ─── STUDENT MANAGEMENT (ADMIN ONLY) ───
router.get('/students', protect, authorize('admin'), async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (err) { next(err); }
});

router.delete('/students/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Delete associated User
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student and their account deleted successfully' });
  } catch (err) { next(err); }
});

// ─── SERVICE ORDERS & PAYMENTS (ADMIN & ACC MANAGER) ───
router.get('/orders', protect, authorize('admin', 'service_provider'), async (req, res, next) => {
  try {
    const orders = await ServiceOrder.find().populate('startupId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { next(err); }
});

router.put('/orders/:id', protect, authorize('admin', 'service_provider'), async (req, res, next) => {
  try {
    const { status, budget, title, description } = req.body;
    const order = await ServiceOrder.findById(req.params.id).populate('startupId');
    if (!order) return res.status(404).json({ message: 'Service order not found' });

    if (status !== undefined) order.status = status;
    if (budget !== undefined) order.budget = budget;
    if (title !== undefined) order.title = title;
    if (description !== undefined) order.description = description;

    await order.save();
    res.json({ message: 'Service order updated successfully', order });
  } catch (err) { next(err); }
});

// ─── HACKATHON MANAGEMENT (ADMIN ONLY) ───
router.get('/hackathons', protect, authorize('admin'), async (req, res, next) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    res.json(hackathons);
  } catch (err) { next(err); }
});

router.put('/hackathons/:id/trending', protect, authorize('admin'), async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    hackathon.isTrending = !hackathon.isTrending;
    await hackathon.save();
    res.json({ message: `Hackathon ${hackathon.isTrending ? 'added to' : 'removed from'} trending`, hackathon });
  } catch (err) { next(err); }
});

router.delete('/hackathons/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    await Hackathon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hackathon deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
