const Banner = require('../models/Banner');
const Category = require('../models/Category');
const Topic = require('../models/Topic');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

function toId(value) {
  return String(value || '').trim() || null;
}

async function resolveTarget(payload) {
  const type = payload.targetType;
  if (type === 'home') {
    return { targetType: 'home', category: null, topic: null };
  }

  if (type === 'category') {
    const categoryId = toId(payload.categoryId);
    if (!categoryId) throw new ApiError(400, 'categoryId is required');
    const exists = await Category.exists({ _id: categoryId });
    if (!exists) throw new ApiError(404, 'Category not found');
    return { targetType: 'category', category: categoryId, topic: null };
  }

  if (type === 'topic') {
    const topicId = toId(payload.topicId);
    if (!topicId) throw new ApiError(400, 'topicId is required');
    const exists = await Topic.exists({ _id: topicId });
    if (!exists) throw new ApiError(404, 'Topic not found');
    return { targetType: 'topic', category: null, topic: topicId };
  }

  throw new ApiError(400, 'Invalid targetType');
}

function mapBanner(item) {
  return {
    _id: item._id,
    title: item.title,
    imageUrl: item.imageUrl,
    linkUrl: item.linkUrl || '',
    alt: item.alt || 'Сурталгааны баннер',
    placement: item.placement || 'sidebar',
    targetType: item.targetType,
    category: item.category
      ? {
          _id: item.category._id || item.category,
          name: item.category.name || '',
          slug: item.category.slug || '',
        }
      : null,
    topic: item.topic
      ? {
          _id: item.topic._id || item.topic,
          name: item.topic.name || '',
          slug: item.topic.slug || '',
        }
      : null,
    sortOrder: Number(item.sortOrder || 0),
    isActive: Boolean(item.isActive),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

const listAdminBanners = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q = '', targetType = 'all', status = 'all' } = req.query;
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {};
  const query = String(q || '').trim();
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { alt: { $regex: query, $options: 'i' } },
      { linkUrl: { $regex: query, $options: 'i' } },
    ];
  }
  if (targetType !== 'all') {
    filter.targetType = targetType;
  }
  if (status === 'active') filter.isActive = true;
  if (status === 'inactive') filter.isActive = false;

  const [items, total] = await Promise.all([
    Banner.find(filter)
      .populate('category', 'name slug')
      .populate('topic', 'name slug')
      .sort({ isActive: -1, targetType: 1, sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    Banner.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items: items.map(mapBanner),
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1,
      },
    },
  });
});

const createBanner = asyncHandler(async (req, res) => {
  const target = await resolveTarget(req.body);
  const banner = await Banner.create({
    title: req.body.title,
    imageUrl: req.body.imageUrl,
    linkUrl: req.body.linkUrl || '',
    alt: req.body.alt || 'Сурталгааны баннер',
    placement: req.body.placement || 'sidebar',
    targetType: target.targetType,
    category: target.category,
    topic: target.topic,
    sortOrder: Number(req.body.sortOrder || 0),
    isActive: req.body.isActive !== false,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });

  await banner.populate('category', 'name slug');
  await banner.populate('topic', 'name slug');

  res.status(201).json({ success: true, data: { banner: mapBanner(banner) } });
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) throw new ApiError(404, 'Banner not found');

  if (req.body.targetType) {
    const target = await resolveTarget(req.body);
    banner.targetType = target.targetType;
    banner.category = target.category;
    banner.topic = target.topic;
  }

  if (req.body.title !== undefined) banner.title = req.body.title;
  if (req.body.imageUrl !== undefined) banner.imageUrl = req.body.imageUrl;
  if (req.body.linkUrl !== undefined) banner.linkUrl = req.body.linkUrl || '';
  if (req.body.alt !== undefined) banner.alt = req.body.alt || 'Сурталгааны баннер';
  if (req.body.placement !== undefined) banner.placement = req.body.placement;
  if (req.body.sortOrder !== undefined) banner.sortOrder = Number(req.body.sortOrder || 0);
  if (req.body.isActive !== undefined) banner.isActive = Boolean(req.body.isActive);
  banner.updatedBy = req.user._id;

  await banner.save();
  await banner.populate('category', 'name slug');
  await banner.populate('topic', 'name slug');

  res.json({ success: true, data: { banner: mapBanner(banner) } });
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findById(id);
  if (!banner) throw new ApiError(404, 'Banner not found');
  await banner.deleteOne();
  res.json({ success: true, message: 'Banner deleted' });
});

const getPublicBanners = asyncHandler(async (req, res) => {
  const placement = String(req.query.placement || 'sidebar');
  const pageType = String(req.query.pageType || 'home');
  const targetId = toId(req.query.targetId);
  const limit = Math.max(1, Math.min(10, Number(req.query.limit) || 3));

  const base = { placement, isActive: true };

  let rows = [];
  if (pageType === 'home') {
    rows = await Banner.find({ ...base, targetType: 'home' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit);
  } else if (pageType === 'category') {
    rows = targetId
      ? await Banner.find({ ...base, targetType: 'category', category: targetId })
          .sort({ sortOrder: 1, createdAt: -1 })
          .limit(limit)
      : [];
    if (rows.length === 0) {
      rows = await Banner.find({ ...base, targetType: 'home' })
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(limit);
    }
  } else if (pageType === 'topic') {
    rows = targetId
      ? await Banner.find({ ...base, targetType: 'topic', topic: targetId })
          .sort({ sortOrder: 1, createdAt: -1 })
          .limit(limit)
      : [];
    if (rows.length === 0) {
      rows = await Banner.find({ ...base, targetType: 'home' })
        .sort({ sortOrder: 1, createdAt: -1 })
        .limit(limit);
    }
  } else {
    throw new ApiError(400, 'Invalid pageType');
  }

  res.json({
    success: true,
    data: {
      items: rows.map(mapBanner),
    },
  });
});

module.exports = {
  listAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getPublicBanners,
};
