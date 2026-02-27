import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppointmentProvider } from './context/AppointmentContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Emergency from './pages/Emergency';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';

// Protected Pages (require login)
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard'; // 👈 IMPORT ADMIN DASHBOARD

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppointmentProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/services" element={<Services />} />
                <Route path="/doctors" element={<Doctors />} />
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

                {/* 👑 Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </AppointmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;