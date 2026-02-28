const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const PostLike = require('../models/PostLike');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');
const mongoose = require('mongoose');

function buildPostIdentifierQuery(id) {
  const value = String(id || '').trim();
  if (!value) return null;
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const shortIdQuery = { shortId: new RegExp(`^${escaped}$`, 'i') };
  if (mongoose.Types.ObjectId.isValid(value)) {
    return { $or: [{ _id: value }, shortIdQuery] };
  }
  return shortIdQuery;
}

async function ensurePostShortId(post) {
  if (!post || post.shortId) return post;
  await post.save();
  return post;
}

const listPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = 'published',
    sort = 'latest',
    featured = 'all',
    category,
    topic,
    q,
    author,
  } = req.query;

  const filter = {};

  if (status !== 'all') filter.status = status;
  if (featured !== 'all') {
    filter.featured = featured === 'true';
  }
  if (category) filter.category = category;
  if (topic) filter.topics = topic;
  if (author) filter.author = author;
  if (q) filter.$text = { $search: q };

  const skip = (Number(page) - 1) * Number(limit);

  const sortQuery =
    sort === 'popular'
      ? { viewsCount: -1, createdAt: -1 }
      : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name avatar role')
      .populate('category', 'name slug')
      .populate('topics', 'name slug')
      .sort(sortQuery)
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(filter),
  ]);

  await Promise.all(items.map((item) => ensurePostShortId(item)));

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

const listAdminPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    q,
    status = 'all',
    category,
    topic,
    author,
    dateFrom,
    dateTo,
    featured = 'all',
  } = req.query;

  const filter = {};

  if (status !== 'all') filter.status = status;
  if (category) filter.category = category;
  if (topic) filter.topics = topic;
  if (featured !== 'all') {
    filter.featured = featured === 'true';
  }
  if (q) filter.$text = { $search: q };

  if (dateFrom || dateTo) {
    const createdAt = {};
    if (dateFrom) {
      const start = new Date(dateFrom);
      if (!Number.isNaN(start.getTime())) createdAt.$gte = start;
    }
    if (dateTo) {
      const end = new Date(dateTo);
      if (!Number.isNaN(end.getTime())) {
        end.setHours(23, 59, 59, 999);
        createdAt.$lte = end;
      }
    }
    if (Object.keys(createdAt).length > 0) {
      filter.createdAt = createdAt;
    }
  }

  if (author) {
    if (mongoose.Types.ObjectId.isValid(author)) {
      filter.author = author;
    } else {
      const authorRows = await User.find({
        name: { $regex: author, $options: 'i' },
      }).select('_id');
      const authorIds = authorRows.map((row) => row._id);
      filter.author = authorIds.length > 0 ? { $in: authorIds } : null;
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name avatar role')
      .populate('category', 'name slug')
      .populate('topics', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Post.countDocuments(filter),
  ]);

  await Promise.all(items.map((item) => ensurePostShortId(item)));

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

const listTopAuthors = asyncHandler(async (req, res) => {
  const { category, topic, limit = 5 } = req.query;
  const parsedLimit = Math.max(1, Math.min(Number(limit) || 5, 20));

  const match = { status: 'published' };

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new ApiError(400, 'Invalid category id');
    }
    match.category = new mongoose.Types.ObjectId(category);
  }

  if (topic) {
    if (!mongoose.Types.ObjectId.isValid(topic)) {
      throw new ApiError(400, 'Invalid topic id');
    }
    match.topics = new mongoose.Types.ObjectId(topic);
  }

  const items = await Post.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$author',
        posts: { $sum: 1 },
        views: { $sum: { $ifNull: ['$viewsCount', 0] } },
      },
    },
    { $sort: { views: -1, posts: -1 } },
    { $limit: parsedLimit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'author',
      },
    },
    { $unwind: '$author' },
    {
      $project: {
        _id: 0,
        id: '$_id',
        name: '$author.name',
        avatar: '$author.avatar',
        role: '$author.role',
        posts: 1,
        views: 1,
      },
    },
  ]);

  res.json({ success: true, data: { items } });
});

const getPostMetaById = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery)
    .populate('author', 'name')
    .populate('category', 'name slug')
    .populate('topics', 'name slug')
    .select(
      'title excerpt content featuredImage status visibility createdAt publishedAt author category topics'
    );

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.status !== 'published' || post.visibility !== 'public') {
    throw new ApiError(404, 'Post not found');
  }

  await ensurePostShortId(post);

  res.json({ success: true, data: { post } });
});

const getPostById = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOneAndUpdate(
    identifierQuery,
    { $inc: { viewsCount: 1 } },
    { new: true }
  )
    .populate('author', 'name avatar bio role')
    .populate('category', 'name slug')
    .populate('topics', 'name slug');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  await ensurePostShortId(post);

  res.json({ success: true, data: { post } });
});

const createPost = asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    featuredImage,
    featured,
    category,
    topics,
    visibility,
    status,
    publishedAt,
  } = req.body;

  const requestedStatus = status || 'draft';
  const canPublishDirectly = req.user.role === 'admin';
  const resolvedStatus =
    canPublishDirectly
      ? requestedStatus
      : requestedStatus === 'published'
        ? 'pending'
        : requestedStatus;

  const post = await Post.create({
    title,
    excerpt,
    content,
    featuredImage,
    featured: canPublishDirectly ? Boolean(featured) : false,
    category,
    topics: topics || [],
    visibility: visibility || 'public',
    status: resolvedStatus,
    publishedAt: resolvedStatus === 'published' ? (publishedAt || new Date()) : null,
    author: req.user._id,
  });

  res.status(201).json({ success: true, data: { post } });
});

const updatePost = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  const oldStatus = post.status;
  const payload = { ...req.body };

  if (req.user.role !== 'admin') {
    if (payload.status === 'published') {
      payload.status = 'pending';
    }
    if (payload.featured !== undefined) {
      delete payload.featured;
    }
  }

  if (payload.status === 'published') {
    payload.publishedAt = post.publishedAt || new Date();
  } else if (payload.status && payload.status !== 'published') {
    payload.publishedAt = null;
  }

  const updated = await Post.findByIdAndUpdate(post._id, payload, { new: true });

  if (
    updated &&
    payload.status &&
    payload.status !== oldStatus &&
    req.user.role === 'admin' &&
    String(updated.author) !== String(req.user._id)
  ) {
    const statusMap = {
      published: {
        type: 'approved',
        title: 'Нийтлэл батлагдлаа',
        message: `"${updated.title}" нийтлэл нийтлэгдлээ`,
      },
      rejected: {
        type: 'rejected',
        title: 'Нийтлэл татгалзагдлаа',
        message: `"${updated.title}" нийтлэл татгалзагдлаа`,
      },
      pending: {
        type: 'system',
        title: 'Нийтлэл хянагдаж байна',
        message: `"${updated.title}" нийтлэл хяналтын төлөв рүү шилжлээ`,
      },
      draft: {
        type: 'system',
        title: 'Нийтлэл ноорог боллоо',
        message: `"${updated.title}" нийтлэл ноорог төлөвт шилжлээ`,
      },
    };

    const notif = statusMap[payload.status] || null;
    if (notif) {
      await Notification.create({
        user: updated.author,
        actor: req.user._id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        link: `/dashboard/posts/${updated._id}/edit`,
      });
    }
  }

  res.json({ success: true, data: { post: updated } });
});

const deletePost = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  await Post.findByIdAndDelete(post._id);
  await Comment.deleteMany({ post: post._id });
  await Bookmark.deleteMany({ post: post._id });
  await PostLike.deleteMany({ post: post._id });

  res.json({ success: true, message: 'Post deleted' });
});

const listComments = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery).select('_id');
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comments = await Comment.find({ post: post._id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: { comments } });
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await Comment.create({
    post: post._id,
    user: req.user._id,
    content,
  });

  await Post.findByIdAndUpdate(post._id, { $inc: { commentsCount: 1 } });
  await ensurePostShortId(post);

  if (String(post.author) !== String(req.user._id)) {
    await Notification.create({
      user: post.author,
      actor: req.user._id,
      type: 'comment',
      title: 'Шинэ сэтгэгдэл',
      message: `${req.user.name} таны "${post.title}" нийтлэлд сэтгэгдэл бичлээ`,
      link: `/post/${post.shortId || post._id}`,
    });
  }

  const populated = await Comment.findById(comment._id).populate('user', 'name avatar');
  res.status(201).json({ success: true, data: { comment: populated } });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  await ensurePostShortId(post);

  const existing = await Bookmark.findOne({ user: req.user._id, post: post._id });

  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);
    return res.json({ success: true, data: { bookmarked: false } });
  }

  await Bookmark.create({ user: req.user._id, post: post._id });
  res.json({ success: true, data: { bookmarked: true } });
});

const myBookmarks = asyncHandler(async (req, res) => {
  const rows = await Bookmark.find({ user: req.user._id })
    .populate({
      path: 'post',
      populate: [
        { path: 'author', select: 'name avatar role' },
        { path: 'category', select: 'name slug' },
      ],
    })
    .sort({ createdAt: -1 });

  const items = rows.map((row) => row.post).filter(Boolean);
  await Promise.all(items.map((item) => ensurePostShortId(item)));
  res.json({ success: true, data: { items } });
});

const toggleLike = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }
  await ensurePostShortId(post);

  const existing = await PostLike.findOne({ user: req.user._id, post: post._id });

  if (existing) {
    await PostLike.findByIdAndDelete(existing._id);
    const updated = await Post.findByIdAndUpdate(
      post._id,
      { $inc: { likesCount: -1 } },
      { new: true }
    );
    return res.json({ success: true, data: { liked: false, likesCount: updated?.likesCount || 0 } });
  }

  await PostLike.create({ user: req.user._id, post: post._id });
  const updated = await Post.findByIdAndUpdate(
    post._id,
    { $inc: { likesCount: 1 } },
    { new: true }
  );

  if (String(post.author) !== String(req.user._id)) {
    await Notification.create({
      user: post.author,
      actor: req.user._id,
      type: 'like',
      title: 'Шинэ лайк',
      message: `${req.user.name} таны "${post.title}" нийтлэлд лайк дарлаа`,
      link: `/post/${post.shortId || post._id}`,
    });
  }

  res.json({ success: true, data: { liked: true, likesCount: updated?.likesCount || 0 } });
});

const getMyEngagement = asyncHandler(async (req, res) => {
  const identifierQuery = buildPostIdentifierQuery(req.params.id);
  if (!identifierQuery) {
    throw new ApiError(404, 'Post not found');
  }

  const post = await Post.findOne(identifierQuery).select('_id');
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const [liked, bookmarked] = await Promise.all([
    PostLike.exists({ user: req.user._id, post: post._id }),
    Bookmark.exists({ user: req.user._id, post: post._id }),
  ]);

  res.json({
    success: true,
    data: {
      liked: Boolean(liked),
      bookmarked: Boolean(bookmarked),
    },
  });
});

module.exports = {
  listPosts,
  listAdminPosts,
  listTopAuthors,
  getPostMetaById,
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
};
