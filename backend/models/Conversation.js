import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'startup_student', 'group'], default: 'direct' },
  title: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);
