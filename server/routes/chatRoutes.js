import express from 'express';
import Message from '../models/Message.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/chat
// @desc    Get last 50 chat messages
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    // Return in chronological order
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch messages.' });
  }
});

export default router;
