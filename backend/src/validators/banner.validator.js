const { z } = require('zod');

const targetType = z.enum(['home', 'category', 'topic']);
const optionalUrl = z.string().trim().max(500).optional();

const createBannerSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
    imageUrl: z.string().trim().min(1).max(1000),
    linkUrl: optionalUrl,
    alt: z.string().trim().max(200).optional(),
    placement: z.enum(['sidebar']).optional(),
    targetType,
    categoryId: z.string().trim().optional(),
    topicId: z.string().trim().optional(),
    sortOrder: z.number().int().min(-999).max(999).optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.targetType === 'category' && !value.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'categoryId is required for category banner',
      });
    }
    if (value.targetType === 'topic' && !value.topicId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['topicId'],
        message: 'topicId is required for topic banner',
      });
    }
  });

const updateBannerSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    imageUrl: z.string().trim().min(1).max(1000).optional(),
    linkUrl: optionalUrl,
    alt: z.string().trim().max(200).optional(),
    placement: z.enum(['sidebar']).optional(),
    targetType,
    categoryId: z.string().trim().nullable().optional(),
    topicId: z.string().trim().nullable().optional(),
    sortOrder: z.number().int().min(-999).max(999).optional(),
    isActive: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.targetType === 'category' && !value.categoryId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'categoryId is required for category banner',
      });
    }
    if (value.targetType === 'topic' && !value.topicId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['topicId'],
        message: 'topicId is required for topic banner',
      });
    }
  });

module.exports = {
  createBannerSchema,
  updateBannerSchema,
};
