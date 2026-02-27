const { z } = require('zod');

const uploadImageSchema = z.object({
  fileName: z.string().min(1).max(140),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  dataBase64: z.string().min(1),
  folder: z
    .enum(['posts', 'categories', 'topics', 'editor', 'profiles'])
    .optional()
    .default('posts'),
});

module.exports = {
  uploadImageSchema,
};
