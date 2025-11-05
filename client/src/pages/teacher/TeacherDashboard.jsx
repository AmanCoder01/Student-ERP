import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { FaChalkboard, FaClock, FaCalendarCheck } from 'react-icons/fa'; // Example icons
import { teacherService } from '../../services/teacherService';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const TeacherDashboard = () => {
    const dispatch = useDispatch();
    const { dashboardData, loading } = useSelector((state) => state.teacher);

    useEffect(() => {
        // 2. Dispatch the specific method from the service object
        dispatch(teacherService.fetchDashboardData());
    }, [dispatch]);

    if (loading.dashboard) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }


    if (!dashboardData) {
        return null; // or a placeholder
    }

    // --- Prepare data for charts ---

    // Bar Chart: Attendance percentage for recent classes
    const attendanceChartData = {
        labels: dashboardData.recentAttendance.map(att => `${att.subject.name.slice(0, 10)} (${att.section.name})`),
        datasets: [{
            label: 'Attendance %',
            data: dashboardData.recentAttendance.map(att => {
                const present = att.students.filter(s => s.status === 'Present').length;
                const total = att.students.length;
                return total > 0 ? (present / total) * 100 : 0;
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
        },],
    };

    // Doughnut Chart: Present vs Absent for the most recent class
    const latestAttendance = dashboardData.recentAttendance[0];
    console.log(latestAttendance);
    
    const presentCount = latestAttendance?.students.filter(s => s.status === 'Present').length || 0;
    const absentCount = latestAttendance?.students.filter(s => s.status === 'Absent').length || 0;


    const doughnutChartData = {
        labels: ['Present', 'Absent'],
        datasets: [{
            label: 'Students',
            data: [presentCount, absentCount],
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
            borderWidth: 1,
        },],
    };


    return (
        <div className='px-6 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen'>
            <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">Teacher Dashboard</h1>
            <p className="text-lg text-gray-600 mb-6 dark:text-gray-200">Welcome back, {dashboardData.teacherInfo.name}!</p>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
                <StatCard icon={<FaChalkboard size={30} />} title="Total Classes Taken" value={dashboardData.totalClasses} color="blue" />
                <StatCard icon={<FaClock size={30} />} title="Classes Today" value={dashboardData.todayClasses} color="green" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Recent Class Attendance (%)</h2>
                    <Bar data={attendanceChartData} options={{ responsive: true }} />
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Latest Class Status ({latestAttendance?.subject.name})</h2>
                    {(presentCount + absentCount > 0) ?
                        <Doughnut data={doughnutChartData}  />
                        : <p className="text-center text-gray-500 mt-10">No attendance data for the latest class.</p>
                    }
                </div>
            </div>

            {/* Recent Attendance Table */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaCalendarCheck /> Recent Attendance Records
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Subject</th>
                                <th className="p-3">Section</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.recentAttendance.map((att) => (
                                <tr key={att._id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{new Date(att.date).toLocaleDateString()}</td>
                                    <td className="p-3">{att.subject.name}</td>
                                    <td className="p-3">{att.section.name}</td>
                                    <td className="p-3 font-semibold">
                                        {att.students.filter(s => s.status === 'Present').length} / {att.students.length} Present
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


// A small helper component for the stat cards to keep the main component clean
const StatCard = ({ icon, title, value, color }) => {
    const colors = {
        blue: 'text-blue-500 bg-blue-100',
        green: 'text-green-500 bg-green-100',
    };
    return (
        <div className='bg-white shadow rounded-lg p-5 flex items-center gap-5'>
            <div className={`p-4 rounded-full ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    )
}


export default TeacherDashboard;