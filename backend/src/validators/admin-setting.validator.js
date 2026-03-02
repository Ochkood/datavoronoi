const { z } = require('zod');

const optionalText = z.string().max(500).optional();
const optionalUrl = z.string().trim().max(400).optional();

const updateAdminSettingsSchema = z.object({
  general: z
    .object({
      siteName: z.string().trim().min(2).max(120).optional(),
      siteDescription: optionalText,
      siteUrl: optionalUrl,
      contactEmail: z.string().email().optional(),
      contactPhone: z.string().max(50).optional(),
      contactAddress: z.string().max(240).optional(),
      social: z
        .object({
          facebook: optionalUrl,
          instagram: optionalUrl,
          linkedin: optionalUrl,
        })
        .optional(),
    })
    .optional(),
  email: z
    .object({
      fromName: z.string().trim().min(2).max(120).optional(),
      fromEmail: z.string().email().optional(),
      replyTo: z.string().email().optional(),
      newsletterEnabled: z.boolean().optional(),
    })
    .optional(),
  notifications: z
    .object({
      newUser: z.boolean().optional(),
      publisherRequest: z.boolean().optional(),
      feedback: z.boolean().optional(),
      systemError: z.boolean().optional(),
    })
    .optional(),
});

module.exports = {
  updateAdminSettingsSchema,
};

