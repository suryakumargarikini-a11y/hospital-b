import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition">
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">Contact Us</h1>
            <p className="text-blue-100 mt-2">We're here to help – 24/7 support</p>
          </div>
          
          <div className="p-8 sm:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in touch</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Address</p>
                      <p className="text-gray-600">123 Healthcare Ave, Medical District, NY 10001</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaPhone className="text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Phone</p>
                      <p className="text-gray-600">+1 (800) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaEnvelope className="text-blue-600 mt-1 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">Email</p>
                      <p className="text-gray-600">support@medibook.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send a message</h2>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <textarea
                    rows="3"
                    placeholder="How can we help?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;