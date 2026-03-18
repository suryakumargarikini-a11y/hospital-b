const mongoose = require('mongoose');

// Catalog of available lab tests
const labTestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    preparation: { type: String }, // e.g., "Fasting for 12 hours"
}, { timestamps: true });

// Record of a booked lab test
const labBookingSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'LabTest', required: true },
    testName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sample_collected', 'completed', 'cancelled'], default: 'pending' },
    reportUrl: { type: String } // Optional link to download the PDF report
}, { timestamps: true });

const { patientDbConnection, adminDbConnection } = require('../config/db');

const LabTest = adminDbConnection.model('LabTest', labTestSchema);
const LabBooking = patientDbConnection.model('LabBooking', labBookingSchema);

module.exports = { LabTest, LabBooking };
