const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department', required: true
    },
    durationYears: Number,
    totalSemesters: Number
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
