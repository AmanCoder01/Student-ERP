// pages/admin/Student.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';
import { format } from 'date-fns';

const Student = () => {
    const [formData, setFormData] = useState({
        name: '',
        email:'',
        studentId: '',
        rollNumber: '',
        batch: '',
        section: '',
        semester: '',
        phone: '',
        guardianName: '',
        guardianPhone: '',
        address: '',
        dob: '',
        profileImage: null
    });

    const [isOpen, setIsOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        studentId: '',
        batch: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const dispatch = useDispatch();
    const { batches, sections, students } = useSelector(state => state.admin);

    

    useEffect(() => {
        dispatch(adminService.fetchStudents());
        dispatch(adminService.fetchBatches());
        dispatch(adminService.fetchSections());
    }, [dispatch]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    };

    const filteredStudents = students?.filter(student => {
        const nameMatch = student.name.toLowerCase().includes(filters.name.toLowerCase());
        const idMatch = student.studentId.toLowerCase().includes(filters.studentId.toLowerCase());
        const batchMatch = student.batch?.name.toLowerCase().includes(filters.batch.toLowerCase());
        return nameMatch && idMatch && batchMatch;
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();

        // Append guardian info as JSON
        const guardian = {
            name: formData.guardianName,
            phone: formData.guardianPhone
        };

        Object.keys(formData).forEach(key => {
            if (key === 'guardianName' || key === 'guardianPhone') {
                return; // Skip these as we're sending them as part of guardian object
            }
            if (key === 'guardian') {
                form.append(key, JSON.stringify(guardian));
            } else {
                form.append(key, formData[key]);
            }
        });

        let success;
        if (editingStudent) {
            success = await dispatch(adminService.updateStudent(editingStudent._id, form));
        } else {
            success = await dispatch(adminService.createStudent(form));
        }

        if (success) {
            resetForm();
            setIsOpen(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            studentId: '',
            rollNumber: '',
            batch: '',
            section: '',
            semester: '',
            phone: '',
            guardianName: '',
            guardianPhone: '',
            address: '',
            dob: '',
            profileImage: null
        });
        setEditingStudent(null);
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name,
            studentId: student.studentId,
            rollNumber: student.rollNumber || '',
            batch: student.batch?._id || '',
            section: student.section?._id || '',
            semester: student.semester || '',
            phone: student.phone || '',
            guardianName: student.guardian?.name || '',
            guardianPhone: student.guardian?.phone || '',
            address: student.address || '',
            dob: student.dob ? format(new Date(student.dob), 'yyyy-MM-dd') : '',
            profileImage: null
        });
        setIsOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            dispatch(adminService.removeStudent(id));
        }
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = filteredStudents?.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil((filteredStudents?.length || 0) / itemsPerPage);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Students</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 sm:mt-0 sm:w-auto bg-black hover:bg-gray-800 py-2 px-4 sm:px-6 text-white rounded-md shadow-md transition"
                >
                    + Add Student
                </button>
            </div>

            {/* Search Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by name..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                        type="text"
                        value={filters.studentId}
                        onChange={(e) => handleFilterChange('studentId', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by ID..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                    <input
                        type="text"
                        value={filters.batch}
                        onChange={(e) => handleFilterChange('batch', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by batch..."
                    />
                </div>
            </div>

            {/* Student Form Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    resetForm();
                    setIsOpen(false);
                }}
                title={editingStudent ? "Edit Student" : "Add Student"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Personal Information */}
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Student Name"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Student Email"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            placeholder="Student ID"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="rollNumber"
                            value={formData.rollNumber}
                            onChange={handleInputChange}
                            placeholder="Roll Number"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        />
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleInputChange}
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        />

                        {/* Academic Information */}
                        <select
                            name="batch"
                            value={formData.batch}
                            onChange={handleInputChange}
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        >
                            <option value="">Select Batch</option>
                            {batches.map(batch => (
                                <option key={batch._id} value={batch._id}>
                                    {batch.name} - {batch.course?.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="section"
                            value={formData.section}
                            onChange={handleInputChange}
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        >
                            <option value="">Select Section</option>
                            {sections
                                .filter(section => !formData.batch || section.batch?._id === formData.batch)
                                .map(section => (
                                    <option key={section._id} value={section._id}>
                                        {section.name}
                                    </option>
                                ))}
                        </select>
                        <input
                            type="number"
                            name="semester"
                            value={formData.semester}
                            onChange={handleInputChange}
                            placeholder="Current Semester"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                            required
                        />

                        {/* Contact Information */}
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Phone Number"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        />
                    </div>

                    {/* Guardian Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="guardianName"
                            value={formData.guardianName}
                            onChange={handleInputChange}
                            placeholder="Guardian Name"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        />
                        <input
                            type="tel"
                            name="guardianPhone"
                            value={formData.guardianPhone}
                            onChange={handleInputChange}
                            placeholder="Guardian Phone"
                            className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        />
                    </div>

                    {/* Address */}
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md min-h-[100px]"
                    />

                    {/* Profile Image */}
                    <input
                        type="file"
                        name="profileImage"
                        onChange={handleInputChange}
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        accept="image/*"
                    />

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {editingStudent ? "Update Student" : "Add Student"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Students Table */}
            <ResponsiveTable
                headers={["S.No", "Profile", "Name", "ID", "Roll No", "Batch", "Section", "Semester", "Actions"]}
            >
                {students?.map((student, index) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-2">
                            <img
                                src={student.profileImage?.url || '/default-avatar.png'}
                                alt={student.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </td>
                        <td className="px-4 py-2">{student.name}</td>
                        <td className="px-4 py-2">{student.studentId}</td>
                        <td className="px-4 py-2">{student.rollNumber}</td>
                        <td className="px-4 py-2">{student.batch?.name}</td>
                        <td className="px-4 py-2">{student.section?.name}</td>
                        <td className="px-4 py-2">{student.semester}</td>
                        <td className="px-4 py-2">
                            <div className="flex gap-4">
                                <FaEdit
                                    onClick={() => handleEdit(student)}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                    size={18}
                                />
                                <MdDelete
                                    onClick={() => handleDelete(student._id)}
                                    className="cursor-pointer text-red-600 hover:text-red-800"
                                    size={20}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </ResponsiveTable>

            {/* Pagination */}
            {pageCount > 1 && (
                <div className="flex justify-center mt-6">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        {[...Array(pageCount)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === i + 1
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                            disabled={currentPage === pageCount}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Student;