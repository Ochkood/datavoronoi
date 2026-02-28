const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    stats: {
      highlights: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
      charts: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
