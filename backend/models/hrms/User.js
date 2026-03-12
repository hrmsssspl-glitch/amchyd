const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password ideally
    role: { type: String, required: true, default: 'employee' }, // Links to PermissionTemplate.roleName

    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'HrmsEmployee' }, // Optional link to employee record

    // Custom User-Level Overrides (if any)
    customPermissions: {
        menuIds: [{ type: Number }], // If set, overrides role
        moduleIds: [{ type: Number }]
    },

    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HrmsUser', userSchema);
