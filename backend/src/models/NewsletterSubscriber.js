const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['active', 'unsubscribed'],
      default: 'active',
    },
    source: {
      type: String,
      default: 'sidebar',
      trim: true,
    },
    sourceIp: {
      type: String,
      default: '',
      trim: true,
    },
    userAgent: {
      type: String,
      default: '',
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

newsletterSubscriberSchema.index({ createdAt: -1 });
newsletterSubscriberSchema.index({ sourceIp: 1, createdAt: -1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
