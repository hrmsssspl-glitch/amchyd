const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            trim: true,
        },
        cinGstNumber: {
            type: String,
            trim: true,
        },
        establishmentYear: {
            type: String,
            trim: true,
        },
        industryType: {
            type: String,
            enum: ['Sales', 'Service', 'Sales & Service', ''],
            default: '',
        },
        panNumber: {
            type: String,
            trim: true,
        },
        registeredAddress: {
            type: String,
            trim: true,
        },
        corporateAddress: {
            type: String,
            trim: true,
        },
        contactEmail: {
            type: String,
            trim: true,
        },
        contactPhone: {
            type: String,
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
        },
        branchGstNumber: {
            type: String,
            trim: true,
        },
        websiteUrl: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            default: '',
        },
        branches: {
            type: [String],
            default: [],
        },
        branch: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Organization', organizationSchema);
