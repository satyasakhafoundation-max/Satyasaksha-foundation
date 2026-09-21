import mongoose from 'mongoose';

const InvolvementOptionSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    anchorId: { type: String, default: '', trim: true },
    description: { type: String, required: true },
    bullets: { type: [String], default: [] },
    ctaLabel: { type: String, default: 'Learn More' },
    ctaLink: { type: String, default: '/contact' },
    order: { type: Number, default: 0, min: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.InvolvementOption || mongoose.model('InvolvementOption', InvolvementOptionSchema);
