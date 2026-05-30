import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
  userEmail: { type: String, required: true },
  userRole: { type: String, default: 'Student' },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);
