const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createFeedback,
  listAdminFeedback,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedback.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createFeedbackSchema,
  updateFeedbackSchema,
} = require('../validators/feedback.validator');

const router = express.Router();

const feedbackCreateLimiter = rateLimit({
  windowMs: Number(process.env.FEEDBACK_RATE_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.FEEDBACK_RATE_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many feedback requests, please try again later.' },
});

router.post('/', feedbackCreateLimiter, validate(createFeedbackSchema), createFeedback);
router.get('/admin/list', protect, requireRole('admin'), listAdminFeedback);
router.patch('/:id', protect, requireRole('admin'), validate(updateFeedbackSchema), updateFeedback);
router.delete('/:id', protect, requireRole('admin'), deleteFeedback);

module.exports = router;
