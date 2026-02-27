import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log all requests
api.interceptors.request.use(request => {
  console.log('🚀 API Request:', {
    method: request.method,
    url: request.url,
    headers: request.headers,
    data: request.data
  });
  return request;
});

// Add response interceptor to log responses
api.interceptors.response.use(
  response => {
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// ---------- AUTH ----------
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response?.data || error.message);
    throw error;
  }
};

// ---------- APPOINTMENTS ----------
export const createAppointment = async (appointmentData, userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    console.log('Creating appointment with:', {
      userId,
      userIdType: typeof userId,
      appointmentData
    });

    const response = await api.post('/appointments', appointmentData, {
      headers: {
        'x-user-id': userId.toString()  // Convert to string explicitly
      }
    });
    return response.data;
  } catch (error) {
    console.error('Create appointment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserAppointments = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const response = await api.get('/appointments/my', {
      headers: {
        'x-user-id': userId.toString()  // Convert to string explicitly
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get appointments error:', error.response?.data || error.message);
    throw error;
  }
};

// ---------- DOCTORS ----------
export const getDoctors = async () => {
  try {
    const response = await api.get('/doctors');
    return response.data;
  } catch (error) {
    console.error('Get doctors error:', error.response?.data || error.message);
    throw error;
  }
};


// ---------- ADMIN APPOINTMENTS ----------
export const getAllAppointments = async (adminId) => {
  if (!adminId) {
    throw new Error('Admin ID is required');
  }

  try {
    const response = await api.get('/appointments', {
      headers: { 'x-user-id': adminId.toString() }
    });
    return response.data;
  } catch (error) {
    console.error('Get all appointments error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId, status, adminId) => {
  if (!appointmentId || !status || !adminId) {
    throw new Error('Appointment ID, status, and admin ID are required');
  }

  try {
    const response = await api.patch(`/appointments/${appointmentId}/status`,
      { status },
      { headers: { 'x-user-id': adminId.toString() } }
    );
    return response.data;
  } catch (error) {
    console.error('Update appointment status error:', error.response?.data || error.message);
    throw error;
  }
};

// ---------- SERVICES ----------
export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.error('Get services error:', error.response?.data || error.message);
    throw error;
  }
};