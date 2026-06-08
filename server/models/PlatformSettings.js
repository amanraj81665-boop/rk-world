import mongoose from 'mongoose';

const platformSettingsSchema = new mongoose.Schema({
  proSubscriptionPrice: {
    type: Number,
    required: true,
    default: 999
  }
}, { timestamps: true });

const PlatformSettings = mongoose.model('PlatformSettings', platformSettingsSchema);

export default PlatformSettings;
