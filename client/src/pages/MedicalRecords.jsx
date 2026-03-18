import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyRecords } from '../services/api';
import { FaFileMedicalAlt, FaFileDownload, FaStethoscope } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MedicalRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user?.id) return;
      try {
        const data = await getMyRecords(user.id);
        setRecords(data);
      } catch (error) {
        toast.error('Failed to load medical records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
            <FaFileMedicalAlt />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Medical Records</h1>
            <p className="text-gray-500 font-medium mt-1">View your past diagnoses and prescriptions.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : records.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFileMedicalAlt className="text-4xl text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Records Found</h3>
            <p className="text-gray-500">Your medical records and prescriptions will appear here after your consultations.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {records.map((record) => (
              <div key={record._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">
                      <FaStethoscope />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Dr. {record.doctorName}</h3>
                      <p className="text-gray-500 text-sm font-medium">{new Date(record.date).toLocaleDateString()} at {new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl font-medium transition text-sm">
                    <FaFileDownload /> Download PDF
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Diagnosis</h4>
                    <p className="text-gray-800 font-medium bg-gray-50 p-4 rounded-2xl">{record.diagnosis}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prescription</h4>
                    <p className="text-gray-800 font-medium bg-indigo-50/50 p-4 rounded-2xl whitespace-pre-line">{record.prescription}</p>
                  </div>
                </div>

                {record.notes && (
                  <div className="mt-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Doctor's Notes</h4>
                    <p className="text-gray-600 italic bg-yellow-50/50 p-4 rounded-2xl">{record.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
