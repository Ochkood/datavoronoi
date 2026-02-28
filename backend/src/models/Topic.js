const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
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

module.exports = mongoose.model('Topic', topicSchema);
