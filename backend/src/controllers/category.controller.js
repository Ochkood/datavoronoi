const Category = require('../models/Category');
const Post = require('../models/Post');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const listCategories = asyncHandler(async (req, res) => {
  const [categories, postCounts] = await Promise.all([
    Category.find().sort({ createdAt: -1 }),
    Post.aggregate([
      {
        $match: {
          status: 'published',
          visibility: 'public',
          category: { $ne: null },
        },
      },
      {
        $group: {
          _id: '$category',
          postsCount: { $sum: 1 },
        },
      },
    ]),
  ]);

  const postsCountByCategory = new Map(
    postCounts.map((item) => [String(item._id), item.postsCount || 0])
  );

  const enriched = categories.map((category) => ({
    ...category.toObject(),
    postsCount: postsCountByCategory.get(String(category._id)) || 0,
  }));

  res.json({ success: true, data: { categories: enriched } });
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

const getCategoryStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug }).select('slug stats');
  if (!category) {
    throw new ApiError(404, 'category not found');
  }

  res.json({
    success: true,
    data: {
      stats: category.stats || { highlights: [], charts: [] },
    },
  });
});

const updateCategoryStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { stats } = req.body;

  const category = await Category.findOne({ slug });
  if (!category) {
    throw new ApiError(404, 'category not found');
  }

  const highlights = Array.isArray(stats?.highlights) ? stats.highlights : [];
  const charts = Array.isArray(stats?.charts) ? stats.charts : [];

  category.stats = { highlights, charts };
  await category.save();

  res.json({
    success: true,
    data: {
      stats: category.stats,
    },
  });
});

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats,
  updateCategoryStats,
};
