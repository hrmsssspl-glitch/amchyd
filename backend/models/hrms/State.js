const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('HrmsState', stateSchema);
