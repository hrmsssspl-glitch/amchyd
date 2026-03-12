const mongoose = require('mongoose');

const jobOpeningSchema = new mongoose.Schema({
    jobCode: { type: String, required: true, unique: true }, // e.g., SDE-01
    jobTitle: { type: String, required: true },

    department: { type: String, required: true },
    branchCode: { type: String }, // Optional, specific location

    requiredExperience: { type: String }, // e.g. "3-5 Years"
    requiredSkills: [{ type: String }],

    numberOfPositions: { type: Number, default: 1 },
    filledPositions: { type: Number, default: 0 },

    jobDescription: { type: String },

    status: { type: String, enum: ['Open', 'Closed', 'Hold'], default: 'Open' },

    hiringManager: { type: String },
    postedDate: { type: Date, default: Date.now },
    closedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('HrmsJobOpening', jobOpeningSchema);
