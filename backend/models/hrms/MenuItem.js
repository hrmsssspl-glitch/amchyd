const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'fa-circle' },
    path: { type: String }, // Optional, can be derived or stored
    active: { type: Boolean, default: true },
    roles: [{ type: String }], // Legacy support
    order: { type: Number, default: 0 },
    parentId: { type: Number, default: null }, // For submenus
    isSubmenu: { type: Boolean, default: false }
});

module.exports = mongoose.model('HrmsMenuItem', menuItemSchema);
