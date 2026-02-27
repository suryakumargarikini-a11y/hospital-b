import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaCalendarCheck, 
  FaUserMd, 
  FaShieldAlt, 
  FaArrowRight, 
  FaStar, 
  FaUserFriends,
  FaAmbulance 
} from 'react-icons/fa';

const Home = () => {
  return (
    <div className="bg-white pt-16"> {/* pt-16 offsets fixed navbar */}

      {/* ===== HERO SECTION – Clean, no floating cards ===== */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-6">
                ⚕️ Trusted by 10,000+ patients
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Your Health,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Mission.
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl lg:mx-0 mx-auto">
                Book appointments with top-rated specialists in seconds. 
                No phone calls, no waiting – just quality healthcare at your fingertips.
              </p>
              
              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Get Started
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/doctors"
                  className="inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-full text-gray-700 bg-white border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Find Doctors
                </Link>
              </div>

              {/* Social proof - clean stats */}
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-5 text-gray-600">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-gray-400 ml-1">(2.5k reviews)</span>
                </div>
                <div className="flex items-center">
                  <FaUserFriends className="text-blue-500 mr-1" />
                  <span className="font-semibold">10k+</span>
                  <span className="text-gray-400 ml-1">patients</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image – clean, no floating badges */}
            <div className="relative lg:block flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"
                alt="Doctor consulting with patient"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto lg:mx-0 object-cover h-[400px] lg:h-[500px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why patients choose MediBook
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              We make healthcare accessible, convenient, and personal.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition">
              <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                <FaCalendarCheck className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Instant Booking
              </h3>
              <p className="text-gray-600">
                Schedule appointments in under 60 seconds, any time, any device.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition">
              <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                <FaUserMd className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Verified Specialists
              </h3>
              <p className="text-gray-600">
                All doctors are board-certified with real patient reviews.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gray-50 hover:shadow-xl transition">
              <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                <FaShieldAlt className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Privacy First
              </h3>
              <p className="text-gray-600">
                Your health data is encrypted and never shared without consent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMERGENCY BANNER – Quick access to emergency page ===== */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <FaAmbulance className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">Need emergency help?</h3>
                <p className="text-red-100">Call ambulance, police, or fire – immediate assistance</p>
              </div>
            </div>
            <Link
              to="/emergency"
              className="inline-flex items-center bg-white text-red-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition"
            >
              Emergency Services
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of patients who’ve simplified their healthcare journey.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition shadow-lg"
          >
            Create Free Account
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;