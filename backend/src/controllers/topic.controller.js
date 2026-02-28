const Topic = require('../models/Topic');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const listTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find().sort({ createdAt: -1 });
  res.json({ success: true, data: { topics } });
});

const createTopic = asyncHandler(async (req, res) => {
  const { name, slug, description, image, featured, startDate, endDate } = req.body;

  if (!name || !slug) {
    throw new ApiError(400, 'name and slug are required');
  }

  const exists = await Topic.findOne({ slug });
  if (exists) {
    throw new ApiError(409, 'slug already exists');
  }

  const topic = await Topic.create({
    name,
    slug,
    description,
    image,
    featured,
    startDate,
    endDate,
  });

  res.status(201).json({ success: true, data: { topic } });
});

const updateTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, image, featured, startDate, endDate } = req.body;

  const topic = await Topic.findById(id);
  if (!topic) {
    throw new ApiError(404, 'topic not found');
  }

  if (slug && slug !== topic.slug) {
    const exists = await Topic.findOne({ slug });
    if (exists) {
      throw new ApiError(409, 'slug already exists');
    }
  }

  if (name !== undefined) topic.name = name;
  if (slug !== undefined) topic.slug = slug;
  if (description !== undefined) topic.description = description;
  if (image !== undefined) topic.image = image;
  if (featured !== undefined) topic.featured = featured;
  if (startDate !== undefined) topic.startDate = startDate || null;
  if (endDate !== undefined) topic.endDate = endDate || null;

  await topic.save();
  res.json({ success: true, data: { topic } });
});

const deleteTopic = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const topic = await Topic.findById(id);
  if (!topic) {
    throw new ApiError(404, 'topic not found');
  }

  await topic.deleteOne();
  res.json({ success: true, message: 'topic deleted' });
});

const getTopicStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const topic = await Topic.findOne({ slug }).select('slug stats');
  if (!topic) {
    throw new ApiError(404, 'topic not found');
  }

  res.json({
    success: true,
    data: {
      stats: topic.stats || { highlights: [], charts: [] },
    },
  });
});

const updateTopicStats = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { stats } = req.body;

  const topic = await Topic.findOne({ slug });
  if (!topic) {
    throw new ApiError(404, 'topic not found');
  }

  const highlights = Array.isArray(stats?.highlights) ? stats.highlights : [];
  const charts = Array.isArray(stats?.charts) ? stats.charts : [];

  topic.stats = { highlights, charts };
  await topic.save();

  res.json({
    success: true,
    data: {
      stats: topic.stats,
    },
  });
});

module.exports = {
  listTopics,
  createTopic,
  updateTopic,
  deleteTopic,
  getTopicStats,
  updateTopicStats,
};
