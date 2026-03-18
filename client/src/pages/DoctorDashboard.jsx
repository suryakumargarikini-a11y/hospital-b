import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { FaUserInjured, FaNotesMedical, FaCheckCircle, FaPrescriptionBottleAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const { appointments, fetchAppointments, loading } = useAppointments();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchAppointments();
    } else if (user && user.role !== 'doctor') {
      navigate('/dashboard'); // Redirect non-doctors
    }
  }, [user]);

  if (!user || user.role !== 'doctor') {
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const pendingAppointments = appointments?.filter(app => app.status === 'pending') || [];
  const confirmedAppointments = appointments?.filter(app => app.status === 'confirmed') || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dr. {user.name}</h1>
            <p className="text-gray-500 mt-1">Manage your consultations and patients.</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 text-red-600 bg-red-50 hover:bg-red-100 px-6 py-2 rounded-xl font-medium transition"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><FaUserInjured className="text-2xl" /></div>
              <div>
                <p className="text-gray-500 text-sm">Total Patients</p>
                <h3 className="text-2xl font-bold">{appointments?.length || 0}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-yellow-50 text-yellow-600 rounded-xl"><FaNotesMedical className="text-2xl" /></div>
              <div>
                <p className="text-gray-500 text-sm">Pending</p>
                <h3 className="text-2xl font-bold">{pendingAppointments.length}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-green-50 text-green-600 rounded-xl"><FaCheckCircle className="text-2xl" /></div>
              <div>
                <p className="text-gray-500 text-sm">Confirmed</p>
                <h3 className="text-2xl font-bold">{confirmedAppointments.length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6">Today's Appointments</h2>
          {loading ? (
             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600 mx-auto"></div>
          ) : appointments?.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No appointments scheduled.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-gray-500">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Date & Time</th>
                    <th className="pb-3 font-medium">Reason</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((app) => (
                    <tr key={app._id} className="border-b last:border-0">
                      <td className="py-4 font-medium">{app.patientName}</td>
                      <td className="py-4 text-sm text-gray-600">{app.date} | {app.time}</td>
                      <td className="py-4 text-sm text-gray-500">{app.reason || 'N/A'}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Link to={`/medical-records/new/${app._id}?patient=${encodeURIComponent(app.patientName)}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-end gap-1">
                          <FaPrescriptionBottleAlt /> Add Record
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
