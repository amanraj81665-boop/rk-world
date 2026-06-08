import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderRole: {
    type: String,
    required: true,
    enum: ['student', 'admin', 'teacher']
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
