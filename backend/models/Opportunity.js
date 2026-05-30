import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  type: { type: String, enum: ['Internship', 'Full-Time', 'Part-Time', 'Contract', 'Volunteer'], required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  requirements: [{ type: String }],
  skills: [{ type: String }],
  location: { type: String, default: '' },
  isRemote: { type: Boolean, default: false },
  compensation: { type: String, default: '' },
  duration: { type: String, default: '' },
  openings: { type: Number, default: 1 },
  deadline: { type: Date },
  status: { type: String, enum: ['active', 'paused', 'closed', 'filled'], default: 'active' },
  company: { type: String, default: '' },
  color: { type: String, default: '#7C6EFA' },
  initials: { type: String, default: '' },
  posted: { type: String, default: '' },
  applicants: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Opportunity', opportunitySchema);
