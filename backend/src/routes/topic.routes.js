const express = require('express');
const {
  listTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicStats,
  updateTopicStats,
} = require('../controllers/topic.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', listTopics);
router.get('/:slug/stats', getTopicStats);
router.patch('/:slug/stats', protect, requireRole('admin'), updateTopicStats);
router.post('/', protect, requireRole('admin'), createTopic);
router.patch('/:id', protect, requireRole('admin'), updateTopic);
router.delete('/:id', protect, requireRole('admin'), deleteTopic);

module.exports = router;
