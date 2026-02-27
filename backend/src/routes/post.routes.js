const express = require('express');
const {
  listPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  listComments,
  addComment,
  toggleBookmark,
  myBookmarks,
  toggleLike,
  getMyEngagement,
} = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createPostSchema,
  updatePostSchema,
  addCommentSchema,
} = require('../validators/post.validator');

const router = express.Router();

router.get('/', listPosts);
router.get('/bookmarks/me', protect, myBookmarks);
router.get('/:id', getPostById);
router.get('/:id/engagement', protect, getMyEngagement);
router.post('/', protect, validate(createPostSchema), createPost);
router.patch('/:id', protect, validate(updatePostSchema), updatePost);
router.delete('/:id', protect, deletePost);

router.get('/:id/comments', listComments);
router.post('/:id/comments', protect, validate(addCommentSchema), addComment);

router.post('/:id/bookmark', protect, toggleBookmark);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
