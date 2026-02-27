const { readDB, writeDB } = require('../utils/fileUtils');

// @desc    Create appointment
// @route   POST /api/appointments
const createAppointment = (req, res) => {
  const { patientName, age, gender, doctor, date, time, reason } = req.body;
  const userId = req.user.id;

  if (!patientName || !doctor || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = readDB();
  const newApp = {
    id: Date.now(),
    userId,
    patientName,
    age,
    gender,
    doctor,
    date,
    time,
    reason,
    status: 'pending',
  };

  db.appointments.push(newApp);
  writeDB(db);
  res.status(201).json(newApp);
};

// @desc    Get appointments for logged-in user
// @route   GET /api/appointments/my
const getMyAppointments = (req, res) => {
  const db = readDB();
  const userApps = db.appointments.filter(app => app.userId === req.user.id);
  res.json(userApps);
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments
const getAllAppointments = (req, res) => {
  const db = readDB();
  res.json(db.appointments);
};

// @desc    Update appointment status (Admin only)
// @route   PATCH /api/appointments/:id/status
const updateAppointmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const db = readDB();
  const appointmentIndex = db.appointments.findIndex(app => app.id === parseInt(id));

  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  db.appointments[appointmentIndex].status = status;
  writeDB(db);
  
  res.json(db.appointments[appointmentIndex]);
};

module.exports = { 
  createAppointment, 
  getMyAppointments, 
  getAllAppointments,
  updateAppointmentStatus  // 👈 DON'T FORGET TO EXPORT IT!
};