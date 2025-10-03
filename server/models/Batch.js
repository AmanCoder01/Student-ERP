const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    startYear: {
        type: Number,
        required: true
    },
    endYear: {
        type: Number,
        required: true
    },
    currentSemester: { // Add this field
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Batch", batchSchema)