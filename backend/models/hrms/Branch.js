const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchName: { type: String, required: true },
    branchCode: { type: String },
    state: { type: String, required: true },
    city: { type: String },
    address: { type: String },
    contactPerson: { type: String },
    contactNumber: { type: String },
    emailId: { type: String },
    operationalSince: { type: String },
    unitType: {
        type: String,
        enum: ['Head Office', 'Regional Office', 'Zonal Office', 'Branch Office', 'Satellite Office', 'Service & Spare Outlets'],
        default: 'Branch Office'
    },
    capacity: { type: Number },
    gstNumber: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('HrmsBranch', branchSchema);
