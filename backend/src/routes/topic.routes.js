const express = require('express');
const {
  listTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} = require('../controllers/topic.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', listTopics);
router.post('/', protect, requireRole('admin'), createTopic);
router.patch('/:id', protect, requireRole('admin'), updateTopic);
router.delete('/:id', protect, requireRole('admin'), deleteTopic);

module.exports = router;
