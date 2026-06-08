import mongoose from 'mongoose';

const doubtSchema = new mongoose.Schema({
  subject: String,
  text: String,
  likes: Number,
  isSolved: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Doubt', doubtSchema);
