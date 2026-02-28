const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['suggestion', 'bug', 'feedback', 'publisher_request', 'other'],
      default: 'feedback',
    },
    status: {
      type: String,
      enum: ['new', 'pending', 'in_progress', 'resolved'],
      default: 'new',
    },
    replyMessage: { type: String, default: '' },
    replySentAt: { type: Date },
    sourceIp: { type: String, default: '' },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ status: 1, type: 1, createdAt: -1 });
feedbackSchema.index({ sourceIp: 1, createdAt: -1 });
feedbackSchema.index({ subject: 'text', message: 'text', name: 'text', email: 'text' });

module.exports = mongoose.model('Feedback', feedbackSchema);
