import mongoose from 'mongoose';

const leaderboardEntrySchema = new mongoose.Schema({
  rank: Number,
  name: String,
  score: Number,
  trend: String, // up, down, same
  isCurrentUser: { type: Boolean, default: false }
});

export default mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
