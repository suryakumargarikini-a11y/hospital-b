import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaAmbulance, FaCog } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-md'
          : 'bg-white/30 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MediBook
            </span>
            <span className="text-blue-600 text-2xl">🏥</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link to="/doctors" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Doctors
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Services
            </Link>
            
            {/* Emergency Button */}
            <Link
              to="/emergency"
              className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
            >
              <FaAmbulance className="mr-1" />
              Emergency
            </Link>

            {user ? (
              <>
                {/* 👑 ADMIN LINK - Only visible to admin users */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
                  >
                    <FaCog className="mr-1" />
                    Admin
                  </Link>
                )}

                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium px-4 py-2 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg rounded-lg shadow-xl mt-2 p-4 absolute left-4 right-4 z-50 border border-gray-100">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Doctors
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
              
              {/* Mobile Emergency Link */}
              <Link
                to="/emergency"
                className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition"
                onClick={() => setIsOpen(false)}
              >
                <FaAmbulance className="mr-2" />
                Emergency
              </Link>

              {user ? (
                <>
                  {/* 👑 MOBILE ADMIN LINK */}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaCog className="mr-2" />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;