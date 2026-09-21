import mongoose from 'mongoose';

const PillarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    bullets: { type: [String], default: [] },
    ctaLabel: { type: String, default: 'Discover More' },
    ctaLink: { type: String, default: '/news' },
    order: { type: Number, default: 0, min: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Pillar || mongoose.model('Pillar', PillarSchema);
