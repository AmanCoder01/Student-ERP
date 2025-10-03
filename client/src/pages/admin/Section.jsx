import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Section = () => {
    const [name, setName] = useState("");
    const [batchId, setBatchId] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { batches, sections,courses } = useSelector(state => state.admin);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            batch: batchId,
        };

        const success = await dispatch(adminService.createSection(formData,courses,batches));
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
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Sections</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 sm:mt-0 sm:w-auto bg-black hover:bg-gray-800 py-2 px-4 sm:px-6 text-white rounded-md shadow-md transition"
                >
                    + Add Section
                </button>
            </div>

            {/* Add Section Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                             onClick={() => setIsOpen(false)} />

                        <div className="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full mx-4">
                            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium leading-6 text-white text-center mb-4">
                                    Add Section
                                </h3>
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle px-4 sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        S No.
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Section Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Batch
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sections?.length > 0 ? (
                                    sections.map((section, index) => (
                                        <tr key={section?._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {section?.name}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {section?.batch?.name || "N/A"}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {section?.batch?.course?.name || "N/A"}
                                            </td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
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
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Section;