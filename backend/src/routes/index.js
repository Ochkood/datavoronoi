const express = require('express');
const authRoutes = require('./auth.routes');
const postRoutes = require('./post.routes');
const categoryRoutes = require('./category.routes');
const topicRoutes = require('./topic.routes');
const userRoutes = require('./user.routes');
const uploadRoutes = require('./upload.routes');
const dashboardRoutes = require('./dashboard.routes');
const notificationRoutes = require('./notification.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/topics', topicRoutes);
router.use('/users', userRoutes);
router.use('/uploads', uploadRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
