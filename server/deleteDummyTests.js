import dotenv from 'dotenv';
import mongoose from 'mongoose';
import MockTest from './models/MockTest.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await MockTest.deleteMany({});
    console.log('Deleted all MockTests');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
