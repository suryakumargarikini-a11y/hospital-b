import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { appointmentSchema } from '../../utils/validationSchemas';
import { useAppointments } from '../../context/AppointmentContext';
import { useAuth } from '../../context/AuthContext';
import { getDoctors } from '../../services/api';
import toast from 'react-hot-toast';

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

const departments = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Ophthalmology',
  'Dentistry',
  'General Medicine',
  'Pulmonology',
  'Dermatology',
  'Gynecology',
  'ENT',
  'Psychiatry'
];

const AppointmentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { bookAppointment } = useAppointments();
  const [doctorsList, setDoctorsList] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctorObj, setSelectedDoctorObj] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get data from navigation state
  const selectedDoctor = location.state?.doctorName || '';
  const selectedDepartment = location.state?.department || '';

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors();
        setDoctorsList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const formik = useFormik({
    initialValues: {
      patientName: user?.name || '',
      age: '',
      gender: '',
      department: '',
      doctor: '',
      date: '',
      time: '',
      reason: '',
    },
    validationSchema: appointmentSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (!user?.id) {
          toast.error('User not authenticated');
          return;
        }

        await bookAppointment(values);
        toast.success('Appointment booked successfully!');
        resetForm();
        navigate('/my-appointments');
      } catch (err) {
        console.error('❌ Booking error:', err);
        toast.error(err.response?.data?.message || 'Failed to book appointment');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Auto-select doctor when coming from Doctors page
  useEffect(() => {
    if (doctorsList.length > 0 && selectedDoctor) {
      const doctor = doctorsList.find(doc => doc.name === selectedDoctor);
      
      if (doctor) {
        setSelectedDoctorObj(doctor);
        formik.setFieldValue('department', doctor.specialty);
        formik.setFieldValue('doctor', `${doctor.name} (${doctor.specialty})`);
        
        const filtered = doctorsList.filter(doc => 
          doc.specialty.toLowerCase() === doctor.specialty.toLowerCase()
        );
        setFilteredDoctors(filtered);
      }
    }
  }, [doctorsList, selectedDoctor]);

  // Auto-select department when coming from Services page
  useEffect(() => {
    if (doctorsList.length > 0 && selectedDepartment && !selectedDoctor) {
      formik.setFieldValue('department', selectedDepartment);
      
      const filtered = doctorsList.filter(doc => 
        doc.specialty.toLowerCase() === selectedDepartment.toLowerCase()
      );
      setFilteredDoctors(filtered);
    }
  }, [doctorsList, selectedDepartment, selectedDoctor]);

  // Update selected doctor object when doctor field changes
  useEffect(() => {
    if (formik.values.doctor && doctorsList.length > 0) {
      const doctorName = formik.values.doctor.split(' (')[0];
      const doctor = doctorsList.find(doc => doc.name === doctorName);
      setSelectedDoctorObj(doctor || null);
      // Reset date when doctor changes
      formik.setFieldValue('date', '');
      formik.setFieldValue('time', '');
    }
  }, [formik.values.doctor, doctorsList]);

  // Handle department change
  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    formik.setFieldValue('department', dept);
    formik.setFieldValue('doctor', '');
    formik.setFieldValue('date', '');
    formik.setFieldValue('time', '');
    setSelectedDoctorObj(null);
    
    if (dept && doctorsList.length > 0) {
      const filtered = doctorsList.filter(doc => 
        doc.specialty.toLowerCase() === dept.toLowerCase()
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors(doctorsList);
    }
  };

  // Handle doctor change
  const handleDoctorChange = (e) => {
    formik.setFieldValue('doctor', e.target.value);
    formik.setFieldValue('date', '');
    formik.setFieldValue('time', '');
  };

  // ✅ CHECK IF DATE IS AVAILABLE FOR SELECTED DOCTOR
  const isDateAvailable = (dateString) => {
    if (!selectedDoctorObj || !selectedDoctorObj.availableDays) return true;
    
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    
    return selectedDoctorObj.availableDays.includes(dayName);
  };

  // ✅ GET MIN DATE (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // ✅ GET MAX DATE (30 days from now)
  const getMaxDate = () => {
    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    return thirtyDays.toISOString().split('T')[0];
  };

  // ✅ GET AVAILABILITY BADGE COLOR
  const getAvailabilityBadge = (doctor) => {
    if (!doctor || !doctor.availableDays) return 'bg-gray-100 text-gray-800';
    
    if (doctor.availableDays.includes('Monday') && doctor.availableDays.includes('Wednesday') && doctor.availableDays.includes('Friday')) {
      return 'bg-blue-100 text-blue-800';
    } else if (doctor.availableDays.includes('Tuesday') && doctor.availableDays.includes('Thursday') && doctor.availableDays.includes('Saturday')) {
      return 'bg-green-100 text-green-800';
    } else if (doctor.availableDays.includes('Monday') && doctor.availableDays.includes('Tuesday') && doctor.availableDays.includes('Wednesday')) {
      return 'bg-purple-100 text-purple-800';
    } else if (doctor.availableDays.includes('Wednesday') && doctor.availableDays.includes('Thursday') && doctor.availableDays.includes('Friday')) {
      return 'bg-orange-100 text-orange-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // ✅ FORMAT AVAILABLE DAYS SAFELY
  const getAvailableDaysText = (doctor) => {
    if (!doctor || !doctor.availableDays) return 'Availability not set';
    return doctor.availableDays.join(', ');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Patient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Patient Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...formik.getFieldProps('patientName')}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 ${
            formik.touched.patientName && formik.errors.patientName
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        />
        {formik.touched.patientName && formik.errors.patientName && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.patientName}</p>
        )}
      </div>

      {/* Age & Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...formik.getFieldProps('age')}
            className={`w-full px-4 py-2 border rounded-lg ${
              formik.touched.age && formik.errors.age
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.age && formik.errors.age && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.age}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            {...formik.getFieldProps('gender')}
            className={`w-full px-4 py-2 border rounded-lg ${
              formik.touched.gender && formik.errors.gender
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
          )}
        </div>
      </div>

      {/* DEPARTMENT SELECTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Department <span className="text-red-500">*</span>
        </label>
        <select
          name="department"
          value={formik.values.department}
          onChange={handleDepartmentChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-2 border rounded-lg ${
            formik.touched.department && formik.errors.department
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {formik.touched.department && formik.errors.department && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.department}</p>
        )}
      </div>

      {/* DOCTOR SELECTION - WITH AVAILABILITY BADGES */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Doctor <span className="text-red-500">*</span>
        </label>
        <select
          {...formik.getFieldProps('doctor')}
          onChange={handleDoctorChange}
          onBlur={formik.handleBlur}
          className={`w-full px-4 py-2 border rounded-lg ${
            formik.touched.doctor && formik.errors.doctor
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          disabled={!formik.values.department}
        >
          <option value="">Select Doctor</option>
          {filteredDoctors.map((doc) => (
            <option key={doc.id} value={`${doc.name} (${doc.specialty})`}>
              {doc.name} - {doc.availableDays ? doc.availableDays.join(', ') : 'Days not set'}
            </option>
          ))}
        </select>
        {formik.touched.doctor && formik.errors.doctor && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.doctor}</p>
        )}
        {!formik.values.department && (
          <p className="text-gray-500 text-xs mt-1">Please select a department first</p>
        )}
      </div>

      {/* DOCTOR AVAILABILITY INFO - SAFE CHECK */}
      {selectedDoctorObj && selectedDoctorObj.availableDays && (
        <div className={`p-4 rounded-lg ${getAvailabilityBadge(selectedDoctorObj)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedDoctorObj.name}</p>
              <p className="text-sm mt-1">
                📅 Available days: <span className="font-semibold">{getAvailableDaysText(selectedDoctorObj)}</span>
              </p>
              <p className="text-sm mt-1">
                ⏰ Max {selectedDoctorObj.maxPerSlot || 4} appointments per time slot
              </p>
            </div>
            <div className="text-2xl">
              <span className="block">Mon: {selectedDoctorObj.availableDays.includes('Monday') ? '✅' : '❌'}</span>
              <span className="block">Tue: {selectedDoctorObj.availableDays.includes('Tuesday') ? '✅' : '❌'}</span>
              <span className="block">Wed: {selectedDoctorObj.availableDays.includes('Wednesday') ? '✅' : '❌'}</span>
              <span className="block">Thu: {selectedDoctorObj.availableDays.includes('Thursday') ? '✅' : '❌'}</span>
              <span className="block">Fri: {selectedDoctorObj.availableDays.includes('Friday') ? '✅' : '❌'}</span>
              <span className="block">Sat: {selectedDoctorObj.availableDays.includes('Saturday') ? '✅' : '❌'}</span>
            </div>
          </div>
        </div>
      )}

      {/* DATE SELECTION - DISABLE UNAVAILABLE DAYS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          {...formik.getFieldProps('date')}
          min={getMinDate()}
          max={getMaxDate()}
          disabled={!selectedDoctorObj}
          className={`w-full px-4 py-2 border rounded-lg ${
            formik.touched.date && formik.errors.date
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          onKeyDown={(e) => e.preventDefault()}
        />
        {formik.touched.date && formik.errors.date && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.date}</p>
        )}
        {selectedDoctorObj && formik.values.date && !isDateAvailable(formik.values.date) && (
          <p className="text-red-500 text-sm mt-1">
            ❌ Doctor is not available on this day. Available days: {getAvailableDaysText(selectedDoctorObj)}
          </p>
        )}
      </div>

      {/* TIME SELECTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time <span className="text-red-500">*</span>
        </label>
        <select
          {...formik.getFieldProps('time')}
          disabled={!formik.values.date || !selectedDoctorObj || (formik.values.date && !isDateAvailable(formik.values.date))}
          className={`w-full px-4 py-2 border rounded-lg ${
            formik.touched.time && formik.errors.time
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="">Select Time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        {formik.touched.time && formik.errors.time && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.time}</p>
        )}
        {!formik.values.date && (
          <p className="text-gray-500 text-xs mt-1">Please select a date first</p>
        )}
      </div>

      {/* Reason */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reason for visit <span className="text-red-500">*</span>
        </label>
        <textarea
          rows="3"
          {...formik.getFieldProps('reason')}
          className={`w-full px-4 py-2 border rounded-lg ${
            formik.touched.reason && formik.errors.reason
              ? 'border-red-500'
              : 'border-gray-300'
          }`}
          placeholder="Please describe your symptoms or reason for appointment..."
        ></textarea>
        {formik.touched.reason && formik.errors.reason && (
          <p className="text-red-500 text-sm mt-1">{formik.errors.reason}</p>
        )}
      </div>

      {/* Selected Info Summary */}
      {(selectedDoctor || selectedDepartment) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">✓ Pre-selected for you:</h4>
          {selectedDepartment && !selectedDoctor && (
            <p className="text-sm text-blue-700">
              <span className="font-medium">Department:</span> {selectedDepartment}
            </p>
          )}
          {selectedDoctor && selectedDoctorObj && (
            <>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Doctor:</span> {selectedDoctor}
              </p>
              <p className="text-sm text-blue-700">
                <span className="font-medium">Available:</span> {getAvailableDaysText(selectedDoctorObj)}
              </p>
            </>
          )}
          <p className="text-xs text-blue-600 mt-2">
            You can change your selection if needed
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={formik.isSubmitting || (formik.values.date && !isDateAvailable(formik.values.date))}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 shadow-md"
      >
        {formik.isSubmitting ? 'Booking...' : 'Confirm Appointment'}
      </button>
    </form>
  );
};

export default AppointmentForm;