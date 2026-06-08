import express from 'express';
import LibraryMaterial from '../models/LibraryMaterial.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const materials = await LibraryMaterial.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Add new library material
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, subject, type, size } = req.body;
    const material = new LibraryMaterial({
      title,
      subject,
      type,
      size,
      downloads: 0,
      rating: 5.0
    });
    const createdMaterial = await material.save();
    res.status(201).json(createdMaterial);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
