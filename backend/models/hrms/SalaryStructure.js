const mongoose = require('mongoose');

const salaryStructureSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true, ref: 'HrmsEmployee' },

    // Earnings (Fixed/Master)
    ctc: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    specialAllowance: { type: Number, default: 0 },
    conveyanceAllowance: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    otherAllowances: { type: Number, default: 0 },

    // Employer Contributions (Cost to Company components)
    groupHealthInsurance: { type: Number, default: 0 },
    groupAccidentalInsurance: { type: Number, default: 0 },

    // Eligibilities (Flags)
    pfEligibility: { type: Boolean, default: false },
    esiEligibility: { type: Boolean, default: false },
    professionalTaxEligibility: { type: Boolean, default: false },
    incomeTaxEligibility: { type: Boolean, default: false },
    tdsEligibility: { type: Boolean, default: false },
    gratuityEligibility: { type: Boolean, default: false },
    bonusEligibility: { type: Boolean, default: false },
    travelReimbursementEligibility: { type: Boolean, default: false },
    incentiveEligibility: { type: Boolean, default: false },

    // Initial Adjustments (For first month/migration)
    shortPaidLastMonth: { type: Number, default: 0 },
    excessPaidLastMonth: { type: Number, default: 0 },
    arrears: { type: Number, default: 0 },
    salaryAdvance: { type: Number, default: 0 },

    effectiveDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('HrmsSalaryStructure', salaryStructureSchema);
