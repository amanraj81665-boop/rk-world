import express from 'express';
import PlatformSettings from '../models/PlatformSettings.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/settings
router.get('/', async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = await PlatformSettings.create({ proSubscriptionPrice: 999 });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/settings (Admin Only)
router.put('/', protect, admin, async (req, res) => {
  try {
    const { proSubscriptionPrice } = req.body;
    let settings = await PlatformSettings.findOne();
    
    if (settings) {
      settings.proSubscriptionPrice = proSubscriptionPrice || settings.proSubscriptionPrice;
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      settings = await PlatformSettings.create({ proSubscriptionPrice: proSubscriptionPrice || 999 });
      res.status(201).json(settings);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
