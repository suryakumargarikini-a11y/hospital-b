const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    icon: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    doctors: { type: String },
    bgColor: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
