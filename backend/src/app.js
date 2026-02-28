const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const notFoundMiddleware = require('./middlewares/not-found.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return String(value || '').trim().replace(/\/+$/, '');
  }
}

function buildCorsMatchers() {
  const candidates = [
    process.env.CLIENT_URL,
    ...(process.env.CLIENT_URLS || '').split(','),
  ]
    .map((item) => String(item || '').trim())
    .filter(Boolean);

  return candidates.map((entry) => {
    if (entry.startsWith('*.')) {
      return { type: 'wildcard', suffix: entry.slice(1).toLowerCase() };
    }
    return { type: 'exact', value: normalizeOrigin(entry) };
  });
}

const corsMatchers = buildCorsMatchers();

function isAllowedOrigin(origin) {
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (corsMatchers.length === 0) return true;

  const normalizedOrigin = normalizeOrigin(origin);
  let hostname = '';
  try {
    hostname = new URL(normalizedOrigin).hostname.toLowerCase();
  } catch {
    hostname = '';
  }

  return corsMatchers.some((matcher) => {
    if (matcher.type === 'exact') {
      return normalizedOrigin === matcher.value;
    }
    return hostname.endsWith(matcher.suffix);
  });
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use('/api', routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
