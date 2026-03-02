const express = require('express');
const { protect, requireRole } = require('../middlewares/auth.middleware');
const {
  subscribeNewsletter,
  listAdminNewsletterSubscribers,
  exportAdminNewsletterSubscribersCsv,
} = require('../controllers/newsletter.controller');

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/admin/subscribers', protect, requireRole('admin'), listAdminNewsletterSubscribers);
router.get(
  '/admin/subscribers/export',
  protect,
  requireRole('admin'),
  exportAdminNewsletterSubscribersCsv
);

module.exports = router;
