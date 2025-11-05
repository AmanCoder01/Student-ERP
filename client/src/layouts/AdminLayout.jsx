import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import ThemeToggleButton from '../components/ThemeToggleButton';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    

    const dispatch = useDispatch();

    const navLinks = [
        { path: "/admin", label: "Dashboard", end: true },
        { path: "/admin/department", label: "Departments" },
        { path: "/admin/course", label: "Courses" },
        { path: "/admin/batch", label: "Batches" },
        { path: "/admin/section", label: "Sections" },
        { path: "/admin/subject", label: "Technical Subjects" },
        { path: "/admin/teacher", label: "Teachers" },
        { path: "/admin/student", label: "Students" },
    ];

    const Sidebar = () => (
        // Sidebar container: controls the overall look
        <div className="h-full flex flex-col p-5 ">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Admin Panel</h2>

            {/* Navigation Links */}
            <nav className="flex flex-col flex-grow space-y-2">
                {navLinks.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        // Use a function in className for conditional styling
                        className={({ isActive }) =>
                            `p-2 rounded transition-colors ${
                                isActive
                                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' // Active link styles
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700' // Inactive link hover styles
                            }`
                        }
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer Links */}
            <div className="mt-auto space-y-2">
                <NavLink
                    to="/admin/profile"
                    className={({ isActive }) =>
                        `p-2 rounded block transition-colors ${
                            isActive
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`
                    }
                    onClick={() => setIsSidebarOpen(false)}
                >
                    Profile
                </NavLink>
                <div
                    className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded block transition-colors cursor-pointer"
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
            <aside className="hidden md:block w-64 bg-gray-100 dark:bg-gray-900 dark:text-white">
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
                <header className="md:hidden bg-gray-900 text-white p-4">
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
                </header>

                {/* Content */}
                <main className="flex-1 p-4 md:p-12 md:px-16  relative bg-gray-100 dark:bg-gray-900 overflow-auto">
                    <div className='absolute right-20 top-14 animate-bounce '>
                        <ThemeToggleButton/>
                    </div>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;