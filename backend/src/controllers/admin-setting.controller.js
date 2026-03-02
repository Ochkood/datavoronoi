const AdminSetting = require('../models/AdminSetting');
const asyncHandler = require('../utils/async-handler');

function mergeAdminSettings(doc, payload, userId) {
  if (payload.general) {
    const social = payload.general.social || {};
    doc.general = {
      siteName: payload.general.siteName ?? doc.general?.siteName ?? 'Datanews.mn',
      siteDescription:
        payload.general.siteDescription ?? doc.general?.siteDescription ?? '',
      siteUrl: payload.general.siteUrl ?? doc.general?.siteUrl ?? '',
      contactEmail: payload.general.contactEmail ?? doc.general?.contactEmail ?? '',
      contactPhone: payload.general.contactPhone ?? doc.general?.contactPhone ?? '',
      contactAddress:
        payload.general.contactAddress ?? doc.general?.contactAddress ?? '',
      social: {
        facebook: social.facebook ?? doc.general?.social?.facebook ?? '',
        instagram: social.instagram ?? doc.general?.social?.instagram ?? '',
        linkedin: social.linkedin ?? doc.general?.social?.linkedin ?? '',
      },
    };
  }

  if (payload.email) {
    doc.email = {
      fromName: payload.email.fromName ?? doc.email?.fromName ?? 'Datanews.mn',
      fromEmail: payload.email.fromEmail ?? doc.email?.fromEmail ?? '',
      replyTo: payload.email.replyTo ?? doc.email?.replyTo ?? '',
      newsletterEnabled:
        payload.email.newsletterEnabled ?? doc.email?.newsletterEnabled ?? true,
    };
  }

  if (payload.notifications) {
    doc.notifications = {
      newUser: payload.notifications.newUser ?? doc.notifications?.newUser ?? true,
      publisherRequest:
        payload.notifications.publisherRequest ??
        doc.notifications?.publisherRequest ??
        true,
      feedback: payload.notifications.feedback ?? doc.notifications?.feedback ?? true,
      systemError:
        payload.notifications.systemError ?? doc.notifications?.systemError ?? true,
    };
  }

  if (payload.typography) {
    doc.typography = {
      headingFont: payload.typography.headingFont ?? doc.typography?.headingFont ?? 'inter',
      sectionTitleFont:
        payload.typography.sectionTitleFont ??
        doc.typography?.sectionTitleFont ??
        'inter',
      cardTitleFont:
        payload.typography.cardTitleFont ?? doc.typography?.cardTitleFont ?? 'inter',
    };
  }

  doc.updatedBy = userId;
}

async function getOrCreateAdminSettings() {
  let settings = await AdminSetting.findOne({ key: 'main' });
  if (!settings) {
    settings = await AdminSetting.create({ key: 'main' });
  }
  return settings;
}

const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateAdminSettings();
  res.json({ success: true, data: { settings } });
});

const getPublicAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateAdminSettings();
  const site = {
    general: {
      siteName: settings.general?.siteName || 'Datanews.mn',
      siteDescription: settings.general?.siteDescription || '',
      siteUrl: settings.general?.siteUrl || '',
      contactEmail: settings.general?.contactEmail || '',
      contactPhone: settings.general?.contactPhone || '',
      contactAddress: settings.general?.contactAddress || '',
      social: {
        facebook: settings.general?.social?.facebook || '',
        instagram: settings.general?.social?.instagram || '',
        linkedin: settings.general?.social?.linkedin || '',
      },
    },
    email: {
      fromName: settings.email?.fromName || 'Datanews.mn',
      fromEmail: settings.email?.fromEmail || '',
      replyTo: settings.email?.replyTo || '',
      newsletterEnabled: settings.email?.newsletterEnabled !== false,
    },
    typography: {
      headingFont: settings.typography?.headingFont || 'inter',
      sectionTitleFont: settings.typography?.sectionTitleFont || 'inter',
      cardTitleFont: settings.typography?.cardTitleFont || 'inter',
    },
    updatedAt: settings.updatedAt,
  };
  res.json({ success: true, data: { settings: site } });
});

const updateAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateAdminSettings();
  mergeAdminSettings(settings, req.body, req.user._id);
  await settings.save();
  res.json({ success: true, data: { settings } });
});

module.exports = {
  getAdminSettings,
  getPublicAdminSettings,
  updateAdminSettings,
};
