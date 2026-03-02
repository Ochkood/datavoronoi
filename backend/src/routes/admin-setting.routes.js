const express = require('express');
const {
  getAdminSettings,
  getPublicAdminSettings,
  updateAdminSettings,
} = require('../controllers/admin-setting.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateAdminSettingsSchema } = require('../validators/admin-setting.validator');

const router = express.Router();

router.get('/public', getPublicAdminSettings);
router.get('/', protect, requireRole('admin'), getAdminSettings);
router.patch(
  '/',
  protect,
  requireRole('admin'),
  validate(updateAdminSettingsSchema),
  updateAdminSettings
);

module.exports = router;
