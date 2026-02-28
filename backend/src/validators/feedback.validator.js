const { z } = require('zod');

const feedbackTypeEnum = z.enum([
  'suggestion',
  'bug',
  'feedback',
  'publisher_request',
  'other',
]);

const feedbackStatusEnum = z.enum(['new', 'pending', 'in_progress', 'resolved']);

const createFeedbackSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(5000),
  type: feedbackTypeEnum.optional().default('feedback'),
  website: z.string().trim().max(0).optional(),
});

const updateFeedbackSchema = z.object({
  status: feedbackStatusEnum.optional(),
  replyMessage: z.string().trim().max(5000).optional(),
});

module.exports = {
  createFeedbackSchema,
  updateFeedbackSchema,
};
