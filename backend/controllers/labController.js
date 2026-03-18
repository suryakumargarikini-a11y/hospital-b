const { LabTest, LabBooking } = require('../models/LabTest');

// @desc    Get all available lab tests
// @route   GET /api/labs/tests
const getAvailableTests = async (req, res) => {
  const tests = await LabTest.find({});
  res.json(tests);
};

// @desc    Create a new lab test catalog item (Admin only)
// @route   POST /api/labs/tests
const createTest = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  const test = await LabTest.create(req.body);
  res.status(201).json(test);
};

// @desc    Book a lab test (Patient)
// @route   POST /api/labs/book
const bookLabTest = async (req, res) => {
  const { testId, testName, date, time } = req.body;
  if (!testId || !date || !time) return res.status(400).json({ message: 'Missing fields' });

  const booking = await LabBooking.create({
    patientId: req.user._id,
    patientName: req.user.name,
    testId,
    testName,
    date,
    time
  });

  res.status(201).json(booking);
};

// @desc    Get user's lab bookings
// @route   GET /api/labs/my-bookings
const getMyBookings = async (req, res) => {
  const bookings = await LabBooking.find({ patientId: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
};

// @desc    Update booking status or add report (Admin/Lab Staff)
// @route   PATCH /api/labs/bookings/:id
const updateBooking = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  
  const { status, reportUrl } = req.body;
  const booking = await LabBooking.findByIdAndUpdate(
    req.params.id,
    { status, reportUrl },
    { new: true }
  );
  
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
};

module.exports = { getAvailableTests, createTest, bookLabTest, getMyBookings, updateBooking };
