const mongoose = require('mongoose');

const SHORT_ID_LENGTH = 5;
const SHORT_ID_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function generateShortId(length = SHORT_ID_LENGTH) {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += SHORT_ID_CHARS.charAt(Math.floor(Math.random() * SHORT_ID_CHARS.length));
  }
  return out;
}

const postSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      minlength: SHORT_ID_LENGTH,
      maxlength: SHORT_ID_LENGTH,
      match: /^[a-z0-9]{5}$/i,
    },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['draft', 'pending', 'published', 'rejected'],
      default: 'draft',
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }],
    publishedAt: { type: Date },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ title: 'text', excerpt: 'text' });

postSchema.pre('validate', async function ensureShortId(next) {
  if (this.shortId) {
    this.shortId = String(this.shortId).trim().toLowerCase();
  }
  if (this.shortId) return next();

  let tries = 0;
  while (tries < 10) {
    // eslint-disable-next-line no-await-in-loop
    const candidate = generateShortId();
    // eslint-disable-next-line no-await-in-loop
    const exists = await mongoose.models.Post.exists({ shortId: candidate });
    if (!exists) {
      this.shortId = candidate;
      return next();
    }
    tries += 1;
  }

  return next(new Error('Unable to generate unique short id'));
});

module.exports = mongoose.model('Post', postSchema);
