import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import UserProfile from './models/UserProfile.js';
import connectDB from './config/db.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = 'raushan9031@gmail.com';
    const password = 'Raushan@9304';
    const phone = '9304327577';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = await UserProfile.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.phone = phone;
      user.role = 'admin';
      await user.save();
      console.log('Admin user updated successfully');
    } else {
      user = await UserProfile.create({
        name: 'Raushan Sir',
        email: email,
        password: hashedPassword,
        phone: phone,
        role: 'admin',
        targetExam: '',
        userClass: '',
        isPro: true,
        rank: 0
      });
      console.log('Admin user created successfully');
    }

    // Now, let's reset everyone else to 'student'
    const result = await UserProfile.updateMany(
      { email: { $ne: email } },
      { $set: { role: 'student' } }
    );
    console.log(`Reset ${result.modifiedCount} other users back to student role.`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
