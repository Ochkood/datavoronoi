const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const extensionByMime = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const uploadImage = asyncHandler(async (req, res) => {
  const { fileName, mimeType, dataBase64, folder } = req.body;

  const extension = extensionByMime[mimeType];
  if (!extension) {
    throw new ApiError(400, 'Unsupported image type');
  }

  const buffer = Buffer.from(dataBase64, 'base64');
  if (!buffer || buffer.length === 0) {
    throw new ApiError(400, 'Invalid image payload');
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new ApiError(400, 'Image is too large. Max 5MB');
  }

  const normalizedBase = path.basename(fileName, path.extname(fileName));
  const safeBase = normalizedBase
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

  const targetDir = path.join(__dirname, `../../uploads/${folder}`);
  await fs.mkdir(targetDir, { recursive: true });

  const uniqueName = `${Date.now()}-${crypto.randomUUID()}-${safeBase}.${extension}`;
  const absolutePath = path.join(targetDir, uniqueName);

  await fs.writeFile(absolutePath, buffer);

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${folder}/${uniqueName}`;

  res.status(201).json({ success: true, data: { url } });
});

module.exports = {
  uploadImage,
};
