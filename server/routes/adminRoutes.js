const express = require('express');


const { protect, authorize } = require('../middlewares/authMiddleware');
const { getDashboardStats, addDepartment, getDepartments, createCourse, getCourses, createBatch, getBatches, createSection, getSections, createSubject, getSubjects, createTeacher, getTeachers, createStudent, getStudents, createNotice, deleteDepartment, deleteCourses, deleteBatch, deleteSubject, deleteSection, deleteTeacher } = require('../controllers/adminController');

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(protect);
router.use(authorize('Admin'));

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Department
router.post('/departments', addDepartment);
router.get('/departments', getDepartments);
router.delete('/departments/:id', deleteDepartment);


// Course
router.post('/courses', createCourse);
router.get('/courses', getCourses);
router.delete('/courses/:id', deleteCourses);



// Batch
router.post("/batches", createBatch);
router.get("/batches", getBatches);
router.delete("/batches/:id", deleteBatch);



// Section
router.post("/sections", createSection);
router.get("/sections", getSections);
router.delete("/sections/:id", deleteSection);



// Subject
router.post("/subjects", createSubject);
router.get("/subjects", getSubjects);
router.delete("/subjects/:id", deleteSubject);


// Teacher
router.post("/teachers", createTeacher);
router.get("/teachers", getTeachers);
router.delete("/teachers/:id", deleteTeacher);




// Student
router.post('/students', createStudent);
router.get("/students", getStudents);


// Notice
// router.post('/notices', createNotice);

module.exports = router;