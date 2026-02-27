import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaHeartbeat, FaBrain, FaBaby, FaBone, FaEye, FaTooth, FaStethoscope, FaLungs,
  FaArrowRight 
} from 'react-icons/fa';
import { getServices } from '../services/api';

const iconMap = {
  heartbeat: <FaHeartbeat className="text-4xl text-red-500" />,
  brain: <FaBrain className="text-4xl text-purple-500" />,
  baby: <FaBaby className="text-4xl text-pink-500" />,
  bone: <FaBone className="text-4xl text-orange-500" />,
  eye: <FaEye className="text-4xl text-blue-500" />,
  tooth: <FaTooth className="text-4xl text-teal-500" />,
  stethoscope: <FaStethoscope className="text-4xl text-green-500" />,
  lungs: <FaLungs className="text-4xl text-indigo-500" />,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        console.log('Services API response:', data);
        
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data && data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
          setError('Invalid data format received from server');
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setError(error.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Services</h3>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We offer a wide range of specialised healthcare services delivered by experienced professionals.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className={`${service.bgColor || 'bg-gray-50'} rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    {iconMap[service.icon] || <FaStethoscope className="text-4xl text-gray-500" />}
                  </div>
                  <span className="text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
                    {service.doctors}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                
                {/* ✅ PASS DEPARTMENT NAME TO BOOKING FORM */}
                <Link
                  to="/book-appointment"
                  state={{ 
                    department: service.title,
                    doctorName: ''
                  }}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
                >
                  Book Appointment
                  <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;