const Employee = require('../models/employeeModel');
const XLSX = require('xlsx');

/**
 * @desc    Get all employees (paginated)
 * @route   GET /api/employees
 * @access  Private
 */
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

        console.log(`Fetching employees: found ${employees.length} out of ${count} total matching records.`);
        res.json({ employees, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error('Error fetching employees:', error.message);
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Get next available employee ID
 * @route   GET /api/employees/next-id
 * @access  Private
 */
const getNextEmployeeId = async (req, res) => {
    try {
        const employees = await Employee.find({}, { employeeId: 1 }).lean();
        let maxId = 100000;

        employees.forEach(emp => {
            // Extract numeric part of ID
            const numericId = parseInt(emp.employeeId.replace(/\D/g, ''));
            if (!isNaN(numericId) && numericId > maxId) {
                maxId = numericId;
            }
        });

        res.json({ nextId: (maxId + 1).toString() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Create an employee
 * @route   POST /api/employees
 * @access  Private/Admin
 */
const createEmployee = async (req, res) => {
    try {
        const { employeeId } = req.body;

        // Explicit check for duplicate employeeId
        const existingEmployee = await Employee.findOne({ employeeId });
        if (existingEmployee) {
            return res.status(400).json({ message: `Employee ID ${employeeId} already exists` });
        }

        const employee = await Employee.create(req.body);
        res.status(201).json(employee);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A duplicate value was found for a unique field' });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Update employee
 * @route   PUT /api/employees/:id
 * @access  Private/Admin
 */
const updateEmployee = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            // If employeeId is being changed, check if the new ID already exists
            if (employeeId && employeeId !== employee.employeeId) {
                const existingEmployee = await Employee.findOne({ employeeId });
                if (existingEmployee) {
                    return res.status(400).json({ message: `Employee ID ${employeeId} already exists` });
                }
            }

            Object.assign(employee, req.body);
            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A duplicate value was found for a unique field' });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * @desc    Delete employee
 * @route   DELETE /api/employees/:id
 * @access  Private/Admin
 */
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

/**
 * @desc    Export employees to Excel
 * @route   GET /api/employees/export
 * @access  Private
 */
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

/**
 * @desc    Bulk import employees
 * @route   POST /api/employees/import
 * @access  Private/Admin
 */
const importEmployees = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const results = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (results.length === 0) {
            return res.status(400).json({ message: 'No data found in the uploaded file' });
        }

        let importedCount = 0;
        let skippedCount = 0;
        let duplicateIds = [];
        let invalidCount = 0;
        let errorDetails = [];

        for (const rawData of results) {
            const employeeId = (rawData.employeeId || rawData['Employee ID'] || rawData['Emp ID'] || rawData['ID'] || '').toString().trim();
            const employeeName = (rawData.employeeName || rawData['Employee Name'] || rawData['Name'] || rawData['Full Name'] || '').toString().trim();

            if (!employeeId || !employeeName) {
                invalidCount++;
                continue;
            }

            // Normalize enum fields to match Mongoose schema (Sentence Case)
            const normalize = (val) => {
                if (!val) return '';
                const s = val.toString().trim().toLowerCase();
                return s.charAt(0).toUpperCase() + s.slice(1);
            };

            const empData = {
                ...rawData,
                employeeId,
                employeeName,
                gender: normalize(rawData.gender || rawData['Gender']),
                status: normalize(rawData.status || rawData['Status'] || 'Active')
            };

            try {
                const existing = await Employee.findOne({ employeeId: empData.employeeId });
                if (existing) {
                    skippedCount++;
                    duplicateIds.push(empData.employeeId);
                    continue;
                }
                await Employee.create(empData);
                importedCount++;
            } catch (err) {
                console.error(`Import error for ID ${empData.employeeId}:`, err.message);
                skippedCount++;
                errorDetails.push(`${empData.employeeId}: ${err.message}`);
            }
        }

        let message = `${importedCount} employees imported successfully.`;
        if (skippedCount > 0) message += ` ${skippedCount} items skipped.`;
        if (invalidCount > 0) message += ` ${invalidCount} rows missing ID or Name.`;

        if (duplicateIds.length > 0) {
            const displayIds = duplicateIds.length > 5 ? [...duplicateIds.slice(0, 5), '...'].join(', ') : duplicateIds.join(', ');
            message += ` Duplicates: ${displayIds}`;
        }

        if (errorDetails.length > 0) {
            const displayErrors = errorDetails.length > 3 ? [...errorDetails.slice(0, 3), '...'].join('; ') : errorDetails.join('; ');
            message += ` Errors: ${displayErrors}`;
        }

        res.status(201).json({
            message,
            importedCount,
            skippedCount,
            invalidCount,
            duplicateIds,
            errorDetails
        });
    } catch (error) {
        console.error('Bulk Import Error:', error.message);
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
    getNextEmployeeId
};
