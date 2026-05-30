import mongoose from 'mongoose';

const serviceOrderSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  serviceType: { type: String, enum: ['branding', 'digital_marketing', 'software_dev', 'hr', 'legal', 'it_infra', 'other'], default: 'other' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  status: { type: String, enum: ['inquiry', 'quoted', 'in_progress', 'review', 'completed', 'cancelled'], default: 'inquiry' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('ServiceOrder', serviceOrderSchema);
