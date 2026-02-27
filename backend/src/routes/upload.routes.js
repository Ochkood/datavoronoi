const express = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { uploadImageSchema } = require('../validators/upload.validator');

const router = express.Router();

router.post('/image', protect, validate(uploadImageSchema), uploadImage);

module.exports = router;
