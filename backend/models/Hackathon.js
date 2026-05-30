import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema({
  startupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Startup' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  bannerUrl: { type: String, default: '' },
  prizePool: { type: String, default: '' },
  prizeBreakdown: { type: mongoose.Schema.Types.Mixed },
  maxParticipants: { type: Number, default: 1000 },
  teamSizeMin: { type: Number, default: 1 },
  teamSizeMax: { type: Number, default: 5 },
  startDate: { type: Date },
  endDate: { type: Date },
  registrationDeadline: { type: Date },
  status: { type: String, enum: ['draft', 'upcoming', 'open', 'in_progress', 'judging', 'completed', 'cancelled'], default: 'upcoming' },
  isTrending: { type: Boolean, default: false },
  coverImageUrl: { type: String, default: '' },
  submissionFormat: { type: String, default: '' },
  judgingCriteria: { type: mongoose.Schema.Types.Mixed },
  tags: [{ type: String }],
  duration: { type: String, default: '' },
  startupName: { type: String, default: '' },
  color: { type: String, default: '#7C6EFA' },
  initials: { type: String, default: '' },
  deadline: { type: String, default: '' },
  spots: { type: Number, default: 0 },
  maxSpots: { type: Number, default: 100 },
}, { timestamps: true });

export default mongoose.model('Hackathon', hackathonSchema);
