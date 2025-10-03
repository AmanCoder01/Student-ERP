import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDepartments, addDepartment, deleteDepartment } from '../../redux/slices/adminSlice';
import toast from 'react-hot-toast';
import { FaDeleteLeft } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { adminService } from '../../services/adminService';

const Department = () => {

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const { departments } = useSelector(state => state.admin);
    const dispatch = useDispatch();

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



    return (
        <div className="px-6 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Departments</h1>
                <button
                    onClick={() => setIsOpen(true)}
                    command="show-modal" commandfor="dialog" class="bg-black hover:bg-gray-800 py-2 px-6 text-white rounded-md shadow-md transition">+ Add Department</button>
            </div>

            {isOpen && <el-dialog>
                <dialog id="dialog" aria-labelledby="dialog-title" class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent">
                    <el-dialog-backdrop class="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

                    <div tabIndex="0" class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0">
                        <el-dialog-panel class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95">
                            <div class="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h1 id="dialog-title" class="text-lg leading-6 font-medium text-white text-center pb-4">Add Department</h1>

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
                            </div>

                        </el-dialog-panel>
                    </div>
                </dialog>
            </el-dialog>}

            <div >
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">S No.</th>
                            <th className="px-4 py-2 text-left">Department Name</th>
                            <th className="px-4 py-2 text-left">Code</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {
                            departments.map((item, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-gray-100 transition-colors duration-300"
                                >
                                    <td className="px-4 py-2 font-medium text-gray-700">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-2 text-gray-600">{item.name}</td>
                                    <td className="px-4 py-2 text-gray-600">{item.code}</td>
                                    {/* //actions edit and delete */}
                                    <td className="px-4 py-2 text-gray-600 flex gap-4">
                                        <FaEdit color='blue' size={18} className='cursor-pointer' />
                                        <MdDelete onClick={() => handleDelete(item._id)} color='red' size={20} className='cursor-pointer' />


                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Department
