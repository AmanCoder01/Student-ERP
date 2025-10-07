import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';
import { format } from 'date-fns';

const Teacher = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        teacherId: '',
        designation: '',
        department: '',
        qualification: '',
        joiningDate: '',
        contactNumber: '',
        profileImage: null,
        subjects: []
    });
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        teacherId: '',
        department: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const dispatch = useDispatch();
    const { departments, subjects, teachers } = useSelector(state => state.admin);
    console.log(formData);



    const filterSubjectsByDepartment = () => {
        // Use the .filter() method to return only the subjects that match.
        // We use optional chaining (?.) to prevent errors if a subject is missing a course.
        return subjects?.filter(subject => subject?.course?.department === formData.department);
    };



    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    };

    const handleSubjectChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            subjects: selectedOptions
        }));
    };

    const filteredTeachers = teachers?.filter(teacher => {
        const nameMatch = teacher?.name.toLowerCase().includes(filters.name.toLowerCase());
        const idMatch = teacher?.teacherId.toLowerCase().includes(filters.teacherId.toLowerCase());
        const deptMatch = teacher?.department?.name?.toLowerCase().includes(filters.department.toLowerCase());
        return nameMatch && idMatch && deptMatch;
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

    // Teacher.js component

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();

        // Loop through the state and append all fields
        Object.keys(formData).forEach(key => {
            if (key === 'subjects') {
                // Append each subject ID individually for better backend compatibility
                formData.subjects.forEach(subjectId => {
                    form.append('subjects[]', subjectId);
                });
            } else if (key === 'profileImage' && formData.profileImage) {
                // Append the file if it exists
                form.append(key, formData.profileImage);
            } else if (formData[key]) {
                // Append all other non-empty fields
                form.append(key, formData[key]);
            }
        });

        let success;
        if (editingTeacher) {
            // You'll need to create an updateTeacher function that also uses FormData
            success = await dispatch(adminService.updateTeacher(editingTeacher._id, form));
        } else {
            success = await dispatch(adminService.createTeacher(form));
        }

        if (success) {
            resetForm();
            setIsOpen(false);
        }
    };


    const resetForm = () => {
        setFormData({
            name: '',
            teacherId: '',
            designation: '',
            department: '',
            qualification: '',
            joiningDate: '',
            contactNumber: '',
            profileImage: null,
            subjects: []
        });
        setEditingTeacher(null);
    };

    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);
        setFormData({
            name: teacher.name,
            teacherId: teacher.teacherId,
            designation: teacher.designation || '',
            department: teacher.department._id,
            qualification: teacher.qualification || '',
            joiningDate: format(new Date(teacher.joiningDate), 'yyyy-MM-dd'),
            contactNumber: teacher.contactNumber || '',
            subjects: teacher.subjects?.map(sub => sub._id) || []
        });
        setIsOpen(true);
    };

    const handleDelete = (id) => {
        dispatch(adminService.removeTeacher(id));
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeachers = filteredTeachers?.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil((filteredTeachers?.length || 0) / itemsPerPage);

    useEffect(() => {
        dispatch(adminService.fetchTeachers());
        dispatch(adminService.fetchDepartments());
        dispatch(adminService.fetchSubjects());
    }, [dispatch]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Teachers</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 sm:mt-0 sm:w-auto bg-black hover:bg-gray-800 py-2 px-4 sm:px-6 text-white rounded-md shadow-md transition"
                >
                    + Add Teacher
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                    <input
                        type="text"
                        value={filters.teacherId}
                        onChange={(e) => handleFilterChange('teacherId', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by ID..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                        type="text"
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by department..."
                    />
                </div>
            </div>

            {/* Teacher Form Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    resetForm();
                    setIsOpen(false);
                }}
                title={editingTeacher ? "Edit Teacher" : "Add Teacher"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Teacher Name"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Teacher Email"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="text"
                        name="teacherId"
                        value={formData.teacherId}
                        onChange={handleInputChange}
                        placeholder="Teacher ID"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                        required
                    />
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
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
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="Designation"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                    />
                    <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        placeholder="Qualification"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                    />
                    <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                    />
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number"
                        className="bg-gray-700 w-full py-2 px-4 text-white rounded-md"
                    />


                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white mb-1">
                            Subjects (Hold Ctrl/Cmd to select multiple)
                        </label>
                        <div className="relative">
                            <select
                                name="subjects"
                                multiple
                                value={formData.subjects}
                                onChange={handleSubjectChange}
                                className="bg-gray-700 w-full py-2 px-4 text-white rounded-md min-h-[120px]"
                            >
                                {filterSubjectsByDepartment()?.map(subject => (
                                    <option
                                        key={subject._id}
                                        value={subject._id}
                                        className="py-1 px-2 hover:bg-gray-600"
                                    >
                                        {subject.name} - {subject.subjectCode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Subjects Display */}
                        {formData.subjects.length > 0 && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-white mb-2">
                                    Selected Subjects: ({formData.subjects.length})
                                </label>
                                <div className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-md">
                                    {formData.subjects.map(subjectId => {
                                        const subject = subjects.find(s => s._id === subjectId);
                                        return subject && (
                                            <span
                                                key={subject._id}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {subject.name}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            subjects: prev.subjects.filter(id => id !== subject._id)
                                                        }));
                                                    }}
                                                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-900 hover:bg-blue-200 rounded-full"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
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
                            {editingTeacher ? "Update Teacher" : "Add Teacher"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Teachers Table */}
            <ResponsiveTable
                headers={["S.No", "Profile", "Name", "ID", "Department", "Designation", "Contact", "Actions"]}
            >
                {currentTeachers?.map((teacher, index) => (
                    <tr key={teacher._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-2">
                            <img
                                src={teacher.profileImage?.url || '/default-avatar.png'}
                                alt={teacher.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </td>
                        <td className="px-4 py-2">{teacher.name}</td>
                        <td className="px-4 py-2">{teacher.teacherId}</td>
                        <td className="px-4 py-2">{teacher.department?.name}</td>
                        <td className="px-4 py-2">{teacher.designation}</td>
                        <td className="px-4 py-2">{teacher.contactNumber}</td>
                        <td className="px-4 py-2">
                            <div className="flex gap-4">
                                <FaEdit
                                    onClick={() => handleEdit(teacher)}
                                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                                    size={18}
                                />
                                <MdDelete
                                    onClick={() => handleDelete(teacher._id)}
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
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
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

export default Teacher;