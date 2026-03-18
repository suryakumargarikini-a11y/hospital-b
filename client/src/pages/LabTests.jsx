import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAvailableTests, bookLabTest } from '../services/api';
import { FaVial, FaInfoCircle, FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LabTests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedTest, setSelectedTest] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getAvailableTests();
        setTests(data);
      } catch (error) {
        toast.error('Failed to load lab tests');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleBook = (test) => {
    if (!user) {
      toast.error('Please login to book a lab test');
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      toast.error('Only patients can book lab tests online');
      return;
    }
    setSelectedTest(test);
  };

  const confirmBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time) {
      toast.error('Please select both date and time');
      return;
    }

    try {
      setBookingLoading(true);
      await bookLabTest({
        testId: selectedTest._id,
        testName: selectedTest.name,
        date: bookingData.date,
        time: bookingData.time
      }, user.id);
      
      toast.success(`${selectedTest.name} booked successfully!`);
      setSelectedTest(null);
      setBookingData({ date: '', time: '' });
      // Could navigate to /my-bookings if that page existed, or just dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Diagnostic Lab Tests
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Book your medical lab tests online. Accurate results, home sample collection available.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tests.map(test => (
              <div key={test._id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                  <FaVial />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{test.name}</h2>
                <p className="text-gray-500 mb-6 flex-grow">{test.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-1">
                    <FaInfoCircle className="text-indigo-400" />
                    <span>Prep: {test.preparation || 'None'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="text-2xl font-extrabold text-gray-900">
                    ₹{test.price}
                  </div>
                  <button
                    onClick={() => handleBook(test)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/30"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {selectedTest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Book Lab Test</h3>
                    <p className="text-indigo-100 font-medium">{selectedTest.name}</p>
                  </div>
                  <button onClick={() => setSelectedTest(null)} className="text-white hover:text-gray-200 transition">
                    <span className="text-3xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <form onSubmit={confirmBooking} className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition bg-gray-50"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Time Slot</label>
                    <div className="relative">
                      <FaRegClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="time"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition bg-gray-50"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-500/30 flex justify-center items-center"
                  >
                    {bookingLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      `Confirm Booking (₹${selectedTest.price})`
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTest(null)}
                    className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabTests;
