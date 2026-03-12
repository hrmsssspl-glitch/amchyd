const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true, ref: 'HrmsEmployee' },
    month: { type: Number }, // Optional if balance is year-to-date
    year: { type: Number, required: true },

    // Balances
    cl: { type: Number, default: 0 }, // Casual Leave
    sl: { type: Number, default: 0 }, // Sick Leave
    el: { type: Number, default: 0 }, // Earned Leave

    // Used
    clUsed: { type: Number, default: 0 },
    slUsed: { type: Number, default: 0 },
    elUsed: { type: Number, default: 0 },

    // Accrued/Opening
    clOpening: { type: Number, default: 0 },
    slOpening: { type: Number, default: 0 },
    elOpening: { type: Number, default: 0 },

    // Encashed
    elEncashed: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('HrmsLeaveBalance', leaveBalanceSchema);
