import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

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

        const success = await dispatch(adminService.createBatch(formData,courses));
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

    return (
        <div className="px-6 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Batches</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    command="show-modal" commandfor="dialog" class="bg-black hover:bg-gray-800 py-2 px-6 text-white rounded-md shadow-md transition">+ Add Batch</button>
            </div>

            {/* Add Batch Modal */}
            {isOpen && <el-dialog>
                <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                    <el-dialog-backdrop class="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                    <div tabIndex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                        <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h1 id="dialog-title" class="text-lg leading-6 font-medium text-white text-center pb-4">Add Batch</h1>

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
                            <th className="px-4 py-2 text-left">Course</th>
                            <th className="px-4 py-2 text-left">Batch Name</th>
                            <th className="px-4 py-2 text-left">Start Year</th>
                            <th className="px-4 py-2 text-left">End Year</th>
                            <th className="px-4 py-2 text-left">Current Semester</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {batches.length > 0 ? (
                            batches.map((batch, index) => (
                                <tr
                                    key={batch._id}
                                    className="hover:bg-gray-100 transition-colors duration-300"
                                >
                                    <td className="px-4 py-2 font-medium text-gray-700">{index + 1}</td>
                                    <td className="px-4 py-2">{batch?.course?.name || "N/A"}</td>
                                    <td className="px-4 py-2">{batch?.name}</td>
                                    <td className="px-4 py-2">{batch?.startYear}</td>
                                    <td className="px-4 py-2">{batch?.endYear}</td>
                                    <td className="px-4 py-2">{batch?.currentSemester}</td>
                                    <td className="px-4 py-2 flex gap-4">
                                        <FaEdit color='blue' size={18} className='cursor-pointer' />
                                        <MdDelete
                                            onClick={() => handleDelete(batch._id)}
                                            color='red'
                                            size={20}
                                            className='cursor-pointer'
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                                    No batches found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Batch