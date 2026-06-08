import express from 'express';
import MockTest from '../models/MockTest.js';
import TestAttempt from '../models/TestAttempt.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all mock tests
router.get('/', protect, async (req, res) => {
  try {
    // Cleanup old invalid tests
    await MockTest.deleteMany({ questions: { $exists: false } });
    await MockTest.deleteMany({ questions: { $size: 0 } });
    
    let mockTests = await MockTest.find().sort({ createdAt: -1 }).select('-questions.correctOptionIndex');
    
    res.json(mockTests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Evaluate and Submit Test
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const testId = req.params.id;
    const { answers } = req.body; // { '0': 1, '1': 0, '2': 3 }

    const test = await MockTest.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    test.questions.forEach((q, index) => {
      const selectedOption = answers[index];
      if (selectedOption === undefined || selectedOption === null) {
        unattempted += 1;
      } else if (selectedOption === q.correctOptionIndex) {
        score += q.positiveMarks;
        correct += 1;
      } else {
        score -= q.negativeMarks;
        incorrect += 1;
      }
    });

    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

    const attempt = new TestAttempt({
      user: req.user._id,
      test: testId,
      score,
      accuracy,
      answers
    });
    await attempt.save();

    // Calculate AIR (All India Rank)
    const betterAttemptsCount = await TestAttempt.countDocuments({
      test: testId,
      score: { $gt: score }
    });
    const air = betterAttemptsCount + 1;

    res.json({
      score,
      totalMarks: test.totalMarks,
      accuracy,
      correct,
      incorrect,
      unattempted,
      air
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
