const mongoose = require('mongoose');

const leaveTypeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // e.g. CL, SL
    name: { type: String, required: true },
    description: { type: String },
    daysAllowed: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

    // New fields for advanced configuration
    carryForwardAllowed: { type: Boolean, default: false },
    maxCarryForwardDays: { type: Number, default: 0 },
    encashmentAllowed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('HrmsLeaveType', leaveTypeSchema);
