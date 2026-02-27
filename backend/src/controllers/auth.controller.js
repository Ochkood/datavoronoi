const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokens');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  bio: user.bio,
  avatar: user.avatar,
  coverImage: user.coverImage,
  phone: user.phone,
  location: user.location,
  website: user.website,
  social: user.social,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, password are required');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create({ name, email, password, lastLoginAt: new Date() });
  const accessToken = generateAccessToken({ userId: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is suspended');
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = generateAccessToken({ userId: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user._id });

  user.refreshToken = refreshToken;
  user.lastLoginAt = new Date();
  await user.save();

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'refreshToken is required');
  }

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.userId).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is suspended');
  }

  const accessToken = generateAccessToken({ userId: user._id, role: user.role });

  res.json({ success: true, data: { accessToken } });
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    const decoded = jwt.decode(refreshToken);
    if (decoded?.userId) {
      await User.findByIdAndUpdate(decoded.userId, { $unset: { refreshToken: 1 } });
    }
  }

  res.json({ success: true, message: 'Logged out' });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: sanitizeUser(req.user) } });
});

module.exports = { register, login, refresh, logout, me };
