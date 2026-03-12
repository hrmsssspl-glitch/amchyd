const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
    id: { type: String, required: true }, // OFF-123
    candidateId: { type: String, required: true, ref: 'HrmsCandidate' },
    name: { type: String, required: true },

    jobCode: { type: String, required: true },
    jobTitle: { type: String, required: true },
    department: { type: String }, // from JobOpening

    // Proposal
    proposedCTC: { type: Number, required: true }, // The final offer
    basicSalary: { type: Number }, // Breakdown if needed
    hra: { type: Number }, // Breakdown if needed
    joiningBonus: { type: Number, default: 0 },

    // Dates
    offerDate: { type: Date, default: Date.now },
    expectedJoiningDate: { type: Date, required: true },
    expiryDate: { type: Date },

    // Offer document
    offerLetterUrl: { type: String }, // link to generated PDF

    status: { type: String, enum: ['Issued', 'Viewed', 'Accepted', 'Rejected', 'Negotiation Pending'], default: 'Issued' },

    issuedBy: { type: String }, // Employee ID of HR

    // Candidate Feedback
    candidateRemarks: { type: String },
    rejectionReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HrmsOfferLetter', offerLetterSchema);
