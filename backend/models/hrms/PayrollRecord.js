const mongoose = require('mongoose');

const payrollRecordSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, ref: 'HrmsEmployee' },
    month: { type: Number, required: true }, // e.g. 1-12
    year: { type: Number, required: true },  // e.g. 2024

    // Salary Structure Snapshot (at time of generation)
    basicSalary: { type: Number, required: true },
    ctc: { type: Number, required: true },

    // Attendance and Leave Impact
    totalDays: { type: Number, default: 30 },
    workingDays: { type: Number, default: 30 },
    presentDays: { type: Number, default: 30 },
    lopDays: { type: Number, default: 0 },

    // Earnings (Calculated)
    grossSalary: { type: Number, default: 0 },
    basicEarned: { type: Number, default: 0 },
    hraEarned: { type: Number, default: 0 },
    specialAllowanceEarned: { type: Number, default: 0 },
    conveyanceEarned: { type: Number, default: 0 },
    medicalEarned: { type: Number, default: 0 },
    otherAllowancesEarned: { type: Number, default: 0 },
    arrears: { type: Number, default: 0 },
    incentive: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    reimbursement: { type: Number, default: 0 },

    // Deductions (Calculated)
    totalDeductions: { type: Number, default: 0 },
    pfDeduction: { type: Number, default: 0 },
    esiDeduction: { type: Number, default: 0 },
    ptDeduction: { type: Number, default: 0 },
    tdsDeduction: { type: Number, default: 0 },
    loanRepayment: { type: Number, default: 0 },
    advanceAdjustment: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 }, // E.g., damage recovery
    shortPaidRecovery: { type: Number, default: 0 },
    excessPaidRecovery: { type: Number, default: 0 },

    // Final Pay
    netPay: { type: Number, required: true },

    // Payment Details
    status: { type: String, enum: ['Draft', 'Processed', 'Paid', 'Hold'], default: 'Draft' },
    paymentMode: { type: String, enum: ['Bank', 'Cash', 'Cheque'], default: 'Bank' },
    transactionId: { type: String },
    bankName: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
    paymentDate: { type: Date },

    remarks: { type: String }
}, { timestamps: true });

// Compound index to prevent duplicate payrolls for same user same month
payrollRecordSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('HrmsPayrollRecord', payrollRecordSchema);
