import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rkworld').then(async () => {
  console.log('Connected to DB');
  
  // Need to import MockTest model, wait I can just use mongoose.connection
  await mongoose.connection.collection('mocktests').deleteMany({});
  console.log('Cleared old mock tests');
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
