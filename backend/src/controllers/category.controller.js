const Category = require('../models/Category');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { categories } });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, icon, color, bannerImage } = req.body;

  if (!name || !slug) {
    throw new ApiError(400, 'name and slug are required');
  }

  const exists = await Category.findOne({ slug });
  if (exists) {
    throw new ApiError(409, 'slug already exists');
  }

  const category = await Category.create({
    name,
    slug,
    description,
    icon,
    color,
    bannerImage,
  });

  res.status(201).json({ success: true, data: { category } });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, icon, color, bannerImage } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'category not found');
  }

  if (slug && slug !== category.slug) {
    const exists = await Category.findOne({ slug });
    if (exists) {
      throw new ApiError(409, 'slug already exists');
    }
  }

  if (name !== undefined) category.name = name;
  if (slug !== undefined) category.slug = slug;
  if (description !== undefined) category.description = description;
  if (icon !== undefined) category.icon = icon;
  if (color !== undefined) category.color = color;
  if (bannerImage !== undefined) category.bannerImage = bannerImage;

  await category.save();
  res.json({ success: true, data: { category } });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, 'category not found');
  }

  await category.deleteOne();
  res.json({ success: true, message: 'category deleted' });
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
