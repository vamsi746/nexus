import mongoose from 'mongoose';

const hackathonRegistrationSchema = new mongoose.Schema({
  hackathonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hackathon', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup', required: true },
}, { timestamps: true });

export default mongoose.model('HackathonRegistration', hackathonRegistrationSchema);
