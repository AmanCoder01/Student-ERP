// layouts/StudentLayout.jsx
import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const StudentLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const dispatch = useDispatch();

    const navLinkStyles = ({ isActive }) => ({
        backgroundColor: isActive ? '#374151' : '',
    });

    const navLinks = [
        { path: "/student", label: "Dashboard", end: true },
        { path: "/student/attendance", label: "Attendance" },
        { path: "/student/timetable", label: "Time Table" },
        { path: "/student/subjects", label: "Subjects" },
        { path: "/student/assignments", label: "Assignments" },
        { path: "/student/results", label: "Results" },
        { path: "/student/notifications", label: "Notifications" },
    ];

    const Sidebar = () => (
        <div className="h-full flex flex-col p-5">
            <h2 className="text-2xl font-bold mb-6">Student Portal</h2>

            {/* Navigation Links */}
            <nav className="flex flex-col flex-grow space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        style={navLinkStyles}
                        className="hover:bg-gray-700 p-2 rounded transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Links */}
            <div className="mt-auto space-y-2">
                <NavLink
                    to="/student/profile"
                    style={navLinkStyles}
                    className="hover:bg-gray-700 p-2 rounded block transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    Profile
                </NavLink>
                <div
                    className="hover:bg-gray-700 p-2 rounded block transition-colors cursor-pointer"
                    onClick={() => dispatch(logout())}
                >
                    Logout
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-gray-900 text-white">
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
                <aside className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    
                    {/* Sidebar */}
                    <div className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white">
                        <Sidebar />
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-gray-700 rounded"
                    >
                        {isSidebarOpen ? (
                            <IoMdClose size={24} />
                        ) : (
                            <HiMenuAlt3 size={24} />
                        )}
                    </button>
                    {/* Optional: Add student info in header */}
                    <div className="text-sm">
                        <span className="font-medium">Welcome, Student</span>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 bg-gray-100 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;