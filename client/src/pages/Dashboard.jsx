import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { FaCalendarPlus, FaListAlt, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { appointments, fetchAppointments, loading } = useAppointments();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name} 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'admin' ? 'Manage patients and appointments' : 'Manage your appointments seamlessly'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/book-appointment"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl p-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <FaCalendarPlus className="text-4xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">Book New Appointment</h2>
            <p className="text-blue-100">Schedule a visit with our specialists</p>
          </Link>

          <Link
            to="/my-appointments"
            className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <FaListAlt className="text-4xl mb-4 text-gray-700" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              My Appointments ({appointments?.length || 0})
            </h2>
            <p className="text-gray-600">View and manage your bookings</p>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Upcoming Appointments
          </h3>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : appointments?.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow">
              <div className="text-gray-400 text-6xl mb-4">📅</div>
              <p className="text-gray-500 text-lg">No upcoming appointments</p>
              <Link
                to="/book-appointment"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Book your first appointment →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {appointments?.slice(0, 3).map((app) => (
                <div key={app.id} className="bg-white rounded-lg p-6 shadow hover:shadow-md transition">
                  <p className="font-semibold text-lg text-gray-800">{app.doctor}</p>
                  <p className="text-gray-600">{app.date} at {app.time}</p>
                  <p className="text-sm text-gray-500 mt-2">{app.reason}</p>
                  <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold
                    ${app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;