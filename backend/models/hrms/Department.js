const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true },
    subDepartment: { type: String, required: true }, // Also acts as Designation sometimes
    departmentCode: { type: String },
    gradeLevel: { type: String },

    // Link to Branch Schema
    branch: { type: String, required: true }, // Branch Name
    branchCode: { type: String },
    state: { type: String },
    location: { type: String }, // same as Branch Name usually

    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('HrmsDepartment', departmentSchema);
