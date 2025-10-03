import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDashboard } from '../../services/studentService'
import Loader from '../../components/Loader'

const StudentDashboard = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { loading, myClasses, todaysSlots, notices } = useSelector(state => state.student)

    useEffect(() => {
        dispatch(getDashboard())
    }, [dispatch])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">Welcome, {user?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* My Subjects Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">My Subjects</h2>
                    <div className="space-y-4">
                        {myClasses?.map(classItem => (
                            <div key={classItem._id} className="border-b pb-3">
                                <h3 className="font-medium">{classItem.subject.name}</h3>
                                <p className="text-gray-600 text-sm">Teacher: {classItem.teacher.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Today's Timetable Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Today's Timetable</h2>
                    <div className="space-y-4">
                        {todaysSlots?.map(slot => (
                            <div key={slot._id} className="border-b pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{slot.class?.subject.name}</h3>
                                        <p className="text-gray-600 text-sm">
                                            Teacher: {slot.class?.teacher.name}
                                        </p>
                                    </div>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        {slot.startTime} - {slot.endTime}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {todaysSlots?.length === 0 && (
                            <p className="text-gray-500">No classes scheduled for today</p>
                        )}
                    </div>
                </div>

                {/* Notices Section */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Notices</h2>
                    <div className="space-y-4">
                        {notices?.map(notice => (
                            <div key={notice._id} className="border-b pb-3">
                                <h3 className="font-medium">{notice.title}</h3>
                                <p className="text-gray-600 text-sm line-clamp-2">{notice.content}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {notices?.length === 0 && (
                            <p className="text-gray-500">No recent notices</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboard
