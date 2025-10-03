const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: {
        type: String, required: true
    },
    teacherId: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    qualification: {
        type: String
    },
    joiningDate: {
        type: Date
    },
    contactNumber: {
        type: String
    },
    profileImage: {
        public_id: String,
        url: String,
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    }],
    // Link back to the main User model for login
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Teacher', teacherSchema); // Mongoose uses lowercase plural name 'teachers'
