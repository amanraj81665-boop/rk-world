import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  targetExam: String,
  userClass: String,
  isPro: Boolean,
  rank: Number,
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  hoursLearned: { type: Number, default: 0 },
  testsCompleted: { type: Number, default: 0 },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  lastClaimedReward: { type: Date },
  resetPasswordOtp: String,
  resetPasswordExpire: Date,
  profileImage: { type: String, default: '' }
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;
