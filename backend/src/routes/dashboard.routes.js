const express = require('express');
const {
  getDashboardSummary,
  getDashboardAnalytics,
} = require('../controllers/dashboard.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);
router.get('/analytics', protect, getDashboardAnalytics);

module.exports = router;
