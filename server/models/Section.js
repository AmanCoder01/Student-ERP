// models/Section.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    name: { // e.g., "A", "B", or "CS-2A"
        type: String,
        required: true,
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Section', sectionSchema);
