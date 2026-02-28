const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const FEEDBACK_STATUSES = ['new', 'pending', 'in_progress', 'resolved'];
const DAY_MS = 24 * 60 * 60 * 1000;

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();
  return forwarded || req.ip || '';
}

function buildSearchFilter(q) {
  const query = String(q || '').trim();
  if (!query) return {};

  return {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { subject: { $regex: query, $options: 'i' } },
      { message: { $regex: query, $options: 'i' } },
    ],
  };
}

const createFeedback = asyncHandler(async (req, res) => {
  const { name, email, subject, message, type } = req.body;
  const clientIp = getClientIp(req);
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 255);
  const now = new Date();
  const cooldownMs = Number(process.env.FEEDBACK_IP_COOLDOWN_MS) || 60 * 1000;
  const duplicateWindowMs = Number(process.env.FEEDBACK_DUP_WINDOW_MS) || DAY_MS;
  const dailyMax = Number(process.env.FEEDBACK_IP_DAILY_MAX) || 30;

  const [latestByIp, ipDailyCount, duplicate] = await Promise.all([
    Feedback.findOne({ sourceIp: clientIp }).sort({ createdAt: -1 }).select('createdAt'),
    Feedback.countDocuments({
      sourceIp: clientIp,
      createdAt: { $gte: new Date(now.getTime() - DAY_MS) },
    }),
    Feedback.findOne({
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: { $gte: new Date(now.getTime() - duplicateWindowMs) },
    }).select('_id'),
  ]);

  if (latestByIp?.createdAt) {
    const elapsed = now.getTime() - new Date(latestByIp.createdAt).getTime();
    if (elapsed < cooldownMs) {
      throw new ApiError(429, 'Please wait before sending another feedback.');
    }
  }

  if (ipDailyCount >= dailyMax) {
    throw new ApiError(429, 'Daily feedback limit reached. Please try tomorrow.');
  }

  if (duplicate) {
    throw new ApiError(409, 'Duplicate feedback detected.');
  }

  const feedback = await Feedback.create({
    name,
    email: email.trim().toLowerCase(),
    subject: subject.trim(),
    message: message.trim(),
    type: type || 'feedback',
    status: 'new',
    sourceIp: clientIp,
    userAgent,
  });

  res.status(201).json({
    success: true,
    data: { feedback },
  });
});

const listAdminFeedback = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    q,
    type = 'all',
    status = 'all',
  } = req.query;

  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const baseFilter = {
    ...buildSearchFilter(q),
  };
  if (type !== 'all') {
    baseFilter.type = type;
  }

  const listFilter = { ...baseFilter };
  if (status !== 'all') {
    listFilter.status = status;
  }

  const [items, total, statsRows] = await Promise.all([
    Feedback.find(listFilter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
    Feedback.countDocuments(listFilter),
    Feedback.aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const stats = FEEDBACK_STATUSES.reduce(
    (acc, key) => ({ ...acc, [key]: 0 }),
    {}
  );
  statsRows.forEach((row) => {
    if (row && row._id && Object.prototype.hasOwnProperty.call(stats, row._id)) {
      stats[row._id] = row.count || 0;
    }
  });

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1,
      },
      stats,
    },
  });
});

const updateFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, replyMessage } = req.body;

  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new ApiError(404, 'feedback not found');
  }

  if (status !== undefined) feedback.status = status;
  if (replyMessage !== undefined) {
    feedback.replyMessage = replyMessage;
    feedback.replySentAt = replyMessage ? new Date() : undefined;
  }

  await feedback.save();

  res.json({
    success: true,
    data: { feedback },
  });
});

const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new ApiError(404, 'feedback not found');
  }

  await feedback.deleteOne();

  res.json({
    success: true,
    message: 'feedback deleted',
  });
});

module.exports = {
  createFeedback,
  listAdminFeedback,
  updateFeedback,
  deleteFeedback,
};
