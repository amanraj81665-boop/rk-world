import express from 'express';
import bcrypt from 'bcryptjs';
import Course from '../models/Course.js';
import LibraryMaterial from '../models/LibraryMaterial.js';
import MockTest from '../models/MockTest.js';
import LiveClass from '../models/LiveClass.js';
import UserProfile from '../models/UserProfile.js';
import Notification from '../models/Notification.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and require admin role
router.use(protect, admin);

// @route   POST /api/admin/courses
router.post('/courses', async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    
    // Create and emit notification
    const notification = await Notification.create({
      title: 'New Course Added',
      message: `${newCourse.title} is now available!`,
      type: 'course'
    });
    if (req.io) req.io.emit('new-notification', notification);

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/admin/courses/:id
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    course.price = req.body.price !== undefined ? req.body.price : course.price;
    const updatedCourse = await course.save();
    
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/admin/courses/:id
router.delete('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/admin/library
router.post('/library', async (req, res) => {
  try {
    const newMaterial = await LibraryMaterial.create(req.body);
    res.status(201).json(newMaterial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/admin/tests
router.post('/tests', async (req, res) => {
  try {
    const { examName, subjects, questionHtml, options } = req.body;
    const test = new MockTest({
      examName: examName || 'Custom Mock Test',
      subjects: subjects || 'General',
      durationSeconds: 10800,
      totalQuestions: 90,
      marksPerCorrect: 4,
      marksPerIncorrect: -1,
      questionHtml: questionHtml,
      options: options || []
    });
    const createdTest = await test.save();
    
    const notification = await Notification.create({
      title: 'New Mock Test Available',
      message: `${createdTest.examName} is now live.`,
      type: 'test'
    });
    if (req.io) req.io.emit('new-notification', notification);

    res.status(201).json(createdTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/admin/live
router.post('/live', async (req, res) => {
  try {
    const { title, subject, teacher } = req.body;
    
    let liveClass = await LiveClass.findOne();
    
    if (liveClass) {
      // Update existing
      liveClass.title = title;
      liveClass.subject = subject;
      liveClass.teacher = teacher;
      liveClass.isLive = true;
      liveClass.viewers = 0;
      liveClass.chatMessages = []; // clear old chat
      await liveClass.save();
    } else {
      // Create new
      liveClass = await LiveClass.create({
        title, subject, teacher, isLive: true, viewers: 0, chatMessages: []
      });
    }

    const notification = await Notification.create({
      title: 'Live Class Started',
      message: `${teacher} is now live for ${subject}!`,
      type: 'live'
    });
    if (req.io) req.io.emit('new-notification', notification);
    
    res.status(200).json(liveClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/admin/staff
router.post('/staff', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await UserProfile.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserProfile.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'teacher', // admin or teacher
      phone: '',
      targetExam: '',
      userClass: '',
      isPro: false,
      rank: 0
    });

    res.status(201).json({ message: `${role} account created successfully`, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
