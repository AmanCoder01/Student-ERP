import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { teacherService } from '../../services/teacherService'; // Adjust path if needed
import { FaCheck, FaTimes, FaUsers } from 'react-icons/fa';

const TakeAttendance = () => {
    const dispatch = useDispatch();
    
    // Get data and UI states from Redux store
    const { courses, subjects, batches, sections, students, currentSemester, loading } = useSelector(state => state.teacher);

    console.log("Courses:", courses);
    console.log("Subjects:", subjects);
    console.log("Batches:", batches);
    console.log("Sections:", sections);
    console.log("Students:", students);
    console.log("Current Semester:", currentSemester);
    console.log("Loading:", loading);
    
    // Local state for user's selections and form inputs
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [contentTitle, setContentTitle] = useState('');
    const [attendance, setAttendance] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial data fetch for courses
    useEffect(() => {
        dispatch(teacherService.getCourses());
    }, [dispatch]);

    // When students data from Redux changes, initialize local attendance state
    useEffect(() => {
        if (students?.length > 0) {
            const initialAttendance = students.reduce((acc, student) => {
                acc[student._id] = 'Present'; // Default to Present
                return acc;
            }, {});
            setAttendance(initialAttendance);
        } else {
            setAttendance({}); // Clear attendance if students list is cleared
        }
    }, [students]);

    // Handlers for dropdown changes
    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        // Reset downstream selections
        setSelectedBatch('');
        setSelectedSection('');
        setSelectedSubject('');
        if (courseId) {
            dispatch(teacherService.getCourseDetails(courseId));
        }
    };

    const handleBatchChange = (e) => {
        const batchId = e.target.value;
        setSelectedBatch(batchId);
        setSelectedSection('');
        if (batchId) {
            dispatch(teacherService.getBatchDetails(batchId));
        }
    };

    // Handler to fetch students
    const handleFetchStudents = () => {
        if (!selectedSection || !selectedSubject) {
            alert('Please select a section and subject first.');
            return;
        }
        dispatch(teacherService.getSectionStudents(selectedSection));
    };

    // Handler to mark attendance
    const handleMarkAttendance = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const markAll = (status) => {
        const newAttendance = students.reduce((acc, student) => ({ ...acc, [student._id]: status }), {});
        setAttendance(newAttendance);
    };

    // Handler to submit the final attendance
    const handleSubmit = async () => {
        if (!contentTitle.trim()) {
            alert('Please enter the Lecture Topic.');
            return;
        }
        setIsSubmitting(true);
        const attendanceData = Object.keys(attendance).map(studentId => ({
            student: studentId,
            status: attendance[studentId],
        }));

        const payload = {
            course: selectedCourse,
            batch: selectedBatch,
            semester: currentSemester,
            section: selectedSection,
            subject: selectedSubject,
            contentTitle: contentTitle.trim(),
            students: attendanceData,
        };
        
        const result = await dispatch(teacherService.submitAttendance(payload));
        if (result.success) {
            // Clear local form state on success
            setSelectedSection('');
            setSelectedSubject('');
            setContentTitle('');
        }
        setIsSubmitting(false);
    };

    return (
        <div className='p-4 md:p-8 bg-gray-50 min-h-screen font-sans'>
            <div className='max-w-7xl mx-auto'>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Take Attendance</h1>
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                        <div className="lg:col-span-2">
                            <label htmlFor="contentTitle" className="block text-sm font-medium text-gray-700 mb-1">Lecture Topic</label>
                            <input type="text" id="contentTitle" value={contentTitle} onChange={e => setContentTitle(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="e.g., Introduction to Linked Lists" />
                        </div>
                        <div>
                            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                            <input type="number" id="semester" value={currentSemester || ''} readOnly
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                placeholder="Auto-filled" />
                        </div>
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                            <select id="course" value={selectedCourse} onChange={handleCourseChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                                <option value="">{loading.courses ? 'Loading...' : 'Select Course'}</option>
                                {courses?.map(course => <option key={course._id} value={course._id}>{course.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                            <select id="batch" value={selectedBatch} onChange={handleBatchChange} disabled={!selectedCourse || loading.details}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100">
                                <option value="">{loading.details ? 'Loading...' : 'Select Batch'}</option>
                                {batches?.map(batch => <option key={batch._id} value={batch._id}>{batch.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                            <select id="section" value={selectedSection} onChange={e => setSelectedSection(e.target.value)} disabled={!selectedBatch || loading.sections}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100">
                                <option value="">{loading.sections ? 'Loading...' : 'Select Section'}</option>
                                {sections?.map(sec => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <select id="subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} disabled={!selectedCourse || loading.details}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100">
                                <option value="">{loading.details ? 'Loading...' : 'Select Subject'}</option>
                                {subjects?.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                            </select>
                        </div>
                        <div className="lg:col-start-3">
                            <button onClick={handleFetchStudents} disabled={!selectedSection || !selectedSubject || loading.students}
                                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:bg-indigo-300">
                                <FaUsers /> {loading.students ? 'Fetching...' : 'Fetch Students'}
                            </button>
                        </div>
                    </div>
                </div>

                {students?.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Mark Attendance</h2>
                            <div className="flex gap-2">
                                <button onClick={() => markAll('Present')} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full hover:bg-green-200">Mark All Present</button>
                                <button onClick={() => markAll('Absent')} className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full hover:bg-red-200">Mark All Absent</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="p-3 font-semibold text-gray-600">Roll No.</th>
                                        <th className="p-3 font-semibold text-gray-600">Name</th>
                                        <th className="p-3 font-semibold text-gray-600 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-gray-700">{student.rollNumber}</td>
                                            <td className="p-3 font-medium text-gray-800">{student.name}</td>
                                            <td className="p-3 text-center">
                                                <div className="inline-flex gap-2">
                                                    <button onClick={() => handleMarkAttendance(student._id, 'Present')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${attendance[student._id] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-green-200'}`}>
                                                        <FaCheck /> Present
                                                    </button>
                                                    <button onClick={() => handleMarkAttendance(student._id, 'Absent')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all ${attendance[student._id] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-red-200'}`}>
                                                        <FaTimes /> Absent
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleSubmit} disabled={isSubmitting}
                                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TakeAttendance;