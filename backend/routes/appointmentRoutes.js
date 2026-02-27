const express = require('express');
const { 
  createAppointment, 
  getMyAppointments, 
  getAllAppointments,
  updateAppointmentStatus  // 👈 ADD THIS IMPORT!
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAllAppointments);

router.get('/my', protect, getMyAppointments);

// Add this route
router.patch('/:id/status', protect, updateAppointmentStatus);

module.exports = router;