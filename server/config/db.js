import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Replace with your actual MongoDB URI when ready
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rkW🌎RLD';
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
