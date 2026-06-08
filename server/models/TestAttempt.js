import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MockTest',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  timeTakenSeconds: {
    type: Number,
    default: 0
  },
  answers: {
    // Map of question index to selected option index
    type: Map,
    of: Number
  }
}, { timestamps: true });

export default mongoose.model('TestAttempt', testAttemptSchema);
