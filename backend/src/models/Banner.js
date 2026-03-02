const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    imageUrl: { type: String, required: true, trim: true },
    linkUrl: { type: String, default: '', trim: true },
    alt: { type: String, default: 'Сурталгааны баннер', trim: true, maxlength: 200 },
    placement: {
      type: String,
      enum: ['sidebar'],
      default: 'sidebar',
      index: true,
    },
    targetType: {
      type: String,
      enum: ['home', 'category', 'topic'],
      required: true,
      index: true,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', default: null },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
