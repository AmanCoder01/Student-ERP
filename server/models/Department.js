const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true
    },
    hod: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, { timestamps: true });

module.exports = mongoose.model('Department', DepartmentSchema);
