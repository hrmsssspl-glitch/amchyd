const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    id: { type: String, required: true }, // I101
    candidateId: { type: String, required: true, ref: 'HrmsCandidate' },
    candidateName: { type: String }, // optional, for faster fetch

    jobCode: { type: String, required: true },

    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g. "14:30"

    roundName: { type: String, default: 'Technical R1' },
    interviewType: { type: String, enum: ['F2F', 'Video', 'Telephonic'], default: 'Video' },

    panelMembers: [{ type: String }], // Employee names or IDs

    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'No Show'], default: 'Scheduled' },

    outcome: { type: String, enum: ['Pending', 'Select', 'Reject', 'Hold'], default: 'Pending' },
    rating: { type: Number, min: 1, max: 10 },
    feedback: { type: String },

    meetingLink: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('HrmsInterview', interviewSchema);
