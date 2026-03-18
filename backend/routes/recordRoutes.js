const express = require('express');
const { 
  createMedicalRecord, 
  getMyRecords, 
  getPatientRecords 
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createMedicalRecord);
router.get('/my', protect, getMyRecords);
router.get('/patient/:patientName', protect, getPatientRecords);

module.exports = router;
