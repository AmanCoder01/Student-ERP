import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loading: false,
    error: null,
    myClasses: [],
    todaysSlots: [],
    notices: [],
}

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        setDashboardData: (state, action) => {
            state.myClasses = action.payload.myClasses
            state.todaysSlots = action.payload.todaysSlots
            state.notices = action.payload.notices
            state.loading = false
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
})

export const { setLoading, setError, setDashboardData, clearError } = studentSlice.actions

export default studentSlice.reducer