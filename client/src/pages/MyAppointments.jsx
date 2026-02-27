import React, { useEffect } from 'react';
import { useAppointments } from '../context/AppointmentContext';
import { FaCalendarAlt, FaUserMd, FaClock } from 'react-icons/fa';

const MyAppointments = () => {
  const { appointments, fetchAppointments } = useAppointments();

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            My Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all your scheduled visits.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No appointments yet
            </h2>
            <p className="text-gray-500 mb-6">
              Book your first appointment with one of our specialists.
            </p>
            <a
              href="/book-appointment"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Book Now
            </a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {app.patientName}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaUserMd className="mr-2 text-blue-500" />
                      {app.doctor}
                    </p>
                    <p className="text-gray-600 flex items-center mt-2">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {app.date} at {app.time}
                    </p>
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Reason:</span> {app.reason}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;