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
            enum: ['Sales', 'Service', ''],
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
        websiteUrl: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            enum: ['Andhra Pradesh', 'Telangana', ''],
            default: '',
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
