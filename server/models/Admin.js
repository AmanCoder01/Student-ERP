const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        type: Date,
    },
    contact: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);