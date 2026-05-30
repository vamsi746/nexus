import express from 'express';
import Category from '../models/Category.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 });
    res.json(categories);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) { next(err); }
});

export default router;
