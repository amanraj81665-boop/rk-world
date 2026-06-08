import express from 'express';
import LiveClass from '../models/LiveClass.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const liveClass = await LiveClass.findOne();
    res.json(liveClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
