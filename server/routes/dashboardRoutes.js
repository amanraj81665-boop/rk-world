import express from 'express';
import UserProfile from '../models/UserProfile.js';
import Course from '../models/Course.js';
import LiveClass from '../models/LiveClass.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const user = await UserProfile.findById(req.user._id).populate('enrolledCourses');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Level calculation logic based on XP
    let level = 'Beginner';
    if (user.xp > 1000) level = 'Bronze Scholar';
    if (user.xp > 3000) level = 'Silver Scholar';
    if (user.xp > 5000) level = 'Gold Scholar';
    if (user.xp > 10000) level = 'Diamond Scholar';

    // Fetch all available courses that the user is NOT enrolled in
    const enrolledCourseIds = user.enrolledCourses.map(c => c._id.toString());
    const availableCourses = await Course.find({ _id: { $nin: enrolledCourseIds } });

    // Fetch upcoming live classes
    const upcomingClasses = await LiveClass.find({ isActive: true }).limit(3);

    const dynamicDashboardData = {
      userStats: {
        attendance: user.streak > 0 ? 100 : 0, // Mock attendance % based on streak
        testsCompleted: user.testsCompleted || 0,
        hoursLearned: user.hoursLearned || 0
      },
      gamification: {
        streak: user.streak || 0,
        xp: user.xp || 0,
        level: level
      },
      availableCourses: availableCourses,
      enrolledCourses: user.enrolledCourses,
      upcomingClasses: upcomingClasses,
      personalizedFocus: { 
        weakSubject: 'Take a mock test first!', 
        recommendationTitle: 'Start your journey', 
        recommendationType: 'Video Lecture' 
      }
    };

    res.json(dynamicDashboardData);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
