const express = require('express');

const User = require('../models/User');

const { login, logout, updatePassword, getProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/login', login);
router.get('/logout', logout);

router.put('/update-password', protect, updatePassword);

router.get('/get-profile', protect, getProfile);
module.exports = router;