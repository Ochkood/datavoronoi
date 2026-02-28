const express = require('express');
const {
  getDashboardSummary,
  getDashboardAnalytics,
  getAdminDashboardSummary,
} = require('../controllers/dashboard.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);
router.get('/analytics', protect, getDashboardAnalytics);
router.get('/admin-summary', protect, requireRole('admin'), getAdminDashboardSummary);

module.exports = router;
