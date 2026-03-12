const mongoose = require('mongoose');

const permissionTemplateSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: true,
        unique: true
    }, // e.g., 'superadmin', 'hr_manager'

    description: { type: String },

    // List of allowed Menu IDs (from MenuItem model)
    allowedMenuIds: [{ type: Number }],

    // List of allowed Module IDs (from a future Module model, or just numbers for now)
    allowedModuleIds: [{ type: Number }],

    isDefault: { type: Boolean, default: false } // To protect system roles
}, { timestamps: true });

module.exports = mongoose.model('HrmsPermissionTemplate', permissionTemplateSchema);
