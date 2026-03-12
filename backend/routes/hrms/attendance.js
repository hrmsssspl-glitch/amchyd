const express = require('express');
const router = express.Router();
const AttendanceLog = require('../../models/hrms/AttendanceLog');
const LeaveApplication = require('../../models/hrms/LeaveApplication');
const LeaveBalance = require('../../models/hrms/LeaveBalance');
const LeaveEncashment = require('../../models/hrms/LeaveEncashment');

// --- Attendance Logs ---

// @route   POST /api/attendance/logs
// @desc    Create or Update Attendance Log
router.post('/logs', async (req, res) => {
    const { employeeId, date, ...rest } = req.body;
    try {
        let log = await AttendanceLog.findOne({ employeeId, date });
        if (log) {
            log = await AttendanceLog.findOneAndUpdate(
                { employeeId, date },
                { ...rest },
                { new: true }
            );
        } else {
            log = new AttendanceLog({ employeeId, date, ...rest });
            await log.save();
        }
        res.json(log);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/logs
// @desc    Get Logs (Filter by Employee, Date Range)
router.get('/logs', async (req, res) => {
    const { employeeId, startDate, endDate } = req.query;
    let query = {};
    if (employeeId) query.employeeId = employeeId;
    if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
        query.date = startDate;
    }

    try {
        const logs = await AttendanceLog.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- Leave Management ---

// @route   POST /api/attendance/leave/apply
// @desc    Apply for Leave
router.post('/leave/apply', async (req, res) => {
    try {
        const application = new LeaveApplication(req.body);
        await application.save();
        res.json(application);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/leave/applications
// @desc    Get Leave Applications (For Approval / History)
router.get('/leave/applications', async (req, res) => {
    const { employeeId, status } = req.query;
    let query = {};
    if (employeeId) query.employeeId = employeeId;
    if (status) query.status = status;

    try {
        const apps = await LeaveApplication.find(query).sort({ applicationDate: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/attendance/leave/approve/:id
// @desc    Approve/Reject Leave
router.put('/leave/approve/:id', async (req, res) => {
    const { status, remarks, approverRole } = req.body;
    // approverRole could be 'teamLead', 'manager', 'hr'

    try {
        let updateFields = {};
        if (approverRole === 'teamLead') updateFields.teamLeadStatus = status;
        if (approverRole === 'manager') updateFields.reportingManagerStatus = status;
        if (approverRole === 'hr') updateFields.hrStatus = status;

        // Simple logic: if 'hr' approves, full approve. If anyone rejects, full reject.
        if (status === 'Rejected') updateFields.status = 'Rejected';
        if (status === 'Approved' && approverRole === 'hr') updateFields.status = 'Approved';

        if (remarks) updateFields.approverRemarks = remarks;

        const app = await LeaveApplication.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        // If finally approved, update Leave Balance? (Logic can be added here)

        res.json(app);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- Leave Balance ---

// @route   GET /api/attendance/leave/balance/:employeeId
// @desc    Get Leave Balance
router.get('/leave/balance/:employeeId', async (req, res) => {
    try {
        // Default to current year
        const year = new Date().getFullYear();
        let balance = await LeaveBalance.findOne({ employeeId: req.params.employeeId, year });

        if (!balance) {
            // Return default zero balance structure if not found
            return res.json({
                employeeId: req.params.employeeId, year,
                cl: 0, sl: 0, el: 0,
                clUsed: 0, slUsed: 0, elUsed: 0
            });
        }
        res.json(balance);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});



// --- Leave Encashment ---

// @route   POST /api/attendance/encashment/apply
// @desc    Apply for Leave Encashment
router.post('/encashment/apply', async (req, res) => {
    try {
        const { employeeId, year, requestedDays, amountPerDay } = req.body;

        // Validation: Check if balance enough
        const balance = await LeaveBalance.findOne({ employeeId, year });
        if (!balance || balance.el < requestedDays) {
            return res.status(400).json({ msg: 'Insufficient Earned Leave Balance' });
        }

        const encashment = new LeaveEncashment({
            ...req.body,
            openingBalance: balance.el,
            maxEncashableDays: balance.el / 2, // Example policy
            totalAmount: requestedDays * amountPerDay
        });

        await encashment.save();
        res.json(encashment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/encashment/history/:employeeId
// @desc    Get Encashment History
router.get('/encashment/history/:employeeId', async (req, res) => {
    try {
        const history = await LeaveEncashment.find({ employeeId: req.params.employeeId }).sort({ requestDate: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/attendance/encashment/approve/:id
// @desc    Approve Encashment
router.put('/encashment/approve/:id', async (req, res) => {
    const { status, approverId, remarks } = req.body;
    try {
        const encashment = await LeaveEncashment.findByIdAndUpdate(
            req.params.id,
            { status, approverId, remarks },
            { new: true }
        );

        if (status === 'Approved') {
            // Deduct from Balance
            const balance = await LeaveBalance.findOne({ employeeId: encashment.employeeId, year: encashment.year });
            if (balance) {
                balance.el -= encashment.requestedDays;
                balance.elEncashed += encashment.requestedDays;
                await balance.save();
            }
        }

        res.json(encashment);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- Reports ---

// @route   GET /api/attendance/reports/summary
// @desc    Get Attendance Summary (Present, Absent counts)
router.get('/reports/summary', async (req, res) => {
    const { month, year } = req.query;
    try {
        const stats = await AttendanceLog.aggregate([
            { $match: { date: { $regex: `^${year}-${month}` } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/attendance/reports/leave-balance-all
// @desc    Get All Employees Leave Balances for Reports
router.get('/reports/leave-balance-all', async (req, res) => {
    try {
        const year = req.query.year || new Date().getFullYear();
        const balances = await LeaveBalance.find({ year }).populate('employeeId', 'personal.fullName employment.department');
        // Note: populate requires ref setup correct in schemas
        res.json(balances);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
