const Notification = require('../models/Notification');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const listNotifications = asyncHandler(async (req, res) => {
  const { filter = 'all' } = req.query;

  const query = { user: req.user._id };
  if (filter === 'unread') query.read = false;
  if (['comment', 'like', 'approved', 'rejected', 'system'].includes(filter)) {
    query.type = filter;
  }

  const [items, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .populate('actor', 'name avatar')
      .limit(100),
    Notification.countDocuments({ user: req.user._id, read: false }),
  ]);

  res.json({ success: true, data: { items, unreadCount } });
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notif) {
    throw new ApiError(404, 'Notification not found');
  }

  notif.read = true;
  await notif.save();

  res.json({ success: true, data: { notification: notif } });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

const deleteNotification = asyncHandler(async (req, res) => {
  const notif = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notif) {
    throw new ApiError(404, 'Notification not found');
  }

  await notif.deleteOne();
  res.json({ success: true, message: 'Notification deleted' });
});

const deleteReadNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ user: req.user._id, read: true });
  res.json({ success: true, message: 'Read notifications deleted' });
});

module.exports = {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteReadNotifications,
};
