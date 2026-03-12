const express = require('express');
const router = express.Router();
const User = require('../../models/hrms/User');
const PermissionTemplate = require('../../models/hrms/PermissionTemplate');

// @route   GET /api/users
// @desc    Get all users with their roles
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/users
// @desc    Register a new user
router.post('/', async (req, res) => {
    const { username, password, role, employeeId } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password, // Should hash this before saving in real app
            role,
            employeeId
        });

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role
router.put('/:id/role', async (req, res) => {
    const { role } = req.body;
    try {
        // Validate role exists
        const roleTemplate = await PermissionTemplate.findOne({ roleName: role });
        if (!roleTemplate) {
            return res.status(400).json({ msg: 'Role not found' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.role = role;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/users/:userId/permissions
// @desc    Get effective permissions for a user
router.get('/:userId/permissions', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.userId });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Base permissions from role
        const template = await PermissionTemplate.findOne({ roleName: user.role });
        let menuIds = template ? template.allowedMenuIds : [];
        let moduleIds = template ? template.allowedModuleIds : [];

        // Override with custom permissions if any
        if (user.customPermissions && user.customPermissions.menuIds.length > 0) {
            menuIds = user.customPermissions.menuIds;
        }

        // In a real implementation, you might merge or override more granularly

        res.json({
            role: user.role,
            menuIds,
            moduleIds
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
