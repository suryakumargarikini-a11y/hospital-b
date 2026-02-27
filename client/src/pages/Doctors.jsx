import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaArrowRight } from 'react-icons/fa';
import { getDoctors } from '../services/api';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors();
        console.log('Doctors API response:', data);
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specialties = ['All', ...new Set(doctors?.map(doc => doc?.specialty) || [])];

  const filteredDoctors = filter === 'All' 
    ? doctors 
    : doctors?.filter(doc => doc?.specialty === filter) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our Specialists
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Board‑certified doctors with years of experience and thousands of happy patients.
          </p>
        </div>

        {doctors?.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setFilter(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  filter === specialty
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border hover:border-blue-300'
                }`}
              >
                {specialty}
              </button>
            ))}
          </div>
        )}

        {!doctors?.length ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <p className="text-gray-500 text-lg">No doctors available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{doctor.name}</h3>
                      <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                      <div className="flex items-center mt-1">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="text-gray-700 font-semibold">{doctor.rating}</span>
                        <span className="text-gray-400 ml-2 text-sm">{doctor.patients} patients</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Experience: {doctor.experience}</span>
                    
                    {/* ✅ PASS BOTH DOCTOR NAME AND SPECIALTY */}
                    <Link
                      to="/book-appointment"
                      state={{ 
                        doctorName: doctor.name,
                        department: doctor.specialty
                      }}
                      className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md group"
                    >
                      Book Now
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;