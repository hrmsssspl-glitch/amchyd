const express = require('express');
const router = express.Router();
const Company = require('../../models/hrms/Company');
const Branch = require('../../models/hrms/Branch');
const Department = require('../../models/hrms/Department');
const LeaveType = require('../../models/hrms/LeaveType');
const State = require('../../models/hrms/State');

// --- COMPANY ---

// @route   GET /api/organization/company
// @desc    Get company details
router.get('/company', async (req, res) => {
    try {
        let company = await Company.findOne();
        if (!company) {
            // Return empty if not found, frontend should handle create
            return res.json({});
        }
        res.json(company);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/organization/company
// @desc    Update or create company details
router.post('/company', async (req, res) => {
    try {
        const { _id, createdAt, updatedAt, __v, ...updateData } = req.body; // Exclude immutable fields

        let company = await Company.findOne();
        if (company) {
            // Update
            company = await Company.findOneAndUpdate({}, updateData, { new: true });
        } else {
            // Create
            company = new Company(updateData);
            await company.save();
        }
        res.json(company);
    } catch (err) {
        console.error("Error saving company:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    }
});


// --- BRANCHES ---

// @route   GET /api/organization/branches
// @desc    Get all branches
router.get('/branches', async (req, res) => {
    try {
        const branches = await Branch.find().sort({ branchName: 1 });
        res.json(branches);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/organization/branches
// @desc    Create a branch
router.post('/branches', async (req, res) => {
    try {
        const newBranch = new Branch(req.body);
        const branch = await newBranch.save();
        res.json(branch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/organization/branches/:id
// @desc    Update a branch
router.put('/branches/:id', async (req, res) => {
    try {
        const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(branch);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/organization/branches/:id
// @desc    Delete a branch
router.delete('/branches/:id', async (req, res) => {
    try {
        await Branch.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Branch removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- DEPARTMENTS ---

// @route   GET /api/organization/departments
// @desc    Get all departments
router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/organization/departments
// @desc    Create a department
router.post('/departments', async (req, res) => {
    try {
        const newDept = new Department(req.body);
        const dept = await newDept.save();
        res.json(dept);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/organization/departments/:id
// @desc    Update a department
router.put('/departments/:id', async (req, res) => {
    try {
        const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(dept);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/organization/departments/:id
// @desc    Delete a department
router.delete('/departments/:id', async (req, res) => {
    try {
        await Department.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Department removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- LEAVE TYPES ---

// @route   GET /api/organization/leavetypes
// @desc    Get all leave types
router.get('/leavetypes', async (req, res) => {
    try {
        const leaveTypes = await LeaveType.find();
        res.json(leaveTypes);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/organization/leavetypes
// @desc    Create a leave type
router.post('/leavetypes', async (req, res) => {
    try {
        const newType = new LeaveType(req.body);
        const savedType = await newType.save();
        res.json(savedType);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Leave Code already exists' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/organization/leavetypes/:id
// @desc    Update a leave type
router.put('/leavetypes/:id', async (req, res) => {
    try {
        const type = await LeaveType.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(type);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/organization/leavetypes/:id
// @desc    Delete a leave type
router.delete('/leavetypes/:id', async (req, res) => {
    try {
        await LeaveType.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Leave Type removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- STATES ---

// @route   GET /api/organization/states
// @desc    Get all states
router.get('/states', async (req, res) => {
    try {
        const states = await State.find().sort({ name: 1 });
        res.json(states);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/organization/states
// @desc    Create a state
router.post('/states', async (req, res) => {
    try {
        const newState = new State(req.body);
        const state = await newState.save();
        res.json(state);
    } catch (err) {
        console.error(err.message);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'State already exists' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/organization/states/:id
// @desc    Update a state
router.put('/states/:id', async (req, res) => {
    try {
        const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(state);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/organization/states/:id
// @desc    Delete a state
router.delete('/states/:id', async (req, res) => {
    try {
        await State.findByIdAndDelete(req.params.id);
        res.json({ msg: 'State removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;
