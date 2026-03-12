const express = require('express');
const router = express.Router();
const Employee = require('../../models/hrms/Employee');

// @route   GET /api/employees
// @desc    Get all employees (Includes basic filters for Overview/Reports)
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const { department, branch, status } = req.query;

        let query = {};
        if (department) query['employment.department'] = department;
        if (branch) query['employment.branchCode'] = branch;
        if (status) query.status = status;

        const employees = await Employee.find(query).sort({ createdDate: -1 });
        res.json(employees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/employees/:id
// @desc    Get single employee by ID (e.g., EMP001)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeId: req.params.id });
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Public
router.post('/', async (req, res) => {
    // Extract and map frontend data to backend schema
    const {
        id, // EMP001
        personal,
        address,
        kyc,
        employment,
        documents,
        training,
        createdBy
    } = req.body;

    try {
        let employee = await Employee.findOne({ employeeId: id });

        if (employee) {
            return res.status(400).json({ msg: 'Employee already exists' });
        }

        employee = new Employee({
            employeeId: id,
            createdBy,
            personal,
            address,
            kyc,
            employment,
            documents,
            training
        });

        await employee.save();
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/employees/:id
// @desc    Update employee details
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const {
            personal,
            address,
            kyc,
            employment,
            documents,
            training,
            status
        } = req.body;

        const updateFields = {};
        if (personal) updateFields.personal = personal;
        if (address) updateFields.address = address;
        if (kyc) updateFields.kyc = kyc;
        if (employment) updateFields.employment = employment;
        if (documents) updateFields.documents = documents;
        if (training) updateFields.training = training;
        if (status) updateFields.status = status;

        let employee = await Employee.findOne({ employeeId: req.params.id });
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // Use findOneAndUpdate to merge nested objects properly or manually merge
        // For simplicity, we'll replace the sections if provided, but in production, deep merge is better.
        // Here we assume the frontend sends the *complete* section if updating it.

        if (personal) employee.personal = { ...employee.personal, ...personal };
        if (address) employee.address = { ...employee.address, ...address };
        if (kyc) employee.kyc = { ...employee.kyc, ...kyc };
        if (employment) employee.employment = { ...employee.employment, ...employment };
        if (documents) employee.documents = { ...employee.documents, ...documents };
        if (training) employee.training = { ...employee.training, ...training };
        if (status) employee.status = status;

        await employee.save();
        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/employees/:id
// @desc    Delete/Terminate employee (Soft delete preferred usually, but hard delete here for now)
router.delete('/:id', async (req, res) => {
    try {
        await Employee.findOneAndDelete({ employeeId: req.params.id });
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/employees/bulk
// @desc    Bulk upload employees
router.post('/bulk', async (req, res) => {
    try {
        const employees = req.body; // Expects an array of employee objects
        if (!Array.isArray(employees)) {
            return res.status(400).json({ msg: 'Invalid data format. Expected an array.' });
        }

        const results = [];
        for (const empData of employees) {
            // Check if exists
            let emp = await Employee.findOne({ employeeId: empData.id });
            if (emp) {
                // Update
                emp.personal = empData.personal;
                emp.address = empData.address;
                emp.kyc = empData.kyc;
                emp.employment = empData.employment;
                await emp.save();
                results.push({ id: empData.id, status: 'Updated' });
            } else {
                // Create
                emp = new Employee({
                    employeeId: empData.id,
                    personal: empData.personal,
                    address: empData.address,
                    kyc: empData.kyc,
                    employment: empData.employment
                });
                await emp.save();
                results.push({ id: empData.id, status: 'Created' });
            }
        }
        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
