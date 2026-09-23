import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  // Optional: the admin form's own label says "shows text name if blank," and
  // both the admin list and public marquee already render item.name as a
  // text fallback when this is empty — it was marked required here by
  // mistake, which made that fallback path impossible to reach (submitting
  // without a logo was hard-blocked with a raw validation error).
  logoUrl: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  order: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
