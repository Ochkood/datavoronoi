const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['user', 'publisher', 'admin'],
      default: 'user',
    },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    experience: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    social: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
    },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
