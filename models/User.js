import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 8,
      select: false, // Never return password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin'],
      default: 'admin',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Invite token fields for passwordless onboarding
    inviteToken: {
      type: String,
      select: false,
    },
    inviteTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving (only when modified)
UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to generate a hashed invite token
UserSchema.statics.generateInviteToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashed };
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
