const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['designation', 'role', 'assetType', 'application', 'customerSegment', 'industrySegment', 'department']
    },
    name: { type: String, required: true },
    code: { type: String },
    description: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// Compound unique index for type and name
metadataSchema.index({ type: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Metadata', metadataSchema);
