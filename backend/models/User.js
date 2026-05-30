import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ['startup_admin', 'startup_member', 'student', 'admin', 'service_provider'], default: 'student' },
  avatarUrl: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  authProvider: { type: String, enum: ['email', 'google', 'linkedin', 'github'], default: 'email' },
  lastLoginAt: { type: Date },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
