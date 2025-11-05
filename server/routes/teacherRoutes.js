const express = require('express');

const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../utils/cloudinary');
const { getDashboardStats, getTeacherSubjects, fetchStudentsForAttendance, submitAttendance, getTeacherBatches, getTeacherSections, getAttendanceHistory, getTeacherCourses, getCourseDetails, getBatchDetails, getSectionStudents, getStudentAttendance } = require('../controllers/teacherController');
const router = express.Router();

// Protect and authorize all routes in this file for 'teacher' role
router.use(protect);
router.use(authorize('Teacher'));

// GET /api/teacher/dashboard
router.get('/dashboard', getDashboardStats);

// 1. Get all unique courses the teacher teaches
router.get('/my-courses', getTeacherCourses);

// 2. Get subjects (taught by teacher) and batches for a selected course
router.get('/course-details/:courseId', getCourseDetails);

// 3. Get sections and current semester for a selected batch
router.get('/batch-details/:batchId', getBatchDetails);


// 4. Get students for a selected section
router.get('/section-students/:sectionId', getSectionStudents);

// 5. Submit the final attendance record
router.post('/attendance', submitAttendance);

router.post('/student-attendance', getStudentAttendance);

// (Bonus) Get attendance history for the teacher
router.get('/attendance/history', getAttendanceHistory);

router.get('/my-subjects', getTeacherSubjects);

module.exports = router;
