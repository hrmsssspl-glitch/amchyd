const express = require('express');
const router = express.Router();
const SalaryStructure = require('../../models/hrms/SalaryStructure');
const PayrollRecord = require('../../models/hrms/PayrollRecord');
const Employee = require('../../models/hrms/Employee');

// --- Salary Structure Routes ---

// @route   GET /api/payroll/structure/:id
// @desc    Get Salary Structure for an Employee (by EMP ID)
router.get('/structure/:id', async (req, res) => {
    try {
        let structure = await SalaryStructure.findOne({ employeeId: req.params.id });
        if (!structure) {
            // If none found, return default empty object or similar
            // Alternatively, create a default one based on grade? (Advanced)
            return res.status(404).json({ msg: 'Salary structure not found' });
        }
        res.json(structure);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/payroll/structure
// @desc    Create or Update Salary Structure
router.post('/structure', async (req, res) => {
    const { employeeId, ctc, basicSalary, ...rest } = req.body;
    try {
        let structure = await SalaryStructure.findOne({ employeeId });
        if (structure) {
            // Update
            structure = await SalaryStructure.findOneAndUpdate(
                { employeeId },
                { ctc, basicSalary, ...rest },
                { new: true }
            );
        } else {
            // Create
            structure = new SalaryStructure({ employeeId, ctc, basicSalary, ...rest });
            await structure.save();
        }
        res.json(structure);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/payroll/structure/:id
// @desc    Delete Salary Structure
router.delete('/structure/:id', async (req, res) => {
    try {
        await SalaryStructure.findOneAndDelete({ employeeId: req.params.id });
        res.json({ msg: 'Salary Structure Deleted' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- Payroll Processing Routes ---

// @route   GET /api/payroll/records
// @desc    Get Payroll Records (Filter by Month/Year/Employee)
router.get('/records', async (req, res) => {
    const { month, year, employeeId } = req.query;
    let query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);
    if (employeeId) query.employeeId = employeeId;

    try {
        const records = await PayrollRecord.find(query).sort({ year: -1, month: -1 });
        res.json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/payroll/process
// @desc    Process/Create Monthly Payroll for an Employee
router.post('/process', async (req, res) => {
    const { employeeId, month, year, attendance, adjustments } = req.body;

    // Validations
    if (!employeeId || !month || !year) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
        // 1. Fetch Salary Structure
        const structure = await SalaryStructure.findOne({ employeeId });
        if (!structure) {
            return res.status(400).json({ msg: `Salary Structure not defined for ${employeeId}` });
        }

        // 2. Calculate Earnings based on Attendance (Simplified Logic here)
        // In a real app, this logic would be much more complex (pro-rata, etc.)
        const basicEarned = structure.basicSalary; // Assuming full attendance for now unless user overrides
        const hraEarned = structure.hra;
        // ... more calcs

        // 3. Create Record
        const newRecord = new PayrollRecord({
            employeeId,
            month,
            year,
            basicSalary: structure.basicSalary,
            ctc: structure.ctc,
            grossSalary: basicEarned + hraEarned, // + others
            netPay: (basicEarned + hraEarned) - 1000, // Dummy deduction logic
            status: 'Draft',
            ...req.body // Allow override from request
        });

        // Check for existing
        const existing = await PayrollRecord.findOne({ employeeId, month, year });
        if (existing) {
            return res.status(400).json({ msg: 'Payroll for this month already exists' });
        }

        await newRecord.save();
        res.json(newRecord);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/payroll/records/:id
// @desc    Update Payroll Record (e.g., status, override amounts)
router.put('/records/:id', async (req, res) => {
    try {
        const record = await PayrollRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(record);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/payroll/records/:id
router.delete('/records/:id', async (req, res) => {
    try {
        await PayrollRecord.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Record removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- Reports / Payslip View ---
// Just use GET /records listing or GET /records/:id for specific payslip details
router.get('/records/:id', async (req, res) => {
    try {
        const record = await PayrollRecord.findById(req.params.id);
        if (!record) return res.status(404).json({ msg: 'Payslip not found' });
        res.json(record);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
