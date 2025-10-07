const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const Batch = require('../models/Batch');
const Section = require('../models/Section');


// @desc    Get dashboard stats for teacher
// @route   GET /api/teacher/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const teacher = await Teacher.findOne({ user: req.user._id });

        // Get today's date (start and end)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get attendance statistics
        const [totalClasses, todayClasses, recentAttendance] = await Promise.all([
            Attendance.countDocuments({ teacher: teacher._id }),
            Attendance.countDocuments({
                teacher: teacher._id,
                date: { $gte: today, $lt: tomorrow }
            }),
            Attendance.find({ teacher: teacher._id })
                .sort({ date: -1 })
                .limit(5)
                .populate('subject section')
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalClasses,
                todayClasses,
                recentAttendance,
                teacherInfo: {
                    name: teacher.name,
                    department: teacher.department
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Get unique courses taught by the logged-in teacher
// @route   GET /api/teacher/my-courses
exports.getTeacherCourses = async (req, res) => {
    try {
        // req.user.profileId comes from your auth middleware after decoding token
        const teacher = await Teacher.findById(req.user.profileId).populate({
            path: 'subjects',
            populate: {
                path: 'course',
                model: 'Course'
            }
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Use a Map to get unique courses
        const courseMap = new Map();
        teacher.subjects.forEach(subject => {
            if (subject.course) {
                courseMap.set(subject.course._id.toString(), subject.course);
            }
        });

        const courses = Array.from(courseMap.values());
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Get subjects and batches for a selected course
// @route   GET /api/teacher/course-details/:courseId
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1. Find subjects the teacher teaches FOR THIS COURSE ONLY
        const teacher = await Teacher.findById(req.user.profileId, 'subjects');
        const subjects = await Subject.find({
            _id: { $in: teacher.subjects },
            course: courseId
        });

        // 2. Find all batches for that course
        const batches = await Batch.find({ course: courseId });

        res.json({ subjects, batches });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Get sections and current semester for a selected batch
// @route   GET /api/teacher/batch-details/:batchId
exports.getBatchDetails = async (req, res) => {
    try {
        const { batchId } = req.params;

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }
        const sections = await Section.find({ batch: batchId });

        res.json({ currentSemester: batch.currentSemester, sections });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Get students for a selected section
// @route   GET /api/teacher/section-students/:sectionId
exports.getSectionStudents = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const students = await Student.find({ section: sectionId }).select('name studentId rollNumber');
        
        console.log(students);
        
        res.json(students);
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


// @desc    Submit attendance
// @route   POST /api/teacher/attendance
exports.submitAttendance = async (req, res) => {
    try {
        const { course, batch, semester, section, subject, contentTitle, students } = req.body;

        const newAttendance = new Attendance({
            teacher: req.user.profileId,
            course,
            batch,
            semester,
            section,
            subject,
            contentTitle,
            students // expects array of [{ student: 'studentId', status: 'Present' }]
        });

        await newAttendance.save();
        res.status(201).json({ message: 'Attendance submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



exports.getStudentAttendance = async (req, res) => {
    try {
        const { studentId, subjectId } = req.body;
        const teacherId = req.user.profileId;

        if (!studentId || !subjectId) {
            return res.status(400).json({ message: 'Student ID and Subject ID are required.' });
        }

        // 1. Find the student and subject details for the response
        const [student, subject] = await Promise.all([
            Student.findById(studentId).select('name studentId rollNumber'),
            Subject.findById(subjectId).select('name code')
        ]);

        if (!student || !subject) {
            return res.status(404).json({ message: 'Student or Subject not found.' });
        }

        // 2. Find all attendance records for this subject taken by this teacher
        const totalClasses = await Attendance.find({
            teacher: teacherId,
            subject: subjectId
        });

        const totalClassesCount = totalClasses.length;

        if (totalClassesCount === 0) {
            return res.json({
                student,
                subject,
                totalClasses: 0,
                attendedClasses: 0,
                percentage: 0
            });
        }

        // 3. Count how many of those classes the student was present for
        let attendedClassesCount = 0;
        for (const record of totalClasses) {
            const studentRecord = record.students.find(s => s.student.toString() === studentId);
            if (studentRecord && studentRecord.status === 'Present') {
                attendedClassesCount++;
            }
        }

        // 4. Calculate the percentage
        const percentage = (attendedClassesCount / totalClassesCount) * 100;

        res.json({
            student,
            subject,
            totalClasses: totalClassesCount,
            attendedClasses: attendedClassesCount,
            percentage: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get attendance history for the teacher
// @route   GET /api/teacher/attendance/history
exports.getAttendanceHistory = async (req, res) => {
    try {
        const history = await Attendance.find({ teacher: req.user.profileId })
            .populate('course', 'name')
            .populate('subject', 'name')
            .populate('batch', 'name')
            .sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};