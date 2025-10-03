const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
    semester: Number,
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    contentTitle: String, // today's lecture topic
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        status: {
            type: String,
            enum: ['Present', 'Absent']
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);