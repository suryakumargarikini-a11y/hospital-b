import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMedicalRecord } from '../services/api';
import toast from 'react-hot-toast';

const AddRecord = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  
  // Get patient name from query params (passed from DoctorDashboard)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientNameParam = queryParams.get('patient') || '';

  const [formData, setFormData] = useState({
    patientName: patientNameParam,
    diagnosis: '',
    prescription: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.diagnosis || !formData.prescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await createMedicalRecord({
        ...formData,
        appointmentId: appointmentId !== 'new' ? appointmentId : undefined
      }, user.id);
      toast.success('Medical record saved successfully');
      navigate('/doctor-dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'doctor') {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Medical Record</h1>
        <p className="text-gray-500 mb-8">Add diagnosis and prescription for {formData.patientName || 'the patient'}.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name *</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition bg-gray-50"
              placeholder="Full Name of Patient"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis *</label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows="3"
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="e.g., Viral Pharyngitis..."
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prescription *</label>
            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows="4"
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="1. Paracetamol 500mg - 1 tab after meals (SOS)&#10;2. Vitamin C - 1 tab daily"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
              placeholder="Advice on diet, rest, or follow-ups..."
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecord;
