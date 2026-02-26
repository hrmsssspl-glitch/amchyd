const Asset = require('../models/assetModel');
const XLSX = require('xlsx');
const { Readable } = require('stream');

// Helper to calculate months between dates
const calculateMonths = (start, end) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
};

// @desc    Get all assets (paginated with advanced filters)
// @route   GET /api/assets
const getAssets = async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 25; // Dynamic page size
    const page = Number(req.query.pageNumber) || 1;

    const {
        keyword, assetNumber, kva, engineHpRange, branch,
        coordinator, customerName, status, purchaseOrderNo,
        contractPeriod, contractMonthsPending, billingMonth, poMonth,
        engineerName
    } = req.query;

    let query = {};

    // 1. Basic Keyword Search (Global)
    if (keyword) {
        query.assetNumber = { $regex: keyword, $options: 'i' };
    }

    // 2. Advanced Filters
    if (assetNumber) query.assetNumber = { $regex: assetNumber, $options: 'i' };
    if (kva) query.kva = { $regex: kva, $options: 'i' };
    if (engineHpRange) query.engineHpRange = { $regex: engineHpRange, $options: 'i' };
    if (branch) query.branch = branch;
    if (coordinator) query.coordinator = { $regex: coordinator, $options: 'i' };
    if (engineerName) query.engineerName = { $regex: engineerName, $options: 'i' };
    if (customerName) query.customerName = { $regex: customerName, $options: 'i' };
    if (status) query.status = status;
    if (purchaseOrderNo) query.purchaseOrderNo = { $regex: purchaseOrderNo, $options: 'i' };
    if (contractPeriod) query.contractPeriod = { $regex: contractPeriod, $options: 'i' };
    if (contractMonthsPending) query.contractMonthsPending = Number(contractMonthsPending);

    // 3. Month-wise Billing (Search in any Q1-Q4 milestone dates)
    if (billingMonth) {
        const monthIndex = Number(billingMonth); // 1-12
        if (!isNaN(monthIndex)) {
            query.$or = [
                { $expr: { $eq: [{ $month: '$q1Date' }, monthIndex] } },
                { $expr: { $eq: [{ $month: '$q2Date' }, monthIndex] } },
                { $expr: { $eq: [{ $month: '$q3Date' }, monthIndex] } },
                { $expr: { $eq: [{ $month: '$q4Date' }, monthIndex] } }
            ];
        }
    }

    // 4. PO Month Search
    if (poMonth) {
        const monthIndex = Number(poMonth);
        if (!isNaN(monthIndex)) {
            query.$expr = { $eq: [{ $month: '$purchaseOrderDate' }, monthIndex] };
        }
    }

    try {
        const count = await Asset.countDocuments(query);
        const assets = await Asset.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ assets, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
    try {
        const assetData = calculateAssetFields(req.body);
        const asset = await Asset.create(assetData);
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
const updateAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (asset) {
            const updatedData = calculateAssetFields(req.body);
            Object.assign(asset, updatedData);
            const savedAsset = await asset.save();
            res.json(savedAsset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper for calculations
const calculateAssetFields = (data) => {
    console.log('Incoming Asset Data:', data);
    const fields = { ...data };

    try {
        // 1. GST & Total
        const basic = Number(fields.basicAmount) || 0;
        fields.basicAmount = basic;
        fields.gstAmount = Number((basic * 0.18).toFixed(2));
        fields.totalAmount = Number((basic + fields.gstAmount).toFixed(2));

        // 2. Contract Period & Months Pending
        if (fields.contractStartDate && fields.contractEndDate) {
            const start = new Date(fields.contractStartDate);
            const end = new Date(fields.contractEndDate);
            const today = new Date();

            const totalMonths = calculateMonths(start, end);
            fields.contractPeriod = `${totalMonths} Months`;

            const pendingMonths = calculateMonths(today, end);
            fields.contractMonthsPending = pendingMonths > 0 ? pendingMonths : 0;
        }

        // Ensure all numeric fields are Numbers
        ['q1Amount', 'q2Amount', 'q3Amount', 'q4Amount', 'noOfVisits'].forEach(key => {
            if (fields[key] !== undefined) {
                fields[key] = Number(fields[key]) || 0;
            }
        });

        console.log('Calculated Asset Fields:', fields);
    } catch (err) {
        console.error('Calculation Error:', err);
    }

    return fields;
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (asset) {
            await asset.deleteOne();
            res.json({ message: 'Asset removed' });
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export assets to Excel
// @route   GET /api/assets/export
const exportAssets = async (req, res) => {
    try {
        const assets = await Asset.find({}).lean();
        const data = assets.map(a => {
            const { _id, createdAt, updatedAt, __v, ...rest } = a;
            return rest;
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Assets');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const fileName = `AssetReport_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk import assets
// @route   POST /api/assets/import
const importAssets = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer' });
        const results = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });

        if (results.length > 0) {
            await Asset.insertMany(results);
        }
        res.status(201).json({ message: `${results.length} assets imported successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Download asset template
// @route   GET /api/assets/template
const downloadAssetTemplate = (req, res) => {
    const template = [
        {
            assetNumber: 'ASSET001',
            model: 'Model X',
            branch: 'UPPAL',
            customerName: 'Demo Customer',
            kva: '100',
            engineHpRange: '50-100',
            contractStartDate: '2023-01-01',
            contractEndDate: '2023-12-31',
            basicAmount: 50000,
            coordinator: 'John Doe',
            engineerName: 'Engineer Name',
            engineerContact: '9876543210',
            status: 'Active'
        }
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'Assets');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.header('Content-Disposition', 'attachment; filename="asset_import_template.xlsx"');
    return res.send(buffer);
};

module.exports = {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    exportAssets,
    importAssets,
    downloadAssetTemplate
};
