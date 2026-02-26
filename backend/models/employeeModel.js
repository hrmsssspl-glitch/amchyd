const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee ID is mandatory'],
            unique: true,
            trim: true,
        },
        employeeName: {
            type: String,
            required: [true, 'Employee Name is mandatory'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', ''],
            default: 'Active',
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', ''],
            default: '',
        },
        dateOfJoining: {
            type: Date,
        },
        designation: {
            type: String,
            trim: true,
            default: '',
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        aadharNo: {
            type: String,
            trim: true,
        },
        panNo: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Employee', employeeSchema);
