import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const UserProfileSchema = new mongoose.Schema({ name: String }, { strict: false });
const UserProfile = mongoose.model('UserProfile', UserProfileSchema, 'userprofiles');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await UserProfile.updateMany(
    { email: { $in: ['admin@rkworld.com', 'amanraj81665@gmail.com'] } },
    { $set: { name: 'Raushan Sir' } }
  );
  console.log('Done');
  process.exit(0);
}
run();
