import mongoose from 'mongoose';

const libraryMaterialSchema = new mongoose.Schema({
  title: String,
  subject: String,
  type: String, // PDF, Image, Video
  size: String,
  downloads: Number,
  rating: Number
});

export default mongoose.model('LibraryMaterial', libraryMaterialSchema);
