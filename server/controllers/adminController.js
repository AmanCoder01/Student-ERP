const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Department = require('../models/Department');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Section = require('../models/Section');
const Batch = require('../models/Batch');


// @route   GET /api/admin/dashboard
exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalDepartments = await Department.countDocuments();
        const totalCourses = await Course.countDocuments();

        res.json({
            totalStudents,
            totalTeachers,
            totalDepartments,
            totalCourses
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

// @route   POST /api/admin/departments
exports.addDepartment = async (req, res) => {
    try {

        const { name, code } = req.body;

        if (!name || !code) {
            return res.status(400).json({ success: false, message: 'Department name is required' });
        }
        const department = await Department.create({ name, code });

        res.status(201).json({
            success: true, message: 'Department added',
            department
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};


// @route   GET /api/admin/departments
exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @route   GET /api/admin/departments
exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        return res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// @route   GET /api/admin/departments/:id
exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// @route   POST /api/admin/courses
exports.createCourse = async (req, res) => {
    try {
        const { name, code, department, durationYears, totalSemesters } = req.body;

        // Check if course already exists
        const existingCourse = await Course.findOne({
            name,
            code
        });

        if (existingCourse) {
            return res.status(400).json({ message: "Course already exists in this department" });
        }

        const course = await Course.create({
            name,
            code,
            department,
            durationYears,
            totalSemesters
        })

        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Error creating course", error: error.message });
    }
};


// @route   GET /api/admin/courses
exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("department", "name"); // show dept name
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};

// @route   GET /api/admin/courses
exports.deleteCourses = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        return res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// @desc    Get course by ID
// @route   GET /api/admin/courses/:id
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("department", "name");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
    }
};


// @desc    Update a course
// @route   PUT /api/admin/courses/:id
exports.updateCourse = async (req, res) => {
    try {
        const { name, department, durationInYears, semesters, description } = req.body;

        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { name, department, durationInYears, semesters, description },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error: error.message });
    }
};


exports.createBatch = async (req, res) => {
    try {

        const { courseId, currentSemester, name, startYear, endYear } = req.body;

        const batch = await Batch.create({
            course: courseId,
            name,
            currentSemester,
            startYear,
            endYear
        })

        res.json({
            success: true, message: 'Batch created',
            batch
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.getBatches = async (req, res) => {
    try {
        const batch = await Batch.find().populate("course");

        return res.json(batch);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteBatch = async (req, res) => {
    try {

        const batch = await Batch.findByIdAndDelete(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }
        return res.json({ message: 'Batch deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};




exports.createSection = async (req, res) => {
    try {
        const { name, batch } = req.body;

        const sec = await Section.create({
            name,
            batch
        })

        res.json({
            success: true, message: 'Section created',
            sec
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getSections = async (req, res) => {
    try {
        const section = await Section.find().populate({
            path: "batch", // The field to populate in the Section model
            populate: {
                path: "course" // The field to populate in the Batch model
            }
        });

        return res.json(section);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        return res.json({ message: 'Section deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};




// @route   POST /api/admin/subjects
exports.createSubject = async (req, res) => {
    try {
        const { name, subjectCode, course, semester, credits } = req.body;

        if (!name || !subjectCode || !course) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const subject = await Subject.create({
            name,
            subjectCode,
            course,
            semester,
            credits
        });
        res.status(201).json({
            success: true, message: 'Subject created',
            subject
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.getSubjects = async (req, res) => {
    try {
        return res.json(await Subject.find().populate("course"));
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.deleteSubject = async (req, res) => {
    try {

        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        return res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};


// @route   POST /api/admin/teachers
exports.createTeacher = async (req, res) => {
    const { name, email, teacherId, department, designation, qualification, contactNumber, subjects } = req.body;



    try {
        // Generate a random temporary password
        const password = crypto.randomBytes(8).toString('hex');

        // 1. Create the Teacher profile
        const teacherProfile = await Teacher.create({
            name,
            teacherId,
            department,
            contactNumber,
            designation,
            qualification,
            joiningDate: Date.now(),
            subjects
        });

        // 2. Create the User login
        const user = await User.create({
            email,
            password, // Password will be hashed automatically by the pre-save hook
            role: 'Teacher',
            profileId: teacherProfile._id
        });

        // 3. Link the user account back to the teacher profile
        teacherProfile.user = user._id;
        await teacherProfile.save();

        // 4. Send the welcome email with credentials
        const message = `Welcome to the College ERP! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and update your password immediately.`;

        await sendEmail({
            email: user.email,
            subject: 'Your Teacher Account Credentials',
            message
        });

        res.status(201).json({ success: true, data: teacherProfile });

    } catch (error) {
        console.error(error);
        // Add more robust error handling for duplicates (email/employeeId)
        res.status(400).json({ success: false, message: error.message });
    }
};


exports.getTeachers = async (req, res) => {
    try {
        return res.json(await Teacher.find().populate("department subjects"));
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });

    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        return res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.log(error);

        res.status(400).json({ success: false, message: error.message });
    }
};




// @desc    Create a new student
// @route   POST /api/admin/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            studentId,
            rollNumber,
            phone,
            batch,
            section,
            semester,
            guardian,
            address,
            dob,
            profileImage
        } = req.body;

        // Generate a random temporary password
        const password = crypto.randomBytes(8).toString('hex');

        // 1. Create the Student profile
        const studentProfile = await Student.create({
            name,
            studentId,
            rollNumber,
            batch,
            section,
            semester,
            phone,
            guardian,
            address,
            dob,
            profileImage
        });

        // 2. Create the User login
        const user = await User.create({
            email,
            password,
            role: "student",
            profileId: studentProfile._id
        });

        // 3. Link the user account back to the student profile
        studentProfile.user = user._id;
        await studentProfile.save();

        // 4. Send welcome email
        const message = `Welcome to the College ERP! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and update your password immediately.`;

        await sendEmail({
            email: user.email,
            subject: 'Your Student Account Credentials',
            message
        });

        res.status(201).json({ success: true, message: 'Student created and email sent', data: studentProfile });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message });
    }
};



exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("user batch section"); // Populate actual references

        return res.status(200).json({ success: true, students });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch students" });
    }
};



