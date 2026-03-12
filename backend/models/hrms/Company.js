const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyCode: { type: String, required: true },
    cinGst: { type: String },
    registeredAddress: { type: String },
    corporateAddress: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    establishmentYear: { type: String },
    industryType: { type: String },
    panNumber: { type: String },
    websiteUrl: { type: String },
    logoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HrmsCompany', companySchema);
