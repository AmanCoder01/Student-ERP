import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { adminService } from '../../services/adminService';
import Modal from '../../components/Modal';
import ResponsiveTable from '../../components/ResponsiveTable';

const Department = () => {

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [hod, setHod] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { departments, teachers } = useSelector(state => state.admin);
    const dispatch = useDispatch();

    console.log(departments);
    console.log(teachers);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await dispatch(adminService.createDepartment({ name, code }));
        if (success) {
            setName("");
            setCode("");
            setIsOpen(false);
        }
    };

    const handleDelete = (id) => {
        dispatch(adminService.removeDepartment(id));
    };

    useEffect(() => {
        dispatch(adminService.fetchDepartments());
    }, [dispatch]);


    const tableHeaders = ["S No.", "Department Name", "Code", "Hod", "Actions"];


    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold dark:text-gray-300">Departments</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    command="show-modal" commandfor="dialog" class="bg-black hover:bg-gray-800 py-2 px-6 mr-24 dark:bg-gray-800 cursor-pointer text-white rounded-md shadow-md transition">+ Add Department</button>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Department"
            >
                <form onSubmit={handleSubmit} action="">
                    <div className="mt-2">
                        <input type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name" id="name"
                            placeholder="Department Name"
                            className="bg-gray-700 w-full py-2 px-4 
                                         text-white border-none outline-none rounded-md shadow"
                            required />
                    </div>
                    <div className="mt-4 mb-4">
                        <input type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            name="code" id="code"
                            placeholder="Department Code"
                            className="bg-gray-700 w-full py-2 px-4 
                                         text-white border-none outline-none rounded-md shadow"
                            required />
                    </div>

                    <div>
                        <select
                            value={hod}
                            onChange={(e) => setHod(e.target.value)}
                            className="bg-gray-700 w-full py-2 px-4 mb-4 text-white rounded-md"
                            required >
                            <option value="">Select HOD</option>
                            {
                                teachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>
                                        {teacher.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

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
                            Add Department
                        </button>
                    </div>

                </form>
            </Modal>

            <ResponsiveTable headers={tableHeaders}>
                {departments?.length > 0 ? (
                    departments?.map((department, index) => (
                        <tr key={department._id} className="dark:hover:bg-gray-900 dark:bg-gray-800">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {index + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {department.name}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {department.code}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                {department.teacher?.name || "N/A"}
                            </td>

                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                <div className="flex gap-4">
                                    <FaEdit
                                        // onClick={() => handleEdit(subject)}
                                        color='blue' size={18} className='cursor-pointer' />
                                    <MdDelete
                                        onClick={() => handleDelete(department._id)}
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
                            { "No departments found"}
                        </td>
                    </tr>
                )}
            </ResponsiveTable>
        </div>
    )
}

export default Department
