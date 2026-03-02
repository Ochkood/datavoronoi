const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const DAY_MS = 24 * 60 * 60 * 1000;

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim();
  return forwarded || req.ip || '';
}

function validateEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return ok ? email : '';
}

const subscribeNewsletter = asyncHandler(async (req, res) => {
  const email = validateEmail(req.body?.email);
  const source = String(req.body?.source || 'sidebar').slice(0, 64);

  if (!email) {
    throw new ApiError(400, 'Valid email is required');
  }

  const clientIp = getClientIp(req);
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 255);
  const now = new Date();
  const cooldownMs = Number(process.env.NEWSLETTER_IP_COOLDOWN_MS) || 20 * 1000;
  const dailyMax = Number(process.env.NEWSLETTER_IP_DAILY_MAX) || 100;

  const [latestByIp, ipDailyCount] = await Promise.all([
    NewsletterSubscriber.findOne({ sourceIp: clientIp })
      .sort({ createdAt: -1 })
      .select('createdAt'),
    NewsletterSubscriber.countDocuments({
      sourceIp: clientIp,
      createdAt: { $gte: new Date(now.getTime() - DAY_MS) },
    }),
  ]);

  if (latestByIp?.createdAt) {
    const elapsed = now.getTime() - new Date(latestByIp.createdAt).getTime();
    if (elapsed < cooldownMs) {
      throw new ApiError(429, 'Please wait before subscribing again.');
    }
  }

  if (ipDailyCount >= dailyMax) {
    throw new ApiError(429, 'Daily subscription limit reached.');
  }

  const existing = await NewsletterSubscriber.findOne({ email });

  if (existing) {
    if (existing.status !== 'active') {
      existing.status = 'active';
    }
    existing.source = source;
    existing.sourceIp = clientIp;
    existing.userAgent = userAgent;
    existing.subscribedAt = now;
    await existing.save();

    return res.json({
      success: true,
      data: {
        subscriber: existing,
        alreadySubscribed: true,
      },
    });
  }

  const subscriber = await NewsletterSubscriber.create({
    email,
    status: 'active',
    source,
    sourceIp: clientIp,
    userAgent,
    subscribedAt: now,
  });

  res.status(201).json({
    success: true,
    data: {
      subscriber,
      alreadySubscribed: false,
    },
  });
});

const listAdminNewsletterSubscribers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, q = '', status = 'all' } = req.query;

  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {};
  const query = String(q || '').trim();

  if (query) {
    filter.email = { $regex: query, $options: 'i' };
  }

  if (status !== 'all') {
    filter.status = status;
  }

  const [items, total] = await Promise.all([
    NewsletterSubscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),
    NewsletterSubscriber.countDocuments(filter),
  ]);

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
    },
  });
});

function escapeCsv(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

const exportAdminNewsletterSubscribersCsv = asyncHandler(async (req, res) => {
  const { q = '', status = 'all' } = req.query;

  const filter = {};
  const query = String(q || '').trim();
  if (query) {
    filter.email = { $regex: query, $options: 'i' };
  }
  if (status !== 'all') {
    filter.status = status;
  }

  const items = await NewsletterSubscriber.find(filter)
    .sort({ createdAt: -1 })
    .select('email status source subscribedAt createdAt');

  const header = ['email', 'status', 'source', 'subscribedAt', 'createdAt'];
  const rows = items.map((item) => [
    escapeCsv(item.email),
    escapeCsv(item.status),
    escapeCsv(item.source || ''),
    escapeCsv(item.subscribedAt ? new Date(item.subscribedAt).toISOString() : ''),
    escapeCsv(item.createdAt ? new Date(item.createdAt).toISOString() : ''),
  ]);

  const csv = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const filename = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(`\ufeff${csv}`);
});

module.exports = {
  subscribeNewsletter,
  listAdminNewsletterSubscribers,
  exportAdminNewsletterSubscribersCsv,
};
