const express = require('express');
const { register, login, refresh, logout, me } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refresh);
router.post('/logout', logout);
router.get('/me', protect, me);

module.exports = router;
