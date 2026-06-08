import mongoose from 'mongoose';

const liveClassSchema = new mongoose.Schema({
  title: String,
  subject: String,
  teacher: String,
  viewers: Number,
  isLive: Boolean,
  chatMessages: [
    {
      id: Number,
      sender: String,
      text: String,
      isTeacher: Boolean
    }
  ]
});

export default mongoose.model('LiveClass', liveClassSchema);
