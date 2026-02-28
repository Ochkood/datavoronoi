const { z } = require('zod');

const statusEnum = z.enum(['draft', 'pending', 'published', 'rejected']);
const visibilityEnum = z.enum(['public', 'private']);

const createPostSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().max(500).optional().default(''),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  featured: z.boolean().optional(),
  category: z.string().optional(),
  topics: z.array(z.string()).optional().default([]),
  visibility: visibilityEnum.optional(),
  status: z.enum(['draft', 'pending', 'published']).optional(),
  publishedAt: z.string().optional(),
});

const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1).optional(),
  featuredImage: z.string().optional(),
  featured: z.boolean().optional(),
  category: z.string().optional(),
  topics: z.array(z.string()).optional(),
  visibility: visibilityEnum.optional(),
  status: statusEnum.optional(),
  publishedAt: z.string().optional(),
});

const addCommentSchema = z.object({
  content: z.string().min(1),
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  addCommentSchema,
};
