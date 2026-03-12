const Organization = require('../models/organizationModel');
const XLSX = require('xlsx');
const { Readable } = require('stream');

// @desc    Get all organizations (paginated)
// @route   GET /api/organizations
// @access  Private/Admin
const getOrganizations = async (req, res) => {
    const pageSize = 25;
    const page = Number(req.query.pageNumber) || 1;
    const searchTerm = req.query.searchTerm || '';
    const state = req.query.state || '';

    const query = {};
    if (searchTerm) {
        query.companyName = { $regex: searchTerm, $options: 'i' };
    }
    if (state) {
        query.state = state;
    }

    try {
        const count = await Organization.countDocuments(query);
        const organizations = await Organization.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ organizations, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an organization
// @route   POST /api/organizations
// @access  Private/Admin
const createOrganization = async (req, res) => {
    try {
        const organization = await Organization.create(req.body);
        res.status(201).json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private/Admin
const updateOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (organization) {
            Object.assign(organization, req.body);
            const updatedOrganization = await organization.save();
            res.json(updatedOrganization);
        } else {
            res.status(404).json({ message: 'Organization not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private/Admin
const deleteOrganization = async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);

        if (organization) {
            await organization.deleteOne();
            res.json({ message: 'Organization removed' });
        } else {
            res.status(404).json({ message: 'Organization not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export organizations to CSV/Excel
// @route   GET /api/organizations/export
// @access  Private/Admin
const exportOrganizations = async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    const state = req.query.state || '';

    const query = {};
    if (searchTerm) {
        query.companyName = { $regex: searchTerm, $options: 'i' };
    }
    if (state) {
        query.state = state;
    }

    try {
        const organizations = await Organization.find(query).lean();
        const data = organizations.map(o => {
            const { _id, createdAt, updatedAt, __v, branches, branch, ...rest } = o;
            return {
                ...rest,
                Branches: branches && branches.length > 0 ? branches.join(', ') : (branch || '')
            };
        });

        // Strictly Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Organizations');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.attachment('organizations.xlsx');
        return res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk import organizations
// @route   POST /api/organizations/import
// @access  Private/Admin
const importOrganizations = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const results = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (results.length > 0) {
            await Organization.insertMany(results);
        }
        res.status(201).json({ message: `${results.length} organizations imported successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get distinct state-branch options from Organization Master
// @route   GET /api/organizations/branches
// @access  Private
const getBranchOptions = async (req, res) => {
    try {
        // Get distinct state+branch pairs that are non-empty
        const orgs = await Organization.find(
            { $or: [{ branches: { $exists: true, $not: { $size: 0 } } }, { branch: { $exists: true, $ne: '' } }] },
            { state: 1, branches: 1, branch: 1, _id: 0 }
        ).lean();

        // Build a grouped structure: { state: [branch1, branch2, ...] }
        const grouped = {};
        const allBranches = [];
        orgs.forEach(org => {
            const st = org.state || 'Other';
            if (!grouped[st]) grouped[st] = new Set();

            const branchesToAdd = org.branches || (org.branch ? [org.branch] : []);

            branchesToAdd.forEach(branch => {
                if (branch) {
                    grouped[st].add(branch);
                    allBranches.push(branch);
                }
            });
        });

        // Convert sets to sorted arrays
        const result = Object.entries(grouped).map(([state, branches]) => ({
            state,
            branches: [...branches].sort()
        }));

        res.json({
            grouped: result,
            allBranches: [...new Set(allBranches)].sort(),
            states: result.map(r => r.state)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrganizations,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    exportOrganizations,
    importOrganizations,
    getBranchOptions,
};
