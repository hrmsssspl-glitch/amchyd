const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // C12345

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    dateOfBirth: { type: Date },
    gender: { type: String },

    experience: { type: Number, default: 0 }, // Total years
    relevantExperience: { type: Number, default: 0 },

    currentCompany: { type: String },
    currentDesignation: { type: String },
    currentCTC: { type: Number },
    expectedCTC: { type: Number },
    noticePeriod: { type: String }, // e.g. "30 Days" or "Negotiable"

    skills: [{ type: String }],

    // Pipeline Info
    jobCode: { type: String }, // Linked Job
    source: { type: String, enum: ['Portal', 'Referral', 'Consultant', 'Ex-Emp', 'Direct'], default: 'Portal' },
    referrerName: { type: String }, // If Source is Referral

    resumeUrl: { type: String },

    status: {
        type: String,
        enum: ['New', 'Screening', 'Shortlisted', 'Interview Scheduled', 'Interviewed', 'Selected', 'Rejected', 'Offer Released', 'Offer Accepted', 'Joined', 'On Hold'],
        default: 'New'
    },

    remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HrmsCandidate', candidateSchema);
