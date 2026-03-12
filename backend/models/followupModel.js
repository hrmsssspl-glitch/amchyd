const mongoose = require('mongoose');

const followupSchema = new mongoose.Schema({
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String },
    followupDate: { type: Date, required: true },
    customerName: { type: String },
    customerContactNumber: { type: String },
    customerContactEmail: { type: String },
    remarks: { type: String },
    poStatus: { type: String, enum: ['PO Received', 'Not Received', 'Pending', ''] },
}, { timestamps: true });

module.exports = mongoose.model('Followup', followupSchema);
