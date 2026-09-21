import mongoose from 'mongoose';

const FocusAreaSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    cardStyle: {
      type: String,
      enum: ['solid', 'translucent'],
      default: 'solid',
    },
  },
  { timestamps: true }
);

export default mongoose.models.FocusArea ||
  mongoose.model('FocusArea', FocusAreaSchema);
