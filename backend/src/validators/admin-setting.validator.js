const { z } = require('zod');

const optionalText = z.string().max(500).optional();
const optionalUrl = z.string().trim().max(400).optional();
const optionalEmail = z.union([z.string().trim().email(), z.literal('')]).optional();
const fontChoice = z.enum(['inter', 'finlandica']);

const updateAdminSettingsSchema = z.object({
  general: z
    .object({
      siteName: z.string().trim().min(2).max(120).optional(),
      siteDescription: optionalText,
      siteUrl: optionalUrl,
      contactEmail: optionalEmail,
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
      fromEmail: optionalEmail,
      replyTo: optionalEmail,
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
  typography: z
    .object({
      headingFont: fontChoice.optional(),
      sectionTitleFont: fontChoice.optional(),
      cardTitleFont: fontChoice.optional(),
    })
    .optional(),
});

module.exports = {
  updateAdminSettingsSchema,
};
