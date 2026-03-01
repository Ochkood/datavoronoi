const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    throw new ApiError(401, 'Unauthorized');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    if (err?.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired');
    }
    throw new ApiError(401, 'Invalid token');
  }
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new ApiError(401, 'Invalid token');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'User is suspended');
  }

  req.user = user;
  next();
});

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { protect, requireRole };
