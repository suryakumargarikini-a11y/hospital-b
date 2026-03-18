import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import Chatbot from './components/common/Chatbot';

// Public Pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Services = lazy(() => import('./pages/Services'));
const Doctors = lazy(() => import('./pages/Doctors'));
const Contact = lazy(() => import('./pages/Contact'));
const LabTests = lazy(() => import('./pages/LabTests'));

// Protected Pages (require login)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const MyAppointments = lazy(() => import('./pages/MyAppointments'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const MedicalRecords = lazy(() => import('./pages/MedicalRecords'));
const AddRecord = lazy(() => import('./pages/AddRecord'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppointmentProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              <Suspense fallback={
                <div className="flex justify-center items-center h-full min-h-[60vh]">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              }>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/services" element={<Services />} />
                <Route path="/doctors" element={<Doctors />} />
                <Route path="/lab-tests" element={<LabTests />} />
                <Route path="/contact" element={<Contact />} />

                {/* Protected Routes - Regular Users */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/book-appointment"
                  element={
                    <PrivateRoute>
                      <BookAppointment />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-appointments"
                  element={
                    <PrivateRoute>
                      <MyAppointments />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/medical-records"
                  element={
                    <PrivateRoute>
                      <MedicalRecords />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/medical-records/new/:appointmentId"
                  element={
                    <PrivateRoute>
                      <AddRecord />
                    </PrivateRoute>
                  }
                />

                {/* 👑 Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                {/* 🩺 Doctor Only Route */}
                <Route
                  path="/doctor-dashboard"
                  element={
                    <PrivateRoute>
                      <DoctorDashboard />
                    </PrivateRoute>
                  }
                />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <Chatbot />
          <Toaster position="top-right" />
        </AppointmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;