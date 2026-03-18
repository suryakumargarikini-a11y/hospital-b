const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User'); // Used to verify roles if needed

// @desc    Create a new medical record (Doctor only)
// @route   POST /api/records
const createMedicalRecord = async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Only doctors can create records' });
  }

  const { patientName, appointmentId, diagnosis, prescription, notes } = req.body;

  // Find patient by name (simplification, optionally you would use patientId directly)
  const patient = await User.findOne({ name: patientName, role: 'patient' });
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found. Ensure exact name match.' });
  }

  const record = await MedicalRecord.create({
    patientId: patient._id,
    patientName: patient.name,
    doctorId: req.user._id,
    doctorName: req.user.name,
    appointmentId,
    diagnosis,
    prescription,
    notes
  });

  res.status(201).json(record);
};

// @desc    Get medical records for the logged in patient
// @route   GET /api/records/my
const getMyRecords = async (req, res) => {
  const records = await MedicalRecord.find({ patientId: req.user._id }).sort({ createdAt: -1 });
  res.json(records);
};

// @desc    Get medical records for a specific patient (Doctor only)
// @route   GET /api/records/patient/:patientName
const getPatientRecords = async (req, res) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { patientName } = req.params;
  const records = await MedicalRecord.find({ 
    patientName: patientName, 
    doctorId: req.user._id 
  }).sort({ createdAt: -1 });
  
  res.json(records);
};

module.exports = {
  createMedicalRecord,
  getMyRecords,
  getPatientRecords
};
