const express = require('express');
const { 
  getAvailableTests, 
  createTest, 
  bookLabTest, 
  getMyBookings, 
  updateBooking 
} = require('../controllers/labController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/tests')
  .get(getAvailableTests)
  .post(protect, createTest); // Admin only

router.post('/book', protect, bookLabTest);
router.get('/my-bookings', protect, getMyBookings);
router.patch('/bookings/:id', protect, updateBooking); // Admin only

module.exports = router;
