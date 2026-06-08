import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import LeaderboardEntry from './models/LeaderboardEntry.js';

dotenv.config();

const fixData = async () => {
  try {
    await connectDB();
    
    // Remove the current user from leaderboard so they start fresh
    await LeaderboardEntry.deleteOne({ isCurrentUser: true });
    
    // Fix ranks for the remaining ones
    const entries = await LeaderboardEntry.find().sort({ score: -1 });
    for (let i = 0; i < entries.length; i++) {
      entries[i].rank = i + 1;
      
      // Also add some variety to the trendValue and percentile
      entries[i].percentile = i + 1;
      entries[i].trendValue = (Math.random() * 2 + 0.5).toFixed(1);
      
      await entries[i].save();
    }
    
    console.log('Leaderboard fixed for new user');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixData();
