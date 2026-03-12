const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema({
    id: { type: String, required: true }, // ONB-001
    candidateId: { type: String, required: true, ref: 'HrmsCandidate' },
    name: { type: String, required: true }, // Candidate Name

    jobCode: { type: String, required: true },

    joiningDate: { type: Date, required: true },

    checklist: [
        {
            step: { type: String }, // e.g. "Documents Submission", "IT Setup", "Badge Issue", "Intro Session"
            status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
            assignedTo: { type: String }, // Employee ID of IT/HR responsible
            completedDate: { type: Date },
            remarks: { type: String }
        }
    ],

    documentsStatus: { type: String, enum: ['Pending', 'Uploaded', 'Verified'], default: 'Pending' },

    overallStatus: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Dropped'], default: 'Not Started' },

    hrOwner: { type: String } // HR responsible
}, { timestamps: true });

module.exports = mongoose.model('HrmsOnboarding', onboardingSchema);
