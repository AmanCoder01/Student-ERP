import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    // For Dashboard
    dashboardData: null,

    // For Take Attendance feature
    courses: [],
    subjects: [],
    batches: [],
    sections: [],
    students: [],
    currentSemester: null,

    attendanceHistory: [],
    searchedAttendance: null, // To store search result

    // Global UI states for the slice
    loading: {
        dashboard: false,
        courses: false,
        details: false, // For subjects/batches
        sections: false,
        students: false,
    },
    error: null,
};

const teacherSlice = createSlice({
    name: "teacher",
    initialState,
    reducers: {
        // --- GENERIC UI REDUCERS ---
        setLoading: (state, action) => {
            // Expects a payload like { key: 'courses', value: true }
            state.loading[action.payload.key] = action.payload.value;
        },
        setError: (state, action) => {
            state.error = action.payload;
            // Reset all loading states on error
            Object.keys(state.loading).forEach(key => { state.loading[key] = false; });
        },

        // --- DASHBOARD REDUCER ---
        setTeacherDashboardData: (state, action) => {
            state.dashboardData = action.payload;
            state.error = null; // Clear any previous errors
        },

        // --- TAKE ATTENDANCE REDUCERS ---
        setCourses: (state, action) => {
            state.courses = action.payload;
            state.error = null;
        },
        setCourseDetails: (state, action) => {
            state.subjects = action.payload.subjects;
            state.batches = action.payload.batches;
            // Clear downstream data
            state.sections = [];
            state.students = [];
            state.currentSemester = null;
            state.error = null;
        },
        setBatchDetails: (state, action) => {
            state.sections = action.payload.sections;
            state.currentSemester = action.payload.currentSemester;
            // Clear downstream data
            state.students = [];
            state.error = null;
        },
        setSectionStudents: (state, action) => {
            state.students = action.payload;
            state.error = null;
        },

        setSubjects: (state, action) => {
            state.subjects = action.payload;
            state.error = null;
        },




        clearAttendanceForm: (state) => {
            // Reset state after successful submission
            state.students = [];
            state.currentSemester = null;
            state.subjects = [];
            state.batches = [];
            state.sections = [];
        },
        setAttendanceHistory: (state, action) => {
            state.attendanceHistory = action.payload;
        },
        setSearchedAttendance: (state, action) => {
            state.searchedAttendance = action.payload;
        },
        clearSearchedAttendance: (state) => {
            state.searchedAttendance = null;
        }
    },

});

export const {
    setLoading,
    setError,
    setTeacherDashboardData,
    setCourses,
    setCourseDetails,
    setBatchDetails,
    setSectionStudents,
    clearAttendanceForm,
    setAttendanceHistory,
    setSearchedAttendance,
    clearSearchedAttendance,
    setSubjects
} = teacherSlice.actions;

export default teacherSlice.reducer;