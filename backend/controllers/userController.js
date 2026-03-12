const User = require('../models/userModel');
const XLSX = require('xlsx');
const { Readable } = require('stream');

// @desc    Get all users (paginated)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const pageSize = 25;
    const page = Number(req.query.pageNumber) || 1;
    const searchTerm = req.query.searchTerm || '';
    const role = req.query.role || '';

    const query = {};
    if (searchTerm) {
        query.$or = [
            { employeeId: { $regex: searchTerm, $options: 'i' } },
            { employeeName: { $regex: searchTerm, $options: 'i' } }
        ];
    }
    if (role) {
        query.role = role;
    }

    try {
        const count = await User.countDocuments(query);
        const users = await User.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    const { employeeId, employeeName, password, role, state, assignedBranches } = req.body;

    try {
        const userExists = await User.findOne({ employeeId });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            employeeId,
            employeeName,
            password,
            role,
            state: state || '',
            assignedBranches: assignedBranches || [],
        });

        if (user) {
            res.status(201).json(user);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.employeeName = req.body.employeeName || user.employeeName;
            user.employeeId = req.body.employeeId || user.employeeId;
            user.role = req.body.role || user.role;
            user.state = req.body.state !== undefined ? req.body.state : user.state;
            user.assignedBranches = req.body.assignedBranches !== undefined ? req.body.assignedBranches : user.assignedBranches;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'Super Admin' && (await User.countDocuments({ role: 'Super Admin' })) === 1) {
                return res.status(400).json({ message: 'Cannot delete the last Super Admin' });
            }
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export users to CSV
// @route   GET /api/users/export
// @access  Private/Admin
const exportUsers = async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    const role = req.query.role || '';

    const query = {};
    if (searchTerm) {
        query.$or = [
            { employeeId: { $regex: searchTerm, $options: 'i' } },
            { employeeName: { $regex: searchTerm, $options: 'i' } }
        ];
    }
    if (role) {
        query.role = role;
    }

    try {
        const users = await User.find(query).select('employeeId employeeName role state assignedBranches -_id');

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(users.map(u => ({
            'Employee ID': u.employeeId,
            'Employee Name': u.employeeName,
            'Role': u.role,
            'State': u.state || '',
            'Assigned Branches': (u.assignedBranches || []).join(', ')
        })));

        XLSX.utils.book_append_sheet(wb, ws, 'Users');

        // Generate buffer
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('users.xlsx');
        return res.send(buf);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk import users from CSV
// @route   POST /api/users/import
// @access  Private/Admin
const importUsers = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const results = XLSX.utils.sheet_to_json(worksheet);

        const usersToCreate = [];
        for (const row of results) {
            // Mapping Excel columns to model fields
            const employeeId = row['Employee ID'] || row.employeeId;
            const employeeName = row['Employee Name'] || row.employeeName;
            const role = row['Role'] || row.role || 'Service Engineer';
            const password = row['Password'] || row.password || '';

            if (employeeId && employeeName) {
                const userExists = await User.findOne({ employeeId });
                if (!userExists) {
                    usersToCreate.push({
                        employeeId,
                        employeeName,
                        role,
                        password,
                    });
                }
            }
        }

        if (usersToCreate.length > 0) {
            await User.insertMany(usersToCreate);
        }
        res.status(201).json({ message: `${usersToCreate.length} users imported successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    exportUsers,
    importUsers,
};
