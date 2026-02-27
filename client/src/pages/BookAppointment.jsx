import React from 'react';
import AppointmentForm from '../components/forms/AppointmentForm';

const BookAppointment = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">Book an Appointment</h1>
            <p className="text-blue-100 mt-2">
              Fill in the details below and we’ll confirm your slot.
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <AppointmentForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;