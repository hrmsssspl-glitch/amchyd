const Employee = require('../models/employeeModel');
const XLSX = require('xlsx');
const { Readable } = require('stream');

// @desc    Get all employees (paginated)
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
    const pageSize = 25;
    const page = Number(req.query.pageNumber) || 1;
    const searchTerm = req.query.searchTerm || '';
    const department = req.query.department || '';

    const query = {};
    if (searchTerm) {
        query.$or = [
            { employeeId: { $regex: searchTerm, $options: 'i' } },
            { employeeName: { $regex: searchTerm, $options: 'i' } },
            { designation: { $regex: searchTerm, $options: 'i' } }
        ];
    }
    if (department) {
        query.department = department;
    }

    try {
        const count = await Employee.countDocuments(query);
        const employees = await Employee.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ employees, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            Object.assign(employee, req.body);
            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            await employee.deleteOne();
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export employees to CSV/Excel
// @route   GET /api/employees/export
// @access  Private
const exportEmployees = async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    const department = req.query.department || '';

    const query = {};
    if (searchTerm) {
        query.$or = [
            { employeeId: { $regex: searchTerm, $options: 'i' } },
            { employeeName: { $regex: searchTerm, $options: 'i' } },
            { designation: { $regex: searchTerm, $options: 'i' } }
        ];
    }
    if (department) {
        query.department = department;
    }

    try {
        const employees = await Employee.find(query).lean();
        const data = employees.map(e => {
            const { _id, createdAt, updatedAt, __v, ...rest } = e;
            return rest;
        });

        // Strictly Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Employees');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('employees.xlsx');
        return res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk import employees
// @route   POST /api/employees/import
// @access  Private/Admin
const importEmployees = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const results = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (results.length > 0) {
            // Validate mandatory fields
            const validData = results.filter(r => r.employeeId && r.employeeName);
            if (validData.length > 0) {
                await Employee.insertMany(validData);
            }
        }
        res.status(201).json({ message: `${results.length} employees imported successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    exportEmployees,
    importEmployees,
};
