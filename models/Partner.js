import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  logoUrl: { type: String, required: true },
  websiteUrl: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
