import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { teacherService } from '../../services/teacherService'; // Adjust path
import { clearSearchedAttendance } from '../../redux/slices/teacherSlice'; // Adjust path

const SearchAttendance = () => {
    const dispatch = useDispatch();

    // We get subjects list from the `take attendance` state to avoid re-fetching
    const { subjects, searchedAttendance, loading } = useSelector(state => state.teacher);

    const [selectedSubject, setSelectedSubject] = useState('');
    const [studentId, setStudentId] = useState('');



    const handleSearch = (e) => {
        e.preventDefault();
        if (!selectedSubject || !studentId) {
            alert('Please select a subject and enter a Student ID.');
            return;
        }

        dispatch(teacherService.searchStudentAttendance({
            subjectId: selectedSubject,
            rollNumber: studentId
        }));

    };


    useEffect(() => {

        dispatch(teacherService.getTeacherSubjects());

    }, []);

    return (
        <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 dark:text-gray-100">Search Student Attendance</h1>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">
                    <div className="md:col-span-1">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Select Subject</label>
                        <select id="subject" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} required
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-100 dark:bg-gray-700">
                            <option value="">Select a Subject</option>
                            {subjects?.map(sub => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Subjects are populated from the 'Take Attendance' page.</p>
                    </div>
                    <div className="md:col-span-1">
                        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Student Roll No</label>
                        <input type="text" id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} required
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-gray-100"
                            placeholder="Enter Student's Database ID" />
                    </div>
                    <div className="flex items-center">
                        <button type="submit" disabled={loading.search}
                            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                            {loading.search ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </div>
            </form>

            {/* Result Display */}
            {searchedAttendance && (
                <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-md">

                    {/* Header */}
                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Student Attendance Report</h2>
                        <p className="text-gray-600 mt-1 dark:text-gray-400">
                            Attendance details for <span className="font-semibold">{searchedAttendance.student.name}</span>
                            ({searchedAttendance.student.rollNumber}) in
                            <span className="font-semibold"> {searchedAttendance.subject.name}</span>
                            ({searchedAttendance.subject.subjectCode}).
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
                        <div className="p-6 rounded-lg shadow-inner bg-blue-50 dark:bg-blue-900">
                            <p className="text-sm font-medium text-blue-700 uppercase dark:text-blue-300">Total Classes</p>
                            <p className="text-5xl font-bold text-blue-600 dark:text-blue-300">{searchedAttendance.totalClasses}</p>
                        </div>

                        <div className="p-6 rounded-lg shadow-inner bg-green-50 dark:bg-green-900">
                            <p className="text-sm font-medium text-green-700 uppercase dark:text-green-300">Attended</p>
                            <p className="text-5xl font-bold text-green-600 dark:text-green-300">{searchedAttendance.attendedClasses}</p>
                        </div>

                        <div className="p-6 rounded-lg shadow-inner bg-indigo-50 dark:bg-indigo-900">
                            <p className="text-sm font-medium text-indigo-700 uppercase dark:text-indigo-300">Percentage</p>
                            <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-300">{searchedAttendance.percentage}%</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                        <p className="text-gray-800 font-medium mb-2 dark:text-gray-100">Attendance Progress</p>
                        <div className="w-full bg-gray-200 h-4 rounded-full">
                            <div
                                className="h-4 rounded-full transition-all"
                                style={{
                                    width: `${searchedAttendance.percentage}%`,
                                    backgroundColor:
                                        searchedAttendance.percentage >= 75
                                            ? '#16a34a' // Green
                                            : searchedAttendance.percentage >= 50
                                                ? '#eab308' // Yellow
                                                : '#dc2626' // Red
                                }}
                            ></div>
                        </div>
                    </div>

                </div>
            )}


            {/* Result Display */}
            {/* {searchedAttendance && (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Search Result</h2>
                    <p className="text-gray-600 mb-6">Attendance record for <span className="font-bold">{searchedAttendance.student.name}</span> in the subject <span className="font-bold">{searchedAttendance.subject.name}</span>.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-blue-50 p-6 rounded-lg">
                            <p className="text-lg font-medium text-blue-800">Total Classes</p>
                            <p className="text-5xl font-bold text-blue-600">{searchedAttendance.totalClasses}</p>
                        </div>
                        <div className="bg-green-50 p-6 rounded-lg">
                            <p className="text-lg font-medium text-green-800">Classes Attended</p>
                            <p className="text-5xl font-bold text-green-600">{searchedAttendance.attendedClasses}</p>
                        </div>
                        <div className="bg-indigo-50 p-6 rounded-lg">
                            <p className="text-lg font-medium text-indigo-800">Percentage</p>
                            <p className="text-5xl font-bold text-indigo-600">{searchedAttendance.percentage}%</p>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default SearchAttendance;