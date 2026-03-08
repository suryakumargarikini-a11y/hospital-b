const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    experience: { type: String },
    rating: { type: Number },
    patients: { type: String },
    image: { type: String },
}, { timestamps: true });

const { adminDbConnection } = require('../config/db');

module.exports = adminDbConnection.model('Doctor', doctorSchema);
