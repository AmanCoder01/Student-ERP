import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService'; // Your admin service file

// Import icons and chart components
import { FaBuilding, FaBook, FaUserTie, FaUserGraduate } from 'react-icons/fa';
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
import StatCard from '../../components/StatCard ';

// Register the necessary components for Chart.js
ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
);

const AdminDashboard = () => {
    const dispatch = useDispatch();

    // Select all necessary data from the admin slice
    const { dashboardData, departments, students, teachers, loading } = useSelector(state => state.admin);

    useEffect(() => {
        // Dispatch actions to fetch all data needed for the dashboard
        dispatch(adminService.fetchDashboardData());
        dispatch(adminService.fetchDepartments()); // You need to have this in your service
        dispatch(adminService.fetchStudents());   // And this
        dispatch(adminService.fetchTeachers());   // And this
    }, [dispatch]);

    // Process data for the "Students per Department" Bar Chart
    // useMemo ensures this expensive calculation only runs when departments or students change
    const studentsByDeptData = useMemo(() => {
        if (!departments?.length || !students?.length) {
            return { labels: [], datasets: [] };
        }

        const labels = departments.map(dept => dept.name);
        const data = departments.map(dept => {
            // Count students that belong to the current department
            return students.filter(student => student.department === dept._id).length;
        });

        return {
            labels,
            datasets: [{
                label: 'Number of Students',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        };
    }, [departments, students]);

    // Process data for the Doughnut Chart
    const entityDistributionData = {
        labels: ['Students', 'Teachers'],
        datasets: [{
            // Use live data from the dashboardData object, with fallback to array lengths
            data: [
                dashboardData?.totalStudents || students.length,
                dashboardData?.totalTeachers || teachers.length
            ],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
        }],
    };

    if (loading) {
        return <div className="p-8 text-center text-xl">Loading Dashboard...</div>;
    }

    return (
        <div className='p-4 md:p-8 bg-gray-100 min-h-screen font-sans'>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, Admin!</h1>
                <p className="text-gray-500">Here is the summary of your institution.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon={<FaBuilding size={24} />} title="Total Departments" value={dashboardData?.totalDepartments ?? '...'} color="blue" />
                <StatCard icon={<FaBook size={24} />} title="Total Courses" value={dashboardData?.totalCourses ?? '...'} color="indigo" />
                <StatCard icon={<FaUserTie size={24} />} title="Total Teachers" value={dashboardData?.totalTeachers ?? '...'} color="yellow" />
                <StatCard icon={<FaUserGraduate size={24} />} title="Total Students" value={dashboardData?.totalStudents ?? '...'} color="green" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Students per Department</h2>
                    {/* Only render chart if data is available */}
                    {studentsByDeptData.labels.length > 0 ? (
                        <Bar data={studentsByDeptData} options={{ responsive: true }} />
                    ) : (
                        <p className="text-center text-gray-500 py-8">Loading chart data...</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Student-Teacher Ratio</h2>
                    {entityDistributionData.datasets[0].data[0] > 0 ? (
                        <Doughnut data={entityDistributionData} options={{ responsive: true }} />
                    ) : (
                        <p className="text-center text-gray-500 py-8">Loading chart data...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;