import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit, FaSearch } from 'react-icons/fa';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';

const Subject = () => {
    const [name, setName] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [courseId, setCourseId] = useState("");
    const [semester, setSemester] = useState("");
    const [credits, setCredits] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        code: '',
        course: ''
    });
    const [editingSubject, setEditingSubject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const dispatch = useDispatch();
    const { courses, subjects } = useSelector(state => state.admin);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    };

    // Replace your existing filteredSubjects logic with this:
    const filteredSubjects = subjects?.filter(subject => {
        const nameMatch = subject?.name?.toLowerCase().includes(filters.name.toLowerCase());
        const codeMatch = subject?.subjectCode?.toLowerCase().includes(filters.code.toLowerCase());
        const courseMatch = subject?.course?.name?.toLowerCase().includes(filters.course.toLowerCase());

        return nameMatch && codeMatch && courseMatch;
    });

    // Reset form function
    const resetForm = () => {
        setName("");
        setSubjectCode("");
        setCourseId("");
        setSemester("");
        setCredits("");
        setEditingSubject(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            name,
            subjectCode,
            course: courseId,
            semester: parseInt(semester),
            credits: parseInt(credits)
        };

        let success;
        if (editingSubject) {
            success = await dispatch(adminService.updateSubject(editingSubject._id, formData));
        } else {
            success = await dispatch(adminService.createSubject(formData,courses));
        }

        if (success) {
            resetForm();
            setIsOpen(false);
        }
    };


    const handleDelete = (id) => {
        dispatch(adminService.removeSubject(id));
    };

    const handleEdit = (subject) => {
        setEditingSubject(subject);
        setName(subject.name);
        setSubjectCode(subject.subjectCode);
        setCourseId(subject.course?._id || "");
        setSemester(subject.semester.toString());
        setCredits(subject.credits.toString());
        setIsOpen(true);
    };


    // Get current subjects for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSubjects = filteredSubjects?.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil((filteredSubjects?.length || 0) / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    // Reset to first page when search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);



    useEffect(() => {
        dispatch(adminService.fetchSubjects());
        dispatch(adminService.fetchCourses());
    }, [dispatch]);

    const tableHeaders = ["S No.", "Subject Name", "Code", "Course", "Semester", "Credits", "Actions"];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">Subjects</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 sm:mt-0 sm:w-auto bg-black hover:bg-gray-800 py-2 px-4 sm:px-6 text-white rounded-md shadow-md transition"
                >
                    + Add Subject
                </button>
            </div>



            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input
                        type="text"
                        value={filters.name}
                        onChange={(e) => handleFilterChange('name', e.target.value)}
                        placeholder="Search by name..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                    <input
                        type="text"
                        value={filters.code}
                        onChange={(e) => handleFilterChange('code', e.target.value)}
                        placeholder="Search by code..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                    <input
                        type="text"
                        value={filters.course}
                        onChange={(e) => handleFilterChange('course', e.target.value)}
                        placeholder="Search by course..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Subject"
            >
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Subject Name"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="text"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        placeholder="Subject Code"
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
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="Semester"
                        min="1"
                        className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                        required
                    />
                    <input
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="Credits"
                        min="1"
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
                            Add Subject
                        </button>
                    </div>
                </form>
            </Modal>

            <ResponsiveTable headers={tableHeaders}>
                {currentSubjects?.length > 0 ? (
                    currentSubjects.map((subject, index) => (
                        <tr key={subject._id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {subject.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {subject.subjectCode}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {subject.course?.name || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {subject.semester}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {subject.credits}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex gap-4">
                                    <FaEdit
                                        onClick={() => handleEdit(subject)}
                                        color='blue' size={18} className='cursor-pointer' />
                                    <MdDelete
                                        onClick={() => handleDelete(subject._id)}
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
                        <td colSpan={7} className="px-4 py-6 text-sm text-gray-500 text-center italic">
                            {searchTerm ? "No matching subjects found" : "No subjects found"}
                        </td>
                    </tr>
                )}
            </ResponsiveTable>


            {/* Pagination */}
            {filteredSubjects?.length > itemsPerPage && (
                <div className="flex justify-center mt-6">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Previous
                        </button>

                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {number}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === pageNumbers.length}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === pageNumbers.length
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Subject;