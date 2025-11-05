import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { addCourse, deleteCourse, getCourses } from '../../redux/slices/adminSlice';
import { adminService } from '../../services/adminService';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';

const Course = () => {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [durationYears, setDurationYears] = useState("");
    const [totalSemesters, setTotalSemesters] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { departments, courses } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            name,
            code,
            department: departmentId,
            durationYears,
            totalSemesters
        };

        const success = await dispatch(adminService.createCourse(formData, departments));
        if (success) {
            setName("");
            setCode("");
            setDepartmentId("");
            setDurationYears("");
            setTotalSemesters("");
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        dispatch(adminService.removeCourse(id));
    };

    useEffect(() => {
        dispatch(adminService.fetchCourses());
    }, [dispatch]);


    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-300">Courses</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    command="show-modal" commandfor="dialog" class="bg-black hover:bg-gray-800 py-2 px-6 text-white rounded-md shadow-md transition mr-24 dark:bg-gray-800 cursor-pointer">+ Add Course</button>
            </div>

            {/* Add Course Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Course"
            >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Course Name"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Course Code"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept._id} value={dept._id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={durationYears}
                        onChange={(e) => setDurationYears(e.target.value)}
                        placeholder="Duration (Years)"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="number"
                        value={totalSemesters}
                        onChange={(e) => setTotalSemesters(e.target.value)}
                        placeholder="Total Semesters"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Add Course
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Table */}
            <ResponsiveTable headers={["S No.", "Course Name", "Code", "Department", "Duration (Years)", "Semesters", "Actions"]} >
                {courses.length > 0 ? (
                    courses.map((course, index) => (
                        <tr key={course._id} className="hover:bg-gray-900 dark:bg-gray-800 transition-colors duration-300">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                {index + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {course?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {course?.code || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {course.department?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                               {course.durationYears || "-"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                               {course.totalSemesters || "-"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                <div className="flex gap-4">
                                    <FaEdit color='blue' size={18} className='cursor-pointer' />
                                    <MdDelete
                                        onClick={() => handleDelete(batch._id)}
                                        color='red'
                                        size={20}
                                        className='cursor-pointer'
                                    />
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-6 text-gray-500 dark:text-gray-400 italic">
                            No courses found
                        </td>
                    </tr>
                )}
            </ResponsiveTable>
        </div>
    )
}

export default Course