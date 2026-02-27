import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createAppointment, getUserAppointments } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching appointments');
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Fetching appointments for user ID:', user.id);
      const data = await getUserAppointments(user.id);
      console.log('📅 Appointments fetched:', data);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      toast.error('Failed to load appointments');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const bookAppointment = async (appointmentData) => {
    if (!user?.id) {
      toast.error('Please login to book an appointment');
      throw new Error('User not authenticated');
    }

    try {
      console.log('📝 Booking appointment for user:', {
        userId: user.id,
        userName: user.name,
        appointmentData
      });
      
      const newAppointment = await createAppointment(appointmentData, user.id);
      console.log('✅ Appointment created:', newAppointment);
      
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (error) {
      console.error('❌ Failed to book appointment:', error);
      throw error;
    }
  };

  // Fetch appointments when user changes
  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

  return (
    <AppointmentContext.Provider value={{ 
      appointments, 
      bookAppointment, 
      fetchAppointments,
      loading 
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};