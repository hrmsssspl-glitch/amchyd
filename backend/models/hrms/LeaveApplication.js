const mongoose = require('mongoose');

const leaveApplicationSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, ref: 'HrmsEmployee' },
    employeeName: { type: String }, // Optional

    applicationDate: { type: String, required: true }, // YYYY-MM-DD

    leaveType: { type: String, required: true }, // CL, SL, EL

    fromDate: { type: String, required: true }, // YYYY-MM-DD
    toDate: { type: String, required: true }, // YYYY-MM-DD

    // Half Day Logic
    fromHalf: { type: String, enum: ['Full', '1st', '2nd'], default: 'Full' },
    toHalf: { type: String, enum: ['Full', '1st', '2nd'], default: 'Full' },

    numberOfDays: { type: Number, required: true },

    reason: { type: String },
    substituteEmployeeId: { type: String }, // Optional

    // Attachments?
    attachment: { type: String }, // URL

    // Workflow Status
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending' },

    // Detailed Approvals
    teamLeadStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    reportingManagerStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    hrStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },

    approverRemarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HrmsLeaveApplication', leaveApplicationSchema);
