import mongoose from 'mongoose';

const opportunityApplicationSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  status: { type: String, enum: ['pending', 'interviewing', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('OpportunityApplication', opportunityApplicationSchema);
