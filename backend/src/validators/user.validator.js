const { z } = require('zod');

const updateUserSchema = z
  .object({
    role: z.enum(['user', 'publisher', 'admin']).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((v) => v.role !== undefined || v.isActive !== undefined, {
    message: 'role or isActive is required',
  });

const socialSchema = z.object({
  twitter: z.string().optional().default(''),
  linkedin: z.string().optional().default(''),
  facebook: z.string().optional().default(''),
  instagram: z.string().optional().default(''),
});

const updateMyProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  email: z.string().email().optional(),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'slug must contain only lowercase letters, numbers and hyphen')
    .optional(),
  experience: z.string().max(300).optional(),
  bio: z.string().max(1000).optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  phone: z.string().max(30).optional(),
  location: z.string().max(120).optional(),
  website: z.string().max(240).optional(),
  social: socialSchema.optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

module.exports = {
  updateUserSchema,
  updateMyProfileSchema,
  changePasswordSchema,
};
