import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    year: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    highlights: { type: [String], default: [] },
    publishedDate: { type: Date, default: Date.now },
    order: { type: Number, default: 0, min: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
