const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');
const { hasCloudinaryConfig, uploadImageBuffer } = require('../utils/cloudinary');

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

  if (!hasCloudinaryConfig()) {
    throw new ApiError(500, 'Cloudinary configuration is missing');
  }

  const normalizedBase = fileName.replace(/\.[^/.]+$/, '');
  const safeBase = normalizedBase
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

  const baseFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || 'datanews';
  const uploadFolder = `${baseFolder}/${folder}`;

  const result = await uploadImageBuffer(buffer, {
    folder: uploadFolder,
    public_id: safeBase,
    unique_filename: true,
    overwrite: false,
    use_filename: true,
    format: extension,
  });
  const url = result?.secure_url || result?.url;
  if (!url) {
    throw new ApiError(500, 'Failed to upload image');
  }

  res.status(201).json({ success: true, data: { url } });
});

module.exports = {
  uploadImage,
};
