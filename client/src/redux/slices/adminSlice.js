import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dashboardData: null,
    departments: [],
    courses: [],
    batches: [],
    sections: [],
    subjects: [],
    teachers:[],
    students:[]
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            state.dashboardData = action.payload;
        },
        getDepartments: (state, action) => {
            state.departments = action.payload;
        },
        addDepartment: (state, action) => {

            state.departments.push(action.payload);
        },
        deleteDepartment: (state, action) => {
            state.departments = state.departments.filter(
                (department) => department._id !== action.payload
            );
        },
        getCourses: (state, action) => {
            state.courses = action.payload;
        },
        addCourse: (state, action) => {
            console.log(action.payload);

            state.courses.push(action.payload);
        },
        deleteCourse: (state, action) => {
            state.courses = state.courses.filter(
                (course) => course._id !== action.payload
            );
        },
        getBatches: (state, action) => {
            state.batches = action.payload;
        },
        addBatch: (state, action) => {
            state.batches.push(action.payload);
        },
        deleteBatch: (state, action) => {
            state.batches = state.batches.filter(
                (batch) => batch._id !== action.payload
            );
        },
        getSections: (state, action) => {
            state.sections = action.payload;
        },
        addSection: (state, action) => {
            state.sections.push(action.payload);
        },
        deleteSection: (state, action) => {
            state.sections = state.sections.filter(
                (section) => section._id !== action.payload
            );
        },
        getSubjects: (state, action) => {
            state.subjects = action.payload;
        },
        addSubject: (state, action) => {
            state.subjects.push(action.payload);
        },
        deleteSubject: (state, action) => {
            state.subjects = state.subjects.filter(
                (subject) => subject._id !== action.payload
            );
        },
        getTeachers: (state, action) => {
            state.teachers = action.payload;
        },
        addTeacher: (state, action) => {
            state.teachers.push(action.payload);
        },
        updateTeacher: (state, action) => {
            state.teachers = state.teachers.map(teacher =>
                teacher._id === action.payload._id ? action.payload : teacher
            );
        },
        deleteTeacher: (state, action) => {
            state.teachers = state.teachers.filter(teacher => teacher._id !== action.payload);
        },
        getStudents: (state, action) => {
            state.students = action.payload;
        },
        addStudent: (state, action) => {
            state.students.push(action.payload);
        },
        updateStudent: (state, action) => {
            state.students = state.students.map(student =>
                student._id === action.payload._id ? action.payload : student
            );
        },
        deleteStudent: (state, action) => {
            state.students = state.students.filter(
                student => student._id !== action.payload
            );
        },
        
    },
});

export const {
    getDepartments,
    addDepartment,
    deleteDepartment,
    setDashboardData,
    getCourses,
    addCourse,
    deleteCourse,
    getBatches,
    addBatch,
    deleteBatch,
    getSections,
    addSection,
    deleteSection,
    getSubjects,
    addSubject,
    deleteSubject,
    getTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    getStudents,
    addStudent,
    updateStudent,
    deleteStudent,
} = adminSlice.actions;
export default adminSlice.reducer;
