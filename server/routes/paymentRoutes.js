import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import UserProfile from '../models/UserProfile.js';
import PlatformSettings from '../models/PlatformSettings.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/payment/orders
router.post('/orders', protect, async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    let settings = await PlatformSettings.findOne();
    const price = settings ? settings.proSubscriptionPrice : 999;

    // Check if using the dummy mock key
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_MOCK_KEY_ID_123') {
      return res.json({
        order: { id: "mock_order_id_12345", amount: price * 100 },
        price,
        mock: true
      });
    }

    const options = {
      amount: price * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");

    res.json({ order, price });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payment/verify
router.post('/verify', protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      mock // Accept mock parameter
    } = req.body;

    if (mock) {
      // Bypass signature verification for mock mode
      const user = await UserProfile.findById(req.user._id);
      if (user) {
        user.isPro = true;
        await user.save();
        return res.status(200).json({ message: "Mock Payment verified successfully", isPro: true });
      }
      return res.status(404).json({ message: "User not found" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const user = await UserProfile.findById(req.user._id);
      if (user) {
        user.isPro = true;
        await user.save();
        res.status(200).json({ message: "Payment verified successfully", isPro: true });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
