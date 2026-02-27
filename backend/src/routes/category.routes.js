const express = require('express');
const {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, requireRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', listCategories);
router.post('/', protect, requireRole('admin'), createCategory);
router.patch('/:id', protect, requireRole('admin'), updateCategory);
router.delete('/:id', protect, requireRole('admin'), deleteCategory);

module.exports = router;
