import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { addCourse, deleteCourse, getCourses } from '../../redux/slices/adminSlice';
import { adminService } from '../../services/adminService';

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

        const success = await dispatch(adminService.createCourse(formData,departments));
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
        <div className="px-6 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Courses</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    command="show-modal" commandfor="dialog" class="bg-black hover:bg-gray-800 py-2 px-6 text-white rounded-md shadow-md transition">+ Add Course</button>
            </div>

            {/* Add Course Modal */}
            {isOpen && <el-dialog>
                <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                    <el-dialog-backdrop class="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                    <div tabIndex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                        <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h1 id="dialog-title" class="text-lg leading-6 font-medium text-white text-center pb-4">Add Course</h1>

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
                            </div>

                        </el-dialog-panel>
                    </div>
                </dialog>
            </el-dialog>}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">S No.</th>
                            <th className="px-4 py-2 text-left">Course Name</th>
                            <th className="px-4 py-2 text-left">Code</th>
                            <th className="px-4 py-2 text-left">Department</th>
                            <th className="px-4 py-2 text-left">Duration (Years)</th>
                            <th className="px-4 py-2 text-left">Semesters</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {courses.length > 0 ? (
                            courses.map((course, index) => (
                                <tr
                                    key={course._id}
                                    className="hover:bg-gray-100 transition-colors duration-300"
                                >
                                    <td className="px-4 py-2 font-medium text-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-2">{course.name}</td>
                                    <td className="px-4 py-2">{course.code}</td>
                                    <td className="px-4 py-2">
                                        {course.department?.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-2">{course.durationYears || "-"}</td>
                                    <td className="px-4 py-2">{course.totalSemesters || "-"}</td>
                                    <td className="px-4 py-2 flex gap-4">
                                        <FaEdit color='blue' size={18} className='cursor-pointer' />
                                        <MdDelete
                                            onClick={() => handleDelete(course._id)}
                                            color='red'
                                            size={20}
                                            className='cursor-pointer'
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500 italic"
                                >
                                    No courses found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Course