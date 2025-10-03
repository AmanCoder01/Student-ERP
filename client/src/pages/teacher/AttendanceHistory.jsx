import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { teacherService } from '../../services/teacherService'; // Adjust path

const AttendanceHistory = () => {
    const dispatch = useDispatch();
    const { attendanceHistory, loading } = useSelector(state => state.teacher);

    useEffect(() => {
        dispatch(teacherService.getAttendanceHistory());
    }, [dispatch]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    if (loading.history) {
        return <div className="p-8 text-center">Loading History...</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Attendance History</h1>
            <div className="bg-white p-6 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-700">Date</th>
                                <th className="p-4 font-semibold text-gray-700">Subject</th>
                                <th className="p-4 font-semibold text-gray-700">Batch</th>
                                <th className="p-4 font-semibold text-gray-700">Topic</th>
                                <th className="p-4 font-semibold text-gray-700 text-center">Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceHistory.length > 0 ? (
                                attendanceHistory.map(record => (
                                    <tr key={record._id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 text-gray-800">{formatDate(record.date)}</td>
                                        <td className="p-4 font-medium text-gray-900">{record.subject?.name || 'N/A'}</td>
                                        <td className="p-4 text-gray-800">{record.batch?.name || 'N/A'}</td>
                                        <td className="p-4 text-gray-600 truncate max-w-xs">{record.contentTitle}</td>
                                        <td className="p-4 text-center font-semibold text-indigo-600">
                                            {record.students.filter(s => s.status === 'Present').length} / {record.students.length}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-8 text-gray-500">
                                        You have not submitted any attendance records yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceHistory;