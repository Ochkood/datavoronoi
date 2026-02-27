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

app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
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
