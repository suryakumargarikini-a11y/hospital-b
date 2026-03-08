import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentContext';
import { FaCalendarPlus, FaListAlt, FaSignOutAlt, FaRegCalendarTimes, FaUserMd } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { appointments, fetchAppointments, loading } = useAppointments();
  const navigate = useNavigate();

  // Health Quotes Data
  const healthQuotes = [
    "“The greatest wealth is health.” – Virgil",
    "“Let food be thy medicine and medicine be thy food.” – Hippocrates",
    "“Take care of your body. It’s the only place you have to live.” – Jim Rohn",
    "“Good health is not something we can buy. However, it can be an extremely valuable savings account.” – Anne Wilson Schaef",
    "“It is health that is real wealth and not pieces of gold and silver.” – Mahatma Gandhi",
    "“To keep the body in good health is a duty... otherwise we shall not be able to keep our mind strong and clear.” – Buddha",
    "“A sad soul can kill you quicker, far quicker, than a germ.” – John Steinbeck",
    "“Physical fitness is the first requisite of happiness.” – Joseph Pilates",
    "“The groundwork of all happiness is health.” – Leigh Hunt"
  ];

  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * healthQuotes.length));

  useEffect(() => {
    // Rotate quote every 15 seconds
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % healthQuotes.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

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

  // Helper to get initials for the avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen relative bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">

      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Welcome Header (Glassmorphism) */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 mb-10 flex flex-col md:flex-row justify-between items-center transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            {/* User Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
              {getInitials(user?.name)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome back, {user?.name.split(' ')[0]} <span className="animate-pulse inline-block">👋</span>
              </h1>
              <p className="text-gray-500 mt-2 font-medium">
                {user?.role === 'admin' ? 'Manage hospital operations and patients.' : 'Manage your health journey seamlessly.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 bg-white/80 backdrop-blur-md border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-sm"
          >
            <FaSignOutAlt className="text-lg group-hover:-translate-x-1 transition-transform" />
            Logout
          </button>
        </div>

        {/* Dynamic Health Quote Banner */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="inline-block bg-white/40 backdrop-blur-md border border-white/40 rounded-full px-8 py-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all duration-500 cursor-default">
            <p className="text-gray-700 font-medium italic animate-pulse-slow">
              ✨ {healthQuotes[quoteIndex]}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Action 1 */}
          <Link
            to="/book-appointment"
            className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white rounded-3xl p-8 shadow-xl shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/40 group cursor-pointer"
          >
            {/* Background Icon */}
            <FaCalendarPlus className="absolute -right-8 -bottom-8 text-white/10 text-9xl transform rotate-12 transition-transform group-hover:scale-110 duration-500" />

            <div className="relative z-10">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                <FaCalendarPlus className="text-3xl" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Book Appointment</h2>
              <p className="text-blue-100/90 text-lg font-medium max-w-[250px]">
                Schedule a new visit with our top specialists.
              </p>
            </div>
          </Link>

          {/* Action 2 */}
          <Link
            to="/my-appointments"
            className="relative overflow-hidden bg-white text-gray-800 rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-300/50 group cursor-pointer"
          >
            {/* Background Icon */}
            <FaListAlt className="absolute -right-8 -bottom-8 text-gray-500/5 text-9xl transform -rotate-12 transition-transform group-hover:scale-110 duration-500" />

            <div className="relative z-10">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                <FaListAlt className="text-3xl text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">
                My Appointments <span className="text-blue-600">({appointments?.length || 0})</span>
              </h2>
              <p className="text-gray-500 text-lg font-medium max-w-[250px]">
                View, manage, or cancel your existing bookings.
              </p>
            </div>
          </Link>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
              Upcoming Appointments
            </h3>
            {appointments?.length > 3 && (
              <Link to="/my-appointments" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                View All →
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
          ) : appointments?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                <FaRegCalendarTimes className="text-5xl text-indigo-300" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">No Appointments Yet</h4>
              <p className="text-gray-500 mb-6 max-w-sm">
                You don't have any upcoming visits scheduled. Book an appointment to get started.
              </p>
              <Link
                to="/book-appointment"
                className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
              >
                Book Now
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments?.slice(0, 3).map((app) => (
                <div key={app._id || app.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition duration-300 relative overflow-hidden flex flex-col h-full">
                  {/* Status Accent Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 
                    ${app.status === 'confirmed' ? 'bg-green-500' :
                      app.status === 'pending' ? 'bg-yellow-400' : 'bg-red-500'}`}
                  ></div>

                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 w-10 h-10 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                          <FaUserMd />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{app.doctor}</p>
                          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mt-1">{app.reason}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-4 pl-2">
                      <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                        <span>{app.date}</span>
                        <span className="text-indigo-600">{app.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pl-2 mt-auto">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                      ${app.status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' :
                        app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-red-50 text-red-700 border border-red-200'}`}>
                      {app.status}
                    </span>
                    <Link to={`/my-appointments`} className="text-gray-400 hover:text-indigo-600 transition opacity-0 group-hover:opacity-100 text-sm font-medium">
                      Details →
                    </Link>
                  </div>
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