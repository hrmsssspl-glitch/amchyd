const express = require('express');
const router = express.Router();
const Employee = require('../../models/hrms/Employee');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Public (for now)
router.get('/stats', async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const activeEmployees = await Employee.countDocuments({ status: 'Active' });

        // Example: Count by department
        const departmentStats = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        // Example: Recent joiners (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newJoiners = await Employee.countDocuments({ dateOfJoining: { $gte: thirtyDaysAgo } });

        res.json({
            totalEmployees,
            activeEmployees,
            departmentStats,
            newJoiners
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
