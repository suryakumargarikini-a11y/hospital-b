const Appointment = require('../models/Appointment');

// @desc    Create appointment
// @route   POST /api/appointments
const createAppointment = async (req, res) => {
  const { patientName, age, gender, doctor, date, time, reason } = req.body;
  const userId = req.user._id;

  if (!patientName || !doctor || !date || !time) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newApp = await Appointment.create({
    userId,
    patientName,
    age,
    gender,
    doctor,
    date,
    time,
    reason,
    status: 'pending',
  });

  res.status(201).json(newApp);
};

// @desc    Get appointments for logged-in user
// @route   GET /api/appointments/my
const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(appointments);
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments
const getAllAppointments = async (req, res) => {
  const appointments = await Appointment.find({}).sort({ createdAt: -1 });
  res.json(appointments);
};

// @desc    Update appointment status (Admin only)
// @route   PATCH /api/appointments/:id/status
const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
  }

  res.json(appointment);
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
};