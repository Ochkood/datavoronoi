const mongoose = require('mongoose');

const adminSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'main' },
    general: {
      siteName: { type: String, default: 'Datanews.mn' },
      siteDescription: { type: String, default: '' },
      siteUrl: { type: String, default: '' },
      contactEmail: { type: String, default: '' },
      contactPhone: { type: String, default: '' },
      contactAddress: { type: String, default: '' },
      social: {
        facebook: { type: String, default: '' },
        instagram: { type: String, default: '' },
        linkedin: { type: String, default: '' },
      },
    },
    email: {
      fromName: { type: String, default: 'Datanews.mn' },
      fromEmail: { type: String, default: '' },
      replyTo: { type: String, default: '' },
      newsletterEnabled: { type: Boolean, default: true },
    },
    notifications: {
      newUser: { type: Boolean, default: true },
      publisherRequest: { type: Boolean, default: true },
      feedback: { type: Boolean, default: true },
      systemError: { type: Boolean, default: true },
    },
    typography: {
      headingFont: {
        type: String,
        enum: ['inter', 'finlandica'],
        default: 'inter',
      },
      sectionTitleFont: {
        type: String,
        enum: ['inter', 'finlandica'],
        default: 'inter',
      },
      cardTitleFont: {
        type: String,
        enum: ['inter', 'finlandica'],
        default: 'inter',
      },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminSetting', adminSettingSchema);
