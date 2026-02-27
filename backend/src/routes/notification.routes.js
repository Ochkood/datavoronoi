const express = require('express');
const {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteReadNotifications,
} = require('../controllers/notification.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, listNotifications);
router.patch('/read-all', protect, markAllNotificationsRead);
router.patch('/:id/read', protect, markNotificationRead);
router.delete('/read', protect, deleteReadNotifications);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
