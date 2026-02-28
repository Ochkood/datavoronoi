const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Bookmark = require('../models/Bookmark');
const PostLike = require('../models/PostLike');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const listPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status = 'published',
    sort = 'latest',
    category,
    topic,
    q,
    author,
  } = req.query;

  const filter = {};

  if (status !== 'all') filter.status = status;
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

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { viewsCount: 1 } },
    { new: true }
  )
    .populate('author', 'name avatar bio role')
    .populate('category', 'name slug')
    .populate('topics', 'name slug');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.json({ success: true, data: { post } });
});

const createPost = asyncHandler(async (req, res) => {
  const {
    title,
    excerpt,
    content,
    featuredImage,
    category,
    topics,
    visibility,
    status,
    publishedAt,
  } = req.body;

  const post = await Post.create({
    title,
    excerpt,
    content,
    featuredImage,
    category,
    topics: topics || [],
    visibility: visibility || 'public',
    status: status || 'draft',
    publishedAt: status === 'published' ? (publishedAt || new Date()) : null,
    author: req.user._id,
  });

  res.status(201).json({ success: true, data: { post } });
});

const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  const oldStatus = post.status;
  const payload = { ...req.body };
  if (payload.status === 'published' && !post.publishedAt) {
    payload.publishedAt = new Date();
  }

  const updated = await Post.findByIdAndUpdate(req.params.id, payload, { new: true });

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
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden');
  }

  await Post.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ post: req.params.id });
  await Bookmark.deleteMany({ post: req.params.id });
  await PostLike.deleteMany({ post: req.params.id });

  res.json({ success: true, message: 'Post deleted' });
});

const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: { comments } });
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await Comment.create({
    post: req.params.id,
    user: req.user._id,
    content,
  });

  await Post.findByIdAndUpdate(req.params.id, { $inc: { commentsCount: 1 } });

  if (String(post.author) !== String(req.user._id)) {
    await Notification.create({
      user: post.author,
      actor: req.user._id,
      type: 'comment',
      title: 'Шинэ сэтгэгдэл',
      message: `${req.user.name} таны "${post.title}" нийтлэлд сэтгэгдэл бичлээ`,
      link: `/post/${post._id}`,
    });
  }

  const populated = await Comment.findById(comment._id).populate('user', 'name avatar');
  res.status(201).json({ success: true, data: { comment: populated } });
});

const toggleBookmark = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const existing = await Bookmark.findOne({ user: req.user._id, post: req.params.id });

  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);
    return res.json({ success: true, data: { bookmarked: false } });
  }

  await Bookmark.create({ user: req.user._id, post: req.params.id });
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
  res.json({ success: true, data: { items } });
});

const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const existing = await PostLike.findOne({ user: req.user._id, post: req.params.id });

  if (existing) {
    await PostLike.findByIdAndDelete(existing._id);
    const updated = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likesCount: -1 } },
      { new: true }
    );
    return res.json({ success: true, data: { liked: false, likesCount: updated?.likesCount || 0 } });
  }

  await PostLike.create({ user: req.user._id, post: req.params.id });
  const updated = await Post.findByIdAndUpdate(
    req.params.id,
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
      link: `/post/${post._id}`,
    });
  }

  res.json({ success: true, data: { liked: true, likesCount: updated?.likesCount || 0 } });
});

const getMyEngagement = asyncHandler(async (req, res) => {
  const [liked, bookmarked] = await Promise.all([
    PostLike.exists({ user: req.user._id, post: req.params.id }),
    Bookmark.exists({ user: req.user._id, post: req.params.id }),
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
