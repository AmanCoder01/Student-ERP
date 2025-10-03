const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');

// Dashboard: subjects + timetable + notices
exports.getDashboard = async (req, res) => {
  const today = new Date();
  const day = today.toLocaleString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);

  const myClasses = await ClassModel.find({ students: req.user._id })
    .populate('subject teacher');

  const todaysSlots = await Timetable.find({ dayOfWeek: day })
    .populate({ path: 'class', match: { students: req.user._id }, populate: ['subject', 'teacher'] });

  const notices = await Notice.find({ $or: [{ target: 'ALL' }, { target: 'STUDENTS' }] }).sort({ createdAt: -1 }).limit(5);

  res.json({ myClasses, todaysSlots: todaysSlots.filter(s => s.class), notices });
};

exports.getProfile = async (req, res) => {
  const student = await Student.findById(req.params.studentId)
    .populate("course batch section");
  res.json(student);
};

exports.getAttendance = async (req, res) => {
  const attendance = await Attendance.find({ "records.studentId": req.params.studentId });
  res.json(attendance);
};