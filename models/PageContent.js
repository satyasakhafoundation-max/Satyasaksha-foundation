import mongoose from 'mongoose';

// One document per page slug. `data` holds arbitrary key/value pairs whose
// shape is defined by lib/pageContentSchema.js — this model itself stays
// intentionally generic so new editable fields don't need a migration.
const PageContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.PageContent || mongoose.model('PageContent', PageContentSchema);
