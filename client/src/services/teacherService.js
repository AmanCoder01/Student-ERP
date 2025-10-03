import api from './api'; // Your pre-configured axios instance
import { setTeacherDashboardData, setLoading, setError, setCourses, setCourseDetails, setBatchDetails, setSectionStudents, clearAttendanceForm, setSearchedAttendance, setAttendanceHistory } from '../redux/slices/teacherSlice';
import { toast } from 'react-hot-toast'; // Or your preferred toast library


// Reusable handler for GET requests (fetching data)
const apiGetHandler = (apiCall, loadingKey, successAction, errorToastMessage) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: loadingKey, value: true }));
        const { data } = await apiCall();
        const payload = loadingKey === 'dashboard' ? data.data : data;
        dispatch(successAction(payload));
    } catch (error) {
        toast.error(errorToastMessage);
        dispatch(setError(error.response?.data?.message || 'An error occurred'));
    } finally {
        dispatch(setLoading({ key: loadingKey, value: false }));
    }
};


export const teacherService = {

    fetchDashboardData: () => async (dispatch) => {
        try {
            dispatch(setLoading({ key: 'dashboard', value: true }));

            const { data } = await api.get('/teacher/dashboard');
            dispatch(setTeacherDashboardData(data.data));
            dispatch(setLoading({ key: 'dashboard', value: false }));

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
            dispatch(setLoading({ key: 'dashboard', value: false }));
        }
    },

    /**
     * Example of another function you could add in the future.
     * Fetches all attendance records created by the teacher.
     */
    fetchAllAttendance: () => async (dispatch) => {
        try {
            const { data } = await api.get('/teachers/attendance/all');
            // dispatch(setAllAttendance(data)); // You would need to create this action
        } catch (error) {
            toast.error("Failed to fetch attendance records");
        }
    },


    // 1. Get courses for the teacher
    getCourses: () => async (dispatch) => {
        try {
            dispatch(setLoading({ key: 'courses', value: true }));
            const { data } = await api.get('/teacher/my-courses');
            console.log(data);

            dispatch(setCourses(data));
        } catch (error) {
            toast.error("Failed to fetch courses");
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading({ key: 'courses', value: false }));
        }
    },

    // 2. Get subjects and batches for a selected course
    getCourseDetails: (courseId) => async (dispatch) => {
        try {
            dispatch(setLoading({ key: 'details', value: true }));
            const { data } = await api.get(`/teacher/course-details/${courseId}`);
            dispatch(setCourseDetails(data));
        } catch (error) {
            toast.error("Failed to fetch course details");
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading({ key: 'details', value: false }));
        }
    },

    // 3. Get sections and semester for a selected batch
    getBatchDetails: (batchId) => async (dispatch) => {
        try {
            dispatch(setLoading({ key: 'sections', value: true }));
            const { data } = await api.get(`/teacher/batch-details/${batchId}`);
            dispatch(setBatchDetails(data));
        } catch (error) {
            toast.error("Failed to fetch batch details");
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading({ key: 'sections', value: false }));
        }
    },

    // 4. Get students for a selected section
    getSectionStudents: (sectionId) => async (dispatch) => {
        try {
            dispatch(setLoading({ key: 'students', value: true }));
            const { data } = await api.get(`/teacher/section-students/${sectionId}`);
            dispatch(setSectionStudents(data));
        } catch (error) {
            toast.error("Failed to fetch students");
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading({ key: 'students', value: false }));
        }
    },

    // 5. Submit the final attendance
    submitAttendance: (payload) => async (dispatch) => {
        try {
            await api.post('/teacher/attendance', payload);
            toast.success("Attendance submitted successfully!");
            dispatch(clearAttendanceForm());
            return { success: true }; // Return success status to component
        } catch (error) {
            console.log(error);

            toast.error("Failed to submit attendance");
            dispatch(setError(error.message));
            return { success: false };
        }
    },

    getAttendanceHistory: () => apiGetHandler(
        () => api.get('/teacher/attendance/history'),
        'history',
        setAttendanceHistory,
        "Failed to fetch attendance history"
    ),

    // This is a POST request with a custom loading/success state, so we write it out manually.
    searchStudentAttendance: (payload) => async (dispatch) => {
        try {
            dispatch(setLoading({ key: 'search', value: true }));
            const { data } = await api.post('/teacher/student-attendance', payload);
            dispatch(setSearchedAttendance(data));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to search attendance");
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading({ key: 'search', value: false }));
        }
    },
};