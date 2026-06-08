import express from 'express';
import LeaderboardEntry from '../models/LeaderboardEntry.js';
import UserProfile from '../models/UserProfile.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await UserProfile.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up dummy leaderboard data
    await LeaderboardEntry.deleteMany({});
    
    let leaderboard = await LeaderboardEntry.find().sort({ rank: 1 });
    
    // Determine mock accuracy. If they haven't taken a test, it's 0.
    const accuracy = user.testsCompleted > 0 ? 87.5 : 0; 
    
    res.json({
      stats: {
        accuracy: accuracy,
        testsAttempted: user.testsCompleted || 0,
        hoursLearned: user.hoursLearned || 0,
        performance: user.testsCompleted > 0 ? [40, 55, 45, 70, 65, 80, 95] : [0, 0, 0, 0, 0, 0, 0]
      },
      leaderboard: leaderboard
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
