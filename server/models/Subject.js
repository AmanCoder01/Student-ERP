const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { // e.g., "Data Structures and Algorithms"
        type: String,
        required: true,
    },
    subjectCode: {
        type: String,
        required: true,
        unique: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    credits: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Subject', subjectSchema);