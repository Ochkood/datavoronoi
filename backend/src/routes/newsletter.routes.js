const express = require('express');
const { protect, requireRole } = require('../middlewares/auth.middleware');
const {
  subscribeNewsletter,
  listAdminNewsletterSubscribers,
} = require('../controllers/newsletter.controller');

const router = express.Router();

router.post('/subscribe', subscribeNewsletter);
router.get('/admin/subscribers', protect, requireRole('admin'), listAdminNewsletterSubscribers);

module.exports = router;
