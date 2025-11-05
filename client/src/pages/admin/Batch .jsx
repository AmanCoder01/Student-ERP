import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';

const Batch = () => {
    const [name, setName] = useState("");
    const [courseId, setCourseId] = useState("");
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [currentSemester, setCurrentSemester] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { courses, batches } = useSelector(state => state.admin);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            courseId,
            startYear: startYear,
            endYear: endYear,
            currentSemester: currentSemester
        };

        const success = await dispatch(adminService.createBatch(formData, courses));
        if (success) {
            setName("");
            setCourseId("");
            setStartYear("");
            setEndYear("");
            setCurrentSemester("");
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        dispatch(adminService.removeBatch(id));
    };

    useEffect(() => {
        dispatch(adminService.fetchBatches());
        dispatch(adminService.fetchCourses());
    }, [dispatch]);

    const tableHeaders = [
        "S No.",
        "Course",
        "Batch Name",
        "Start Year",
        "End Year",
        "Current Semester",
        "Actions"
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-300">Batches</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    command="show-modal" commandfor="dialog" class="bg-black hover:bg-gray-800 py-2 px-6 text-white rounded-md shadow-md mr-24 transition dark:bg-gray-800">+ Add Batch</button>
            </div>

            {/* Add Batch Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Batch"
            >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Batch Name"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <select
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                        placeholder="Start Year"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="number"
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                        placeholder="End Year"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="number"
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(e.target.value)}
                        placeholder="Current Semester"
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
                            Add Batch
                        </button>
                    </div>
                </form>
            </Modal>


            {/* Table */}
            <ResponsiveTable
                headers={tableHeaders}
            >
                {batches.length > 0 ? (
                    batches.map((batch, index) => (
                        <tr key={batch._id} className="hover:bg-gray-900 dark:bg-gray-800 transition-colors duration-300">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                                {index + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {batch?.course?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {batch?.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {batch?.startYear}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {batch?.endYear}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {batch?.currentSemester}
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
                            No batches found
                        </td>
                    </tr>
                )}
            </ResponsiveTable>
        </div>
    )
}

export default Batch