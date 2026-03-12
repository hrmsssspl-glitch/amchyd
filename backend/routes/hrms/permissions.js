const express = require('express');
const router = express.Router();
const PermissionTemplate = require('../../models/hrms/PermissionTemplate');
const MenuItem = require('../../models/hrms/MenuItem');

// @route   GET /api/permissions/templates
// @desc    Get all permission templates (Roles)
router.get('/templates', async (req, res) => {
    try {
        const templates = await PermissionTemplate.find();
        res.json(templates);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/permissions/templates
// @desc    Create a new permission template
router.post('/templates', async (req, res) => {
    const { roleName, allowedMenuIds, allowedModuleIds, description } = req.body;
    try {
        let template = new PermissionTemplate({
            roleName,
            allowedMenuIds,
            allowedModuleIds,
            description
        });
        await template.save();
        res.json(template);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/permissions/menus
// @desc    Get all menu items
router.get('/menus', async (req, res) => {
    try {
        const menus = await MenuItem.find().sort({ order: 1 });
        res.json(menus);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
