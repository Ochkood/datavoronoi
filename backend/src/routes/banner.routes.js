const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { protect, requireRole } = require('../middlewares/auth.middleware');
const {
  listAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getPublicBanners,
} = require('../controllers/banner.controller');
const { createBannerSchema, updateBannerSchema } = require('../validators/banner.validator');

const router = express.Router();

router.get('/public', getPublicBanners);
router.get('/admin/list', protect, requireRole('admin'), listAdminBanners);
router.post('/admin', protect, requireRole('admin'), validate(createBannerSchema), createBanner);
router.patch('/admin/:id', protect, requireRole('admin'), validate(updateBannerSchema), updateBanner);
router.delete('/admin/:id', protect, requireRole('admin'), deleteBanner);

module.exports = router;
