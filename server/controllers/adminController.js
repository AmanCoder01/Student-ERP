const Student = require('../models/Student');
const Department = require('../models/Department');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Section = require('../models/Section');
const Batch = require('../models/Batch');
const Teacher = require('../models/Teacher');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { default: mongoose } = require('mongoose');


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
// exports.createTeacher = async (req, res) => {

//     const { name, email, teacherId, department, designation, qualification, contactNumber, subjects } = req.body;

//     console.log(req.body);

//     if (!name || !email || !teacherId || !department || !designation || !qualification || !contactNumber || !subjects) {
//         return res.status(404).json({
//             success: false,
//             message: "All fields are required"
//         })
//     }


//     try {
//         // Generate a random temporary password
//         const password = crypto.randomBytes(8).toString('hex');

//         // 1. Create the Teacher profile
//         const teacherProfile = await Teacher.create({
//             name,
//             teacherId,
//             designation,
//             department,
//             qualification,
//             joiningDate: Date.now(),
//             contactNumber,
//             subjects
//         });

//         // 2. Create the User login
//         const user = await User.create({
//             email,
//             password, // Password will be hashed automatically by the pre-save hook
//             role: 'Teacher',
//             profileId: teacherProfile._id
//         });

//         // 3. Link the user account back to the teacher profile
//         teacherProfile.user = user._id;
//         await teacherProfile.save();

//         // 4. Send the welcome email with credentials
//         const message = `Welcome to the College ERP! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and update your password immediately.`;

//         await sendEmail({
//             email: user.email,
//             subject: 'Your Teacher Account Credentials',
//             message
//         });

//         res.status(201).json({ success: true, teacherProfile });

//     } catch (error) {
//         console.error(error.message);
//         // Add more robust error handling for duplicates (email/employeeId)
//         res.status(400).json({ success: false, message: error.message });
//     }
// };

// controllers/adminController.js

exports.createTeacher = async (req, res) => {
    console.log("hei");

    // Text fields are in req.body
    const { name, email, teacherId, department, designation, qualification, contactNumber, subjects } = req.body;

    // The uploaded file's info is in req.file
    const profileImage = req.file;

    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    // Your validation should now work correctly
    if (!name || !email || !teacherId || !department || !subjects) {
        return res.status(400).json({ // Use 400 for bad request
            success: false,
            message: "Required fields are missing"
        });
    }

    try {
        const teacherData = {
            name,
            teacherId,
            designation,
            department,
            qualification,
            joiningDate: new Date(),
            contactNumber,
            // subjects: Array.isArray(subjects) ? subjects : [subjects] // Ensure subjects is an array
            subjects
        };

        // Here you would typically upload the file from req.file.buffer
        // to a cloud service like Cloudinary and get a URL back.
        // For now, we'll just simulate it.
        if (req.file) {
            // 2. Add the URL and public_id from Cloudinary to your teacher data
            teacherData.profileImage = {
                public_id: req.file.filename, // This is the public_id
                url: req.file.path          // This is the secure URL
            };
        }

        const teacherProfile = await Teacher.create(teacherData);

        const password = crypto.randomBytes(8).toString('hex');


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

        res.status(201).json({
            success: true,
            message: "Teacher created successfully!",
            teacherProfile
        });

    } catch (error) {
        console.error(error);
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
            dob
        } = req.body;

        const password = crypto.randomBytes(8).toString('hex');

        let profileImage;


        if (req.file) {
            profileImage = {
                public_id: req.file.filename,
                url: req.file.path
            };
        }



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


        const user = await User.create({
            email,
            password,
            role: "Student",
            profileId: studentProfile._id
        });

        studentProfile.user = user._id;
        await studentProfile.save();

        const message = `Welcome to the College ERP! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and update your password immediately.`;


        await sendEmail({
            email: user.email,
            subject: 'Your Student Account Credentials',
            message
        });



        res.status(201).json({
            success: true,
            message: 'Student created and email sent',
            data: studentProfile
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
};



// exports.getStudents = async (req, res) => {
//     try {
//         const students = await Student.find()
//             .populate("user section")
//             .populate({
//                 path: "batch",
//                 populate: {
//                     path: "course",
//                     populate: {
//                         path: "department"
//                     }
//                 }
//             });

//         return res.status(200).json({ success: true, students });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: "Failed to fetch students" });
//     }
// };

exports.getStudents = async (req, res) => {
    try {
        // query params
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
        const search = (req.query.search || '').trim();

        // build filter
        let filter = {};
        if (search) {
            const regex = new RegExp(search, 'i'); // case-insensitive
            filter = {
                $or: [
                    { name: regex },
                    { studentId: regex },
                    { rollNumber: regex }
                ]
            };
        }

        // total count for filter
        const total = await Student.countDocuments(filter);

        // fetch page
        const students = await Student.find(filter)
            .populate('user section')
            .populate({
                path: 'batch',
                populate: {
                    path: 'course',
                    populate: {
                        path: 'department'
                    }
                }
            })
            .sort({ name: 1 }) // optional: sort by name
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const pages = Math.ceil(total / limit);

        return res.status(200).json({
            success: true,
            students,
            total,
            page,
            pages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch students' });
    }
};



exports.bulkUploadStudents = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'CSV file is required' });
    }

    const filePath = req.file.path;
    const results = [];
    const errors = [];
    let createdCount = 0;
    let rowIndex = 1; // header row is 1, first data row => 2 (but we'll start counting from 1 for simplicity)

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv({ mapHeaders: ({ header }) => header.trim() })) // trim headers
                .on('data', (row) => {
                    // store raw row and index for later processing
                    results.push({ row, rowIndex: ++rowIndex });
                })
                .on('end', () => resolve())
                .on('error', (err) => reject(err));
        });

        // Process rows sequentially to simplify resource usage and email sending.
        // For performance, you can use concurrency with throttling (Promise.all with limit).
        for (const { row, rowIndex } of results) {
            // Extract and sanitise fields (case-insensitive header names)
            const get = (key) => {
                // csv-parser lowercases header? to be safe, try several variants
                return (row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()] ?? '').toString().trim();
            };

            const studentId = get('studentId') || get('student_id');
            const name = get('name');
            const email = get('email');
            const rollNumber = get('rollNumber') || get('roll_number');
            const batch = get('batch');
            const section = get('section');
            const semester = get('semester');
            const phone = get('phone');
            const guardianName = get('guardianName') || get('guardian_name');
            const guardianPhone = get('guardianPhone') || get('guardian_phone');
            const address = get('address');
            const dob = get('dob');
            const profileImageUrl = get('profileImageUrl') || get('profile_image_url');

            // Basic validation
            if (!studentId || !name || !email) {
                errors.push({ row: rowIndex, message: 'Missing required field (studentId/name/email)', row });
                continue;
            }



            try {
                // Check duplicates: studentId or email
                const existingStudent = await Student.findOne({ studentId });
                const existingUser = await User.findOne({ email });

                if (existingStudent) {
                    errors.push({ row: rowIndex, message: `Student with studentId ${studentId} already exists` });
                    continue;
                }
                if (existingUser) {
                    errors.push({ row: rowIndex, message: `User with email ${email} already exists` });
                    continue;
                }

                // Prepare guardian object
                const guardian = {
                    name: guardianName || undefined,
                    phone: guardianPhone || undefined
                };

                let batchId = batch;
                let sectionId = section;

                // 🔹 1. Resolve batch (by ID or name)
                if (batch && !mongoose.isValidObjectId(batch)) {
                    const foundBatch = await Batch.findOne({ name: batch });
                    if (foundBatch) batchId = foundBatch._id;
                    else {
                        console.warn(`Batch not found for name: ${batch}`);
                        errors.push({ row: rowIndex, message: `Batch not found: ${batch}` });
                        continue; // skip this student
                    }
                }

                // 🔹 2. Resolve section — but make sure it belongs to the same batch
                if (section) {
                    if (!mongoose.isValidObjectId(section)) {
                        // Find the section by name AND batch
                        const foundSection = await Section.findOne({
                            name: section,
                            batch: batchId, // 👈 ensures correct relationship
                        });
                        if (foundSection) sectionId = foundSection._id;
                        else {
                            console.warn(`Section '${section}' not found in batch '${batch}'`);
                            errors.push({ row: rowIndex, message: `Section '${section}' not found in batch '${batch}'` });
                            continue; // skip this student if mismatch
                        }
                    } else {
                        // If section is already an ObjectId, validate that it belongs to batchId
                        const foundSection = await Section.findById(section);
                        if (foundSection && foundSection.batch.toString() === batchId.toString()) {
                            sectionId = foundSection._id;
                        } else {
                            console.warn(`Section ${section} does not belong to batch ${batch}`);
                            errors.push({ row: rowIndex, message: `Section does not belong to batch` });
                            continue;
                        }
                    }
                }

                // Convert dob to valid format if it's in DD-MM-YYYY
                let formattedDob = undefined;
                if (dob) {
                    // Detect if format is DD-MM-YYYY
                    if (/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
                        const [day, month, year] = dob.split('-');
                        formattedDob = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
                    } else {
                        formattedDob = dob; // Assume already valid
                    }
                }

                // Create Student
                const studentPayload = {
                    name,
                    studentId,
                    rollNumber: rollNumber || undefined,
                    batch: batchId || undefined,       // expect id, else implement lookup
                    section: sectionId || undefined,
                    semester: semester ? Number(semester) : undefined,
                    phone: phone || undefined,
                    guardian,
                    address: address || undefined,
                    dob: formattedDob || undefined,
                    profileImage: profileImageUrl ? { public_id: null, url: profileImageUrl } : undefined
                };

                const studentDoc = await Student.create(studentPayload);

                // Create user with random password
                const password = crypto.randomBytes(8).toString('hex');

                const userDoc = await User.create({
                    email,
                    password,
                    role: 'Student',
                    profileId: studentDoc._id
                });

                // Link students <-> user
                studentDoc.user = userDoc._id;
                await studentDoc.save();

                // send welcome email (this can be slow; if file is large consider queuing)
                const message = `Welcome to the College ERP! Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login and update your password immediately.`;
                try {
                    await sendEmail({ email: userDoc.email, subject: 'Your Student Account Credentials', message });
                } catch (emailErr) {
                    // do not stop the entire import on email errors — record and continue
                    errors.push({ row: rowIndex, message: `Email send failed for ${email}: ${emailErr.message}` });
                }

                createdCount++;
            } catch (errRow) {
                // catch per-row errors and continue
                errors.push({ row: rowIndex, message: errRow.message });
                console.error(`Error processing row ${rowIndex}:`, errRow);
            }
        }

        // done processing
        // cleanup uploaded file
        fs.unlink(filePath, (err) => {
            if (err) console.warn('Failed to delete tmp csv', err);
        });

        return res.status(200).json({
            success: true,
            createdCount,
            errors,
        });

    } catch (err) {
        console.error(err);
        // cleanup
        try { fs.unlinkSync(filePath); } catch (e) { }
        return res.status(500).json({ success: false, message: 'Failed to process CSV', error: err.message });
    }
};




