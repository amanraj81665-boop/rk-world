import dotenv from 'dotenv';
import mongoose from 'mongoose';
import UserProfile from './models/UserProfile.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const result = await UserProfile.updateMany({}, { role: 'admin' });
    console.log('Updated users to admin:', result.modifiedCount);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
