const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    rollNumber: {
        type: String,
        unique: true
    },
    profileImage: {
        public_id: String,
        url: String,
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    },
    semester: Number,
    phone: {
        type: String
    },
    guardian: {
        name: String,
        phone: String
    },
    address: String,
    dob: Date
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema); // Mongoose uses lowercase plural name 'students'