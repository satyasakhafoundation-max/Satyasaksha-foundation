import mongoose from 'mongoose';

const NewsArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    // Not required — auto-generated in pre-save hook
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 400,
  },
  content: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['Environment', 'Animal Welfare', 'Community', 'Wildlife', 'Foundation', 'Education', 'Other'],
    default: 'Foundation',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'Satyasaksha Foundation',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate a unique slug from title before saving
NewsArticleSchema.pre('save', function () {
  if (!this.slug && this.title) {
    const base = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    // Append a short timestamp suffix to guarantee uniqueness
    this.slug = `${base}-${Date.now().toString(36)}`;
  }
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

export default mongoose.models.NewsArticle || mongoose.model('NewsArticle', NewsArticleSchema);
