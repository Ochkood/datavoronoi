const Post = require('../models/Post');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/async-handler');

const DAY = 24 * 60 * 60 * 1000;

function parseRange(range) {
  const key = String(range || '7d');
  if (key === '30d') return 30;
  if (key === '90d') return 90;
  if (key === '1y') return 365;
  return 7;
}

function fmtCompact(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

function buildTimeSeriesMap(days, useMonth = false) {
  const now = new Date();
  const map = new Map();

  if (useMonth) {
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, {
        key,
        name: `${d.getMonth() + 1}-р сар`,
        views: 0,
        likes: 0,
      });
    }
    return map;
  }

  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now.getTime() - i * DAY);
    const key = d.toISOString().slice(0, 10);
    map.set(key, {
      key,
      name: `${d.getMonth() + 1}/${d.getDate()}`,
      views: 0,
      likes: 0,
    });
  }
  return map;
}

function percentageChange(current, previous) {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return ((current - previous) / previous) * 100;
}

const getDashboardSummary = asyncHandler(async (req, res) => {
  const days = parseRange(req.query.range);
  const now = new Date();
  const start = new Date(now.getTime() - days * DAY);

  const [posts, recentPosts, unreadCount, latestNotifications] = await Promise.all([
    Post.find({ author: req.user._id }),
    Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .limit(4)
      .select('title status viewsCount likesCount commentsCount createdAt featuredImage'),
    Notification.countDocuments({ user: req.user._id, read: false }),
    Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('type title message read link createdAt'),
  ]);

  const totalPosts = posts.length;
  const totalViews = posts.reduce((s, p) => s + (p.viewsCount || 0), 0);
  const totalLikes = posts.reduce((s, p) => s + (p.likesCount || 0), 0);
  const totalComments = posts.reduce((s, p) => s + (p.commentsCount || 0), 0);

  const statusCount = { published: 0, pending: 0, draft: 0, rejected: 0 };
  posts.forEach((p) => {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1;
  });

  const currentPosts = posts.filter((p) => p.createdAt >= start);
  const prevStart = new Date(start.getTime() - days * DAY);
  const previousPosts = posts.filter((p) => p.createdAt >= prevStart && p.createdAt < start);

  const currentViews = currentPosts.reduce((s, p) => s + (p.viewsCount || 0), 0);
  const currentLikes = currentPosts.reduce((s, p) => s + (p.likesCount || 0), 0);
  const currentComments = currentPosts.reduce((s, p) => s + (p.commentsCount || 0), 0);

  const previousViews = previousPosts.reduce((s, p) => s + (p.viewsCount || 0), 0);
  const previousLikes = previousPosts.reduce((s, p) => s + (p.likesCount || 0), 0);
  const previousComments = previousPosts.reduce((s, p) => s + (p.commentsCount || 0), 0);

  const trendMap = buildTimeSeriesMap(days, false);
  currentPosts.forEach((p) => {
    const key = new Date(p.createdAt).toISOString().slice(0, 10);
    const row = trendMap.get(key);
    if (row) {
      row.views += p.viewsCount || 0;
      row.likes += p.likesCount || 0;
    }
  });

  const summary = {
    stats: {
      posts: {
        value: totalPosts,
        change: currentPosts.length - previousPosts.length,
      },
      views: {
        value: totalViews,
        display: fmtCompact(totalViews),
        changePct: percentageChange(currentViews, previousViews),
      },
      likes: {
        value: totalLikes,
        display: fmtCompact(totalLikes),
        changePct: percentageChange(currentLikes, previousLikes),
      },
      comments: {
        value: totalComments,
        display: fmtCompact(totalComments),
        changePct: percentageChange(currentComments, previousComments),
      },
      status: statusCount,
    },
    viewsTrend: Array.from(trendMap.values()),
    recentPosts: recentPosts.map((p) => ({
      id: p._id,
      title: p.title,
      status: p.status,
      views: p.viewsCount || 0,
      likes: p.likesCount || 0,
      comments: p.commentsCount || 0,
      date: p.createdAt,
      image: p.featuredImage || '',
    })),
    notifications: {
      unreadCount,
      latest: latestNotifications,
    },
  };

  res.json({ success: true, data: summary });
});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const days = parseRange(req.query.range);
  const now = new Date();
  const start = new Date(now.getTime() - days * DAY);
  const prevStart = new Date(start.getTime() - days * DAY);

  const posts = await Post.find({ author: req.user._id }).select(
    'title viewsCount likesCount commentsCount createdAt featuredImage'
  );

  const currentPosts = posts.filter((p) => p.createdAt >= start);
  const previousPosts = posts.filter((p) => p.createdAt >= prevStart && p.createdAt < start);

  const current = {
    views: currentPosts.reduce((s, p) => s + (p.viewsCount || 0), 0),
    likes: currentPosts.reduce((s, p) => s + (p.likesCount || 0), 0),
    comments: currentPosts.reduce((s, p) => s + (p.commentsCount || 0), 0),
    posts: currentPosts.length,
  };
  const previous = {
    views: previousPosts.reduce((s, p) => s + (p.viewsCount || 0), 0),
    likes: previousPosts.reduce((s, p) => s + (p.likesCount || 0), 0),
    comments: previousPosts.reduce((s, p) => s + (p.commentsCount || 0), 0),
    posts: previousPosts.length,
  };

  const monthMode = days >= 365;
  const trendMap = buildTimeSeriesMap(days, monthMode);
  currentPosts.forEach((p) => {
    const d = new Date(p.createdAt);
    const key = monthMode
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      : d.toISOString().slice(0, 10);
    const row = trendMap.get(key);
    if (row) {
      row.views += p.viewsCount || 0;
      row.likes += p.likesCount || 0;
    }
  });

  const weeklyMap = new Map([
    ['Sun', { day: 'Ня', views: 0 }],
    ['Mon', { day: 'Да', views: 0 }],
    ['Tue', { day: 'Мя', views: 0 }],
    ['Wed', { day: 'Лх', views: 0 }],
    ['Thu', { day: 'Пү', views: 0 }],
    ['Fri', { day: 'Ба', views: 0 }],
    ['Sat', { day: 'Бя', views: 0 }],
  ]);
  currentPosts.forEach((p) => {
    const dayKey = new Date(p.createdAt).toUTCString().slice(0, 3);
    const row = weeklyMap.get(dayKey);
    if (row) row.views += p.viewsCount || 0;
  });

  const topPosts = [...currentPosts]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 5)
    .map((p) => ({
      id: p._id,
      title: p.title,
      views: p.viewsCount || 0,
      likes: p.likesCount || 0,
      image: p.featuredImage || '',
    }));

  const analytics = {
    overview: {
      views: {
        value: current.views,
        changePct: percentageChange(current.views, previous.views),
      },
      likes: {
        value: current.likes,
        changePct: percentageChange(current.likes, previous.likes),
      },
      comments: {
        value: current.comments,
        changePct: percentageChange(current.comments, previous.comments),
      },
      posts: {
        value: current.posts,
        changePct: percentageChange(current.posts, previous.posts),
      },
    },
    trends: Array.from(trendMap.values()),
    weekly: Array.from(weeklyMap.values()),
    topPosts,
    deviceData: [
      { name: 'Desktop', value: 55 },
      { name: 'Mobile', value: 35 },
      { name: 'Tablet', value: 10 },
    ],
    countryData: [
      { country: 'Монгол', views: Math.round(current.views * 0.72), percentage: 72 },
      { country: 'АНУ', views: Math.round(current.views * 0.12), percentage: 12 },
      { country: 'Солонгос', views: Math.round(current.views * 0.06), percentage: 6 },
      { country: 'Япон', views: Math.round(current.views * 0.04), percentage: 4 },
      { country: 'Бусад', views: Math.round(current.views * 0.06), percentage: 6 },
    ],
  };

  res.json({ success: true, data: analytics });
});

module.exports = {
  getDashboardSummary,
  getDashboardAnalytics,
};
