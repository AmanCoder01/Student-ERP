import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminService } from '../../services/adminService';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import CSVUpload from './CSVUpload';
import { RxAvatar } from 'react-icons/rx';
import SearchBar from './SearchBar';

const Student = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
    const [search, setSearch] = useState('');

    const [csvUploading, setCsvUploading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        studentId: '',
        rollNumber: '',
        phone: '',
        batch: '',
        section: '',
        semester: '',
        guardianName: '',
        guardianPhone: '',
        address: '',
        dob: '',
        profileImage: null
    });




    const dispatch = useDispatch();
    const { batches, sections, students, totalStudents, studentPage, studentPages } = useSelector(state => state.admin);





    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setCurrentPage(1);
    };



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
                return;
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



    const currentStudents = students || [];
    const pageCount = studentPages || Math.ceil((totalStudents || 0) / itemsPerPage);

    console.log(students);
    

    useEffect(() => {
        // fetch students when component mounts and whenever page/search changes
        dispatch(adminService.fetchStudents(currentPage, itemsPerPage, search));
        // also fetch batches/sections once (you can keep those separate)
        dispatch(adminService.fetchBatches());
        dispatch(adminService.fetchSections());
    }, [dispatch, currentPage, itemsPerPage, search]);



    return (
        <div>
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-300">Students</h1>
                 <SearchBar search={search} setSearch={setSearch} setCurrentPage={setCurrentPage} />
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 sm:mt-0 sm:w-auto bg-black hover:bg-gray-800 py-2 px-4 sm:px-6 text-white rounded-md shadow-md transition dark:bg-gray-800 mr-24"
                >
                    + Add Student
                </button>
            </div>


            {/* CSV Bulk Upload Section */}
            <CSVUpload csvUploading={csvUploading} setCsvUploading={setCsvUploading} />



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
                                    {batch.name}
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
                    <tr key={student._id} className="dark:hover:bg-gray-900 dark:bg-gray-800">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="px-4 py-2">
                            <img
                                src={student.profileImage?.url || "https://cdn-icons-png.flaticon.com/512/2886/2886011.png"}
                                alt={student.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.studentId}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.rollNumber}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.batch?.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.section?.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{student.semester}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
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
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px dark:bg-gray-800">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(pageCount)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium 
                                    ${currentPage === i + 1
                                        ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-200'
                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                            disabled={currentPage === pageCount}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
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