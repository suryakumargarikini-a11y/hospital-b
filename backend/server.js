const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

const { connectDBs } = require('./config/db');

// Connect to MongoDB databases
connectDBs();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/labs', require('./routes/labRoutes'));

app.get('/', (req, res) => {
  res.send('🏥 MediBook API is running...');
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});