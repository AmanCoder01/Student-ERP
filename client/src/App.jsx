import { Navigate, Route, Routes } from 'react-router-dom'
import SecureRoute from './components/SecureRoute'
import AdminLayout from './layouts/AdminLayout'
import { fakeUser } from './auth/fakeAuth'
import AdminDashboard from './pages/admin/AdminDashboard'
import Department from './pages/admin/Department'
import Course from './pages/admin/Course'
import Batch from './pages/admin/Batch '
import Login from './pages/auth/Login'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './redux/slices/authSlice'
import toast from 'react-hot-toast'
import Loader from './components/Loader'
import { adminService } from './services/adminService'
import Section from './pages/admin/Section'
import Subject from './pages/admin/Subject'
import Teacher from './pages/admin/Teacher'
import Student from './pages/admin/Student'
import StudentLayout from './layouts/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import TeacherLayout from './layouts/TeacherLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TakeAttendance from './pages/teacher/TakeAttendance'
import SearchAttendance from './pages/teacher/SearchAttendance'
import AttendanceHistory from './pages/teacher/AttendanceHistory'

const App = () => {

  const [isInitialized, setIsInitialized] = useState(false);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  const { user } = useSelector(state => state.auth);


  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsInitialized(true);
        return;
      }

      try {
        const res = await axios.get("http://localhost:3000/api/auth/get-profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        dispatch(setUser(res.data));
      } catch (error) {
        localStorage.removeItem("token"); // Clear invalid token
        toast.error(error.response?.data?.message || "Authentication failed");
      } finally {
        setIsInitialized(true);
      }
    };


    fetchUser();
  }, [dispatch, token]);

  if (!isInitialized) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader />
      </div>
    )

    // Or your loading component
  }


  return (
    <Routes>
      <Route path="/login"
        element={
          user && token ? <Navigate to={`/${user.role}`} replace /> : <Login />
        } />

      {/* Admin Routes */}
      <Route
        path="/admin/*"
        element={
          <SecureRoute allowedRoles={["Admin"]} >
            <AdminLayout />
          </SecureRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="course" element={<Course />} />
        <Route path="department" element={<Department />} />
        <Route path="batch" element={<Batch />} />
        <Route path="section" element={<Section />} />
        <Route path="subject" element={<Subject />} />
        <Route path="teacher" element={<Teacher />} />
        <Route path="student" element={<Student />} />
      </Route>


      {/* Student Routes */}
      <Route path="/student" element={
        <SecureRoute allowedRoles={['student']}>
          <StudentLayout />
        </SecureRoute>
      }>
        <Route index element={<StudentDashboard />} />

      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <SecureRoute allowedRoles={['Teacher']}>
          <TeacherLayout />
        </SecureRoute>
      }>
        <Route index element={<TeacherDashboard />} />
        <Route path='take-attendance' element={<TakeAttendance />} />
        <Route path='student-attendance' element={<SearchAttendance />} />
        <Route path='attendance-history' element={<AttendanceHistory  />} />  
      </Route>


      <Route
        path="/"
        element={
          user && token ? <Navigate to={`/${user.role.toLowerCase()}`} replace /> : <Navigate to="/login" replace />
        }
      />


      {/* Fallback */}
      <Route path="/unauthorized" element={<h1 className="text-center text-red-500 mt-10">Unauthorized</h1>} />
      <Route path="*" element={<h1 className="text-center mt-10">404 Page Not Found</h1>} />
    </Routes>
  )
}

export default App
