import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  title: String,
  duration: String,
  completed: Boolean,
  active: Boolean
});

const courseSchema = new mongoose.Schema({
  title: String,
  module: String,
  teacher: String,
  isActive: Boolean,
  chapters: [chapterSchema],
  progress: Number,
  price: { type: Number, default: 0 },
  thumbnail: String
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
