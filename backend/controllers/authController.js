const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { employeeId, password } = req.body;

    try {
        const user = await User.findOne({ employeeId });

        if (!user) {
            return res.status(401).json({ message: 'Invalid Employee ID' });
        }

        const isAdmin = ['Super Admin', 'Admin'].includes(user.role);

        if (isAdmin) {
            if (user && (await user.matchPassword(password))) {
                res.json({
                    _id: user._id,
                    employeeId: user.employeeId,
                    employeeName: user.employeeName,
                    role: user.role,
                    state: user.state || '',
                    assignedBranches: user.assignedBranches || [],
                    token: generateToken(user._id),
                });
            } else {
                res.status(401).json({ message: 'Invalid password for Admin' });
            }
        } else {
            // Non-admin roles login with employeeId only
            res.json({
                _id: user._id,
                employeeId: user.employeeId,
                employeeName: user.employeeName,
                role: user.role,
                state: user.state || '',
                assignedBranches: user.assignedBranches || [],
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user && (await user.matchPassword(oldPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, changePassword };
