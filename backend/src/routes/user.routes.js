const express = require('express');
const {
  listUsers,
  updateUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyFollowing,
  getMyFollowPeople,
  getPublicUserProfile,
  toggleFollowUser,
} = require('../controllers/user.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  updateUserSchema,
  updateMyProfileSchema,
  changePasswordSchema,
} = require('../validators/user.validator');

const router = express.Router();

router.get('/profile/me', protect, getMyProfile);
router.patch('/profile/me', protect, validate(updateMyProfileSchema), updateMyProfile);
router.patch('/profile/password', protect, validate(changePasswordSchema), changeMyPassword);
router.get('/following/me', protect, getMyFollowing);
router.get('/follows/me', protect, getMyFollowPeople);
router.get('/:id/public', getPublicUserProfile);
router.post('/:id/follow', protect, toggleFollowUser);

router.get('/', protect, requireRole('admin'), listUsers);
router.patch('/:id', protect, requireRole('admin'), validate(updateUserSchema), updateUser);

module.exports = router;
