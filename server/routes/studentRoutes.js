const express = require('express');
const { getMyAttendance, getNotices, updateProfile, getProfile, getAttendance } = require('../controllers/studentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../utils/cloudinary'); // Reuse the same upload middleware

const router = express.Router();

// Protect and authorize all routes in this file for 'student' role
router.use(protect);
router.use(authorize('student'));

// router.get('/notices', getNotices);
router.put('/profile', upload.single('imageUrl'), updateProfile);

router.get("/profile/:studentId", getProfile);
router.get("/attendance/:studentId", getAttendance);

module.exports = router;
