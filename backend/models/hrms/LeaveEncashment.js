const mongoose = require('mongoose');

const leaveEncashmentSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, ref: 'HrmsEmployee' },
    requestDate: { type: Date, default: Date.now },

    leaveType: { type: String, default: 'EL' }, // Usually only Earned Leave is encashable
    year: { type: Number, required: true },

    openingBalance: { type: Number, required: true }, // Snapshot at time of request
    maxEncashableDays: { type: Number, required: true }, // e.g. 50% of balance
    requestedDays: { type: Number, required: true },

    amountPerDay: { type: Number, required: true },
    totalAmount: { type: Number, required: true },

    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    remarks: { type: String },

    approverId: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HrmsLeaveEncashment', leaveEncashmentSchema);
