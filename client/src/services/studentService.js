import api from './api'
import { setLoading, setError, setDashboardData } from '../redux/slices/studentSlice'

// Get dashboard data (subjects, timetable, notices)
export const getDashboard = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const { data } = await api.get('/student/dashboard')
        dispatch(setDashboardData(data))
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Something went wrong'))
    }
}