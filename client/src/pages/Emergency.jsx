import React from 'react';
import { Link } from 'react-router-dom';
import { FaAmbulance, FaShieldAlt, FaFire, FaFlask, FaArrowLeft } from 'react-icons/fa';

const Emergency = () => {
  const emergencyContacts = [
    {
      id: 1,
      name: 'Ambulance',
      number: '108',
      icon: <FaAmbulance className="text-4xl" />,
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700',
      description: 'Medical emergency – 24/7 free service',
    },
    {
      id: 2,
      name: 'Police',
      number: '100',
      icon: <FaShieldAlt className="text-4xl" />,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'from-blue-700 to-blue-800',
      description: 'Law enforcement – immediate assistance',
    },
    {
      id: 3,
      name: 'Fire Brigade',
      number: '101',
      icon: <FaFire className="text-4xl" />,
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700',
      description: 'Fire and rescue services',
    },
    {
      id: 4,
      name: 'Poison Control',
      number: '1066',
      icon: <FaFlask className="text-4xl" />,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
      description: '24/7 poison information helpline',
    },
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
            🚨 Emergency Services
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-red-100">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 sm:px-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center">
              <FaAmbulance className="mr-3" />
              Emergency Assistance
            </h1>
            <p className="text-red-100 mt-2 text-lg">
              Life‑threatening? Call now. Immediate help available 24/7.
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <p className="text-gray-600 mb-8 text-lg">
              Tap any button to call the respective emergency service directly from your phone.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => handleCall(contact.number)}
                  className={`group bg-gradient-to-br ${contact.color} hover:${contact.hoverColor} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 text-left`}
                >
                  <div className="flex flex-col items-start">
                    <div className="bg-white/20 p-3 rounded-xl group-hover:bg-white/30 transition">
                      {contact.icon}
                    </div>
                    <h3 className="text-2xl font-bold mt-4">{contact.name}</h3>
                    <p className="text-3xl font-extrabold mt-1">{contact.number}</p>
                    <p className="text-sm opacity-90 mt-2">{contact.description}</p>
                    <span className="mt-4 inline-flex items-center text-sm bg-white/30 px-3 py-1 rounded-full">
                      Tap to call
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="text-red-800 font-semibold text-lg mb-2">
                ⚠️ When to call emergency?
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Life‑threatening injuries or conditions</li>
                <li>Chest pain, difficulty breathing, severe bleeding</li>
                <li>Fire, serious accidents, or crimes in progress</li>
                <li>Poisoning or overdose</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                For non‑urgent medical issues, please{' '}
                <Link to="/book-appointment" className="text-red-600 hover:underline font-medium">
                  book an appointment
                </Link>{' '}
                with our doctors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;