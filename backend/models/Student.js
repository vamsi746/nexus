import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, default: '' },
  avatarUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  university: { type: String, default: '' },
  degree: { type: String, default: '' },
  major: { type: String, default: '' },
  graduationYear: { type: Number },
  country: { type: String, default: '' },
  skills: [{ type: String }],
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
  isOpenToWork: { type: Boolean, default: false },
  preferredRoles: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
