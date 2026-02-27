import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

export const registerSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm password'),
});

export const appointmentSchema = Yup.object({
  patientName: Yup.string().required('Patient name is required'),
  age: Yup.number().positive().integer().required('Age is required'),
  gender: Yup.string().required('Please select gender'),
  department: Yup.string().required('Please select department'),
  doctor: Yup.string().required('Please select doctor'),
  date: Yup.date().min(new Date(), 'Date must be in future').required('Date is required'),
  time: Yup.string().required('Please select time'),
  reason: Yup.string().min(5, 'At least 5 characters').required('Reason is required'),
});