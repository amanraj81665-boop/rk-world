import mongoose from 'mongoose';

const mockTestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  durationSeconds: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  subjects: { type: String, required: true },
  questions: [{
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
    positiveMarks: { type: Number, default: 4 },
    negativeMarks: { type: Number, default: 1 }
  }]
}, { timestamps: true });

export default mongoose.model('MockTest', mockTestSchema);
