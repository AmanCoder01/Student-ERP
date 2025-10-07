import api from './api';
import { getDepartments, addDepartment, deleteDepartment, getCourses, addCourse, deleteCourse, setDashboardData, getBatches, addBatch, deleteBatch, getSections, addSection, deleteSection, deleteSubject, addSubject, getSubjects, getTeachers, getStudents, addTeacher } from '../redux/slices/adminSlice';
import toast from 'react-hot-toast';

export const adminService = {

    fetchDashboardData: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/dashboard');
            dispatch(setDashboardData(data));
        } catch (error) {
            toast.error("Failed to fetch dashboard data");
        }
    },

    fetchDepartments: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/departments');
            dispatch(getDepartments(data));
        } catch (error) {
            toast.error("Failed to fetch departments");
        }
    },

    createDepartment: (formData) => async (dispatch) => {
        try {
            const { data } = await api.post('/admin/departments', formData);
            dispatch(addDepartment(data.department));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }
    },

    removeDepartment: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/departments/${id}`);
            dispatch(deleteDepartment(id));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    fetchCourses: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/courses');
            dispatch(getCourses(data));
        } catch (error) {
            toast.error("Failed to fetch courses");
        }
    },

    createCourse: (formData, departments) => async (dispatch) => {
        try {

            const { data } = await api.post('/admin/courses', formData);
            dispatch(addCourse({
                ...data.course,
                department: departments.find(dept => dept._id === formData.department)
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }
    },

    removeCourse: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/courses/${id}`);
            dispatch(deleteCourse(id));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    fetchBatches: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/batches');
            dispatch(getBatches(data));
        } catch (error) {
            toast.error("Failed to fetch batches");
        }
    },

    createBatch: (formData, courses) => async (dispatch) => {
        try {
            const { data } = await api.post('/admin/batches', formData);
            dispatch(addBatch({ ...data.batch, course: courses.find(course => course._id === formData.courseId) }));
            toast.success(data.message);
            return true;
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }
    },

    removeBatch: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/batches/${id}`);
            dispatch(deleteBatch(id));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    fetchSections: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/sections');

            dispatch(getSections(data));
        } catch (error) {
            toast.error("Failed to fetch sections");
        }
    },

    createSection: (formData, courses, batches) => async (dispatch) => {
        try {
            const { data } = await api.post('/admin/sections', formData);
            dispatch(addSection({ ...data.sec, batch: batches.find(batch => batch._id === formData.batch), course: courses.find(course => course._id === data.sec.batch.course) }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }
    },

    removeSection: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/sections/${id}`);
            dispatch(deleteSection(id));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },
    fetchSubjects: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/subjects');

            dispatch(getSubjects(data));
        } catch (error) {
            toast.error("Failed to fetch subjects");
        }
    },

    createSubject: (formData, courses) => async (dispatch) => {
        try {
            const { data } = await api.post('/admin/subjects', formData);
            dispatch(addSubject({
                ...data.subject,
                course: courses.find(course => course._id === formData.course)
            }));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;
        }
    },

    removeSubject: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/subjects/${id}`);
            dispatch(deleteSubject(id));
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    fetchTeachers: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/teachers');
            dispatch(getTeachers(data));
        } catch (error) {
            toast.error("Failed to fetch teachers");
        }
    },

    // Create new teacher
    createTeacher: (formData) => async (dispatch) => {
        try {
            console.log(formData);

            const { data } = await api.post('/admin/teachers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // Important for file upload
                }
            });
            console.log(data.teacherProfile);

            dispatch(addTeacher(data.teacherProfile));
            toast.success(data.message);
            return true;
        } catch (error) {
            console.log(error);

            toast.error(error.response?.data?.message || "Failed to create teacher");
            return false;
        }
    },

    // Update existing teacher
    updateTeacher: (id, formData) => async (dispatch) => {
        try {
            const { data } = await api.put(`/admin/teachers/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'  // Important for file upload
                }
            });
            dispatch(updateTeacher(data.teacher));
            toast.success(data.message);
            return true;
        } catch (error) {
            console.log(error);

            toast.error(error.response?.data?.message || "Failed to update teacher");
            return false;
        }
    },

    // Delete teacher
    removeTeacher: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/teachers/${id}`);
            dispatch(deleteTeacher(id));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete teacher");
            return false;
        }
    },

    // Get single teacher details (optional, if needed)
    getTeacherById: (id) => async () => {
        try {
            const { data } = await api.get(`/admin/teachers/${id}`);
            return data;
        } catch (error) {
            toast.error("Failed to fetch teacher details");
            return null;
        }
    },

    fetchStudents: () => async (dispatch) => {
        try {
            const { data } = await api.get('/admin/students');
            // console.log(data);

            dispatch(getStudents(data.students));
        } catch (error) {
            toast.error("Failed to fetch students");
        }
    },

    createStudent: (formData) => async (dispatch) => {
        try {
            const { data } = await api.post('/admin/students', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(addStudent(data.student));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create student");
            return false;
        }
    },

    updateStudent: (id, formData) => async (dispatch) => {
        try {
            const { data } = await api.put(`/admin/students/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            dispatch(updateStudent(data.student));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update student");
            return false;
        }
    },

    removeStudent: (id) => async (dispatch) => {
        try {
            const { data } = await api.delete(`/admin/students/${id}`);
            dispatch(deleteStudent(id));
            toast.success(data.message);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete student");
            return false;
        }
    },
};