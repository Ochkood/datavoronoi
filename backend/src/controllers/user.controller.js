const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

function sanitizeProfile(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    bio: user.bio || '',
    avatar: user.avatar || '',
    coverImage: user.coverImage || '',
    phone: user.phone || '',
    location: user.location || '',
    website: user.website || '',
    social: {
      twitter: user.social?.twitter || '',
      linkedin: user.social?.linkedin || '',
      facebook: user.social?.facebook || '',
      instagram: user.social?.instagram || '',
    },
    joinedAt: user.createdAt,
    lastActive: user.lastLoginAt || user.createdAt,
  };
}

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select('name email avatar role isActive createdAt lastLoginAt')
    .sort({ createdAt: -1 });

  const counts = await Post.aggregate([
    { $group: { _id: '$author', count: { $sum: 1 } } },
  ]);
  const postsByUser = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

  const items = users.map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
    avatar: u.avatar,
    role: u.role,
    isActive: u.isActive,
    joinedAt: u.createdAt,
    lastActive: u.lastLoginAt || u.createdAt,
    posts: postsByUser[String(u._id)] || 0,
  }));

  res.json({ success: true, data: { items } });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.body;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  if (role !== undefined) {
    const roles = ['user', 'publisher', 'admin'];
    if (!roles.includes(role)) {
      throw new ApiError(400, 'invalid role');
    }
    user.role = role;
  }

  if (isActive !== undefined) {
    if (typeof isActive !== 'boolean') {
      throw new ApiError(400, 'isActive must be boolean');
    }
    if (String(req.user._id) === String(user._id) && isActive === false) {
      throw new ApiError(400, 'You cannot suspend your own account');
    }
    user.isActive = isActive;
  }

  await user.save();

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        joinedAt: user.createdAt,
        lastActive: user.lastLoginAt || user.createdAt,
      },
    },
  });
});

const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  const [postStats] = await Post.aggregate([
    { $match: { author: user._id } },
    {
      $group: {
        _id: null,
        posts: { $sum: 1 },
        views: { $sum: '$viewsCount' },
        likes: { $sum: '$likesCount' },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      profile: sanitizeProfile(user),
      stats: {
        posts: postStats?.posts || 0,
        views: postStats?.views || 0,
        likes: postStats?.likes || 0,
      },
    },
  });
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    bio,
    avatar,
    coverImage,
    phone,
    location,
    website,
    social,
  } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  if (email && email !== user.email) {
    const exists = await User.findOne({ email });
    if (exists && String(exists._id) !== String(user._id)) {
      throw new ApiError(409, 'Email already in use');
    }
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (coverImage !== undefined) user.coverImage = coverImage;
  if (phone !== undefined) user.phone = phone;
  if (location !== undefined) user.location = location;
  if (website !== undefined) user.website = website;
  if (social !== undefined) {
    user.social = {
      twitter: social.twitter || '',
      linkedin: social.linkedin || '',
      facebook: social.facebook || '',
      instagram: social.instagram || '',
    };
  }

  await user.save();

  res.json({
    success: true,
    data: { profile: sanitizeProfile(user) },
  });
});

const changeMyPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    throw new ApiError(404, 'user not found');
  }

  const ok = await user.comparePassword(currentPassword);
  if (!ok) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

module.exports = {
  listUsers,
  updateUser,
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
};
