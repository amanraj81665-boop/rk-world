import express from 'express';
import Course from '../models/Course.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import UserProfile from '../models/UserProfile.js';

const router = express.Router();

// Get all active courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Admin: Create a new course
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, module, teacher, isActive, chapters } = req.body;
    const course = new Course({
      title,
      module,
      teacher,
      isActive: isActive !== undefined ? isActive : true,
      chapters: chapters || []
    });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Student: Enroll in a course
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const courseId = req.params.id;
    const user = await UserProfile.findById(req.user._id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();
    
    res.status(200).json({ message: 'Successfully enrolled', course });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
