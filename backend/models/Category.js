import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, default: '◈' },
  description: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  subs: [{
    name: { type: String },
    tags: [{ type: String }],
  }],
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
