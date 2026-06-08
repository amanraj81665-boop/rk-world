import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import DashboardData from './models/DashboardData.js';
import UserProfile from './models/UserProfile.js';

dotenv.config();

const zeroData = async () => {
  try {
    await connectDB();

    // 1. Zero Dashboard Data
    await DashboardData.updateMany({}, {
      $set: {
        'userStats.attendance': 0,
        'userStats.testsCompleted': 0,
        'userStats.hoursLearned': 0,
        'gamification.streak': 0,
        'gamification.xp': 0,
        'gamification.level': 'Beginner',
      }
    });

    // 2. Zero User Profile progress if applicable
    await UserProfile.updateMany({}, {
      $set: {
        xp: 0,
        level: 'Beginner',
        testsTaken: 0,
        hoursLearned: 0
      }
    });

    console.log('✅ Successfully reset all user stats and gamification data to ZERO!');
    process.exit();
  } catch (error) {
    console.error('Error zeroing data:', error);
    process.exit(1);
  }
};

zeroData();
