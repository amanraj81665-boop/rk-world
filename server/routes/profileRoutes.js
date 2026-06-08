import express from 'express';
import UserProfile from '../models/UserProfile.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.user._id);
    if (!profile) return res.status(404).json({ message: 'User not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/image', protect, async (req, res) => {
  try {
    const { profileImage } = req.body;
    const user = await UserProfile.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profileImage = profileImage;
    await user.save();

    res.json({ message: 'Profile image updated successfully', profileImage: user.profileImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/claim-reward', protect, async (req, res) => {
  try {
    const user = await UserProfile.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (user.lastClaimedReward) {
      const lastClaimed = new Date(user.lastClaimedReward);
      lastClaimed.setHours(0, 0, 0, 0);

      if (lastClaimed.getTime() === today.getTime()) {
        return res.status(400).json({ message: 'Already claimed today. Come back tomorrow!' });
      }
    }

    user.xp += 50;
    user.lastClaimedReward = new Date();
    await user.save();

    res.json({ message: 'Reward claimed successfully!', xp: user.xp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
