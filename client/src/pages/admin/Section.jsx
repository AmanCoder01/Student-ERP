import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';

const Section = () => {
    const [name, setName] = useState("");
    const [batchId, setBatchId] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { batches, sections, courses } = useSelector(state => state.admin);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            batch: batchId,
        };

        const success = await dispatch(adminService.createSection(formData, courses, batches));
        if (success) {
            setName("");
            setBatchId("");
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        dispatch(adminService.removeSection(id));
    };

    useEffect(() => {
        dispatch(adminService.fetchSections());
        dispatch(adminService.fetchBatches());
    }, [dispatch]);

    return (
        <div >
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-300">Sections</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 sm:mt-0 sm:w-auto bg-black mr-24 dark:bg-gray-800 hover:bg-gray-800 py-2 px-4 sm:px-6 text-white rounded-md shadow-md transition"
                >
                    + Add Section
                </button>
            </div>

            {/* Add Section Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Section"
            >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Section Name (e.g., A, B, CS-2A)"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <select
                        value={batchId}
                        onChange={(e) => setBatchId(e.target.value)}
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    >
                        <option value="">Select Batch</option>
                        {batches.map(batch => (
                            <option key={batch._id} value={batch._id}>
                                {batch.name} - {batch.course?.name}
                            </option>
                        ))}
                    </select>
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
                            Add Section
                        </button>
                    </div>
                </form>
            </Modal>

            <ResponsiveTable
                headers={['S No.', 'Section Name', 'Batch', 'Course', 'Actions']}
            >
                {sections?.length > 0 ? (
                    sections.map((section, index) => (
                        <tr key={section?._id} className="hover:bg-gray-900 dark:bg-gray-800">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {index + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {section?.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {section?.batch?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {section?.batch?.course?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                <div className="flex gap-4">
                                    <FaEdit
                                        color='blue'
                                        size={18}
                                        className='cursor-pointer'
                                    />
                                    <MdDelete
                                        onClick={() => handleDelete(section?._id)}
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
                        <td
                            colSpan="5"
                            className="px-4 py-6 text-sm text-gray-500 text-center italic"
                        >
                            No sections found
                        </td>
                    </tr>
                )}
            </ResponsiveTable>

        </div>
    );
};

export default Section;