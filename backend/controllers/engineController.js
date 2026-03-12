const Engine = require('../models/engineModel');
const Asset = require('../models/assetModel');
const mongoose = require('mongoose');
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

// Helper to build MongoDB query from filters
const buildEngineQuery = (filters) => {
    const {
        keyword, assetNumber, kva, engineHpRange, branch, state,
        coordinator, customerName, status, purchaseOrderNo,
        contractMonthsPending, billingMonth, poMonth,
        engineerName, advisor, contractStartDateFrom, contractEndDateTo,
        application, industrySegment, customerSegment, calendarYear,
        conversionQuoteAssignedToId, conversionQuoteStatus
    } = filters;

    let query = {};

    // 1. Basic Keyword Search (Global)
    if (keyword) {
        query.$or = [
            { assetNumber: { $regex: keyword, $options: 'i' } },
            { customerName: { $regex: keyword, $options: 'i' } },
            { model: { $regex: keyword, $options: 'i' } }
        ];
    }

    // 2. Advanced Filters
    if (assetNumber) query.assetNumber = { $regex: assetNumber, $options: 'i' };
    if (kva) query.kva = { $regex: kva, $options: 'i' };
    if (engineHpRange) query.engineHpRange = { $regex: engineHpRange, $options: 'i' };
    if (branch) query.branch = branch;
    if (state) query.state = state;
    if (coordinator) query.coordinator = { $regex: coordinator, $options: 'i' };
    if (engineerName) query.engineerName = { $regex: engineerName, $options: 'i' };
    if (customerName) query.customerName = { $regex: customerName, $options: 'i' };
    if (advisor) query.advisor = { $regex: advisor, $options: 'i' };

    // New Engine Master Search Fields
    if (application) query.application = application;
    if (industrySegment) query.industrySegment = { $regex: industrySegment, $options: 'i' };
    if (customerSegment) query.customerSegment = customerSegment;
    if (calendarYear) query.calendarYear = calendarYear;

    if (conversionQuoteAssignedToId) query.conversionQuoteAssignedToId = conversionQuoteAssignedToId;
    if (conversionQuoteStatus) query.conversionQuoteStatus = conversionQuoteStatus;

    if (status) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (status === 'Active') {
            query.contractEndDate = { $gte: today };
        } else if (status === 'Inactive') {
            query.contractEndDate = { $lt: today };
        } else {
            query.status = status;
        }
    }

    if (purchaseOrderNo) query.purchaseOrderNo = { $regex: purchaseOrderNo, $options: 'i' };

    // Date Range Filters
    if (contractStartDateFrom || contractEndDateTo) {
        if (contractStartDateFrom) {
            query.contractStartDate = { ...query.contractStartDate, $gte: new Date(contractStartDateFrom) };
        }
        if (contractEndDateTo) {
            query.contractEndDate = { ...query.contractEndDate, $lte: new Date(contractEndDateTo) };
        }
    }

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

    // 5. Contract End Month Search (Expiry Month)
    if (filters.contractEndMonth) {
        const monthIndex = Number(filters.contractEndMonth);
        if (!isNaN(monthIndex)) {
            query.$expr = { $eq: [{ $month: '$contractEndDate' }, monthIndex] };
        }
    }

    return query;
};

// @desc    Get all engines (paginated with advanced filters)
// @route   GET /api/engines
const getEngines = async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 25;
    const page = Number(req.query.pageNumber) || 1;

    let query = buildEngineQuery(req.query);

    if (req.user && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        const userFilters = [];
        if (Array.isArray(req.user.assignedBranches) && req.user.assignedBranches.length > 0) {
            userFilters.push({ branch: { $in: req.user.assignedBranches } });
        }
        if (req.user.employeeId) {
            userFilters.push({ conversionQuoteAssignedToId: req.user.employeeId });
        }

        if (userFilters.length > 0) {
            query.$and = query.$and || [];
            query.$and.push({ $or: userFilters });
        }
    }

    try {
        const count = await Engine.countDocuments(query);
        let engines = await Engine.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        engines = engines.map(engine => {
            const engineObj = engine.toObject();
            const calculated = calculateEngineFields(engineObj);
            return { ...engineObj, ...calculated };
        });

        res.json({ assets: engines, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all engines (unpaginated for conversion portal)
// @route   GET /api/engines/all
const getAllEngines = async (req, res) => {
    let query = {};

    if (req.user && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        const userFilters = [];
        if (Array.isArray(req.user.assignedBranches) && req.user.assignedBranches.length > 0) {
            userFilters.push({ branch: { $in: req.user.assignedBranches } });
        }
        if (req.user.employeeId) {
            userFilters.push({ conversionQuoteAssignedToId: req.user.employeeId });
        }

        if (userFilters.length > 0) {
            query.$or = userFilters;
        }
    }

    try {
        let engines = await Engine.find(query).sort({ createdAt: -1 });

        engines = engines.map(engine => {
            const engineObj = engine.toObject();
            const calculated = calculateEngineFields(engineObj);
            return { ...engineObj, ...calculated };
        });

        res.json(engines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get engine by asset number
// @route   GET /api/engines/asset/:assetNumber
const getEngineByAssetNumber = async (req, res) => {
    try {
        const engine = await Engine.findOne({ assetNumber: req.params.assetNumber });
        if (engine) {
            const engineObj = engine.toObject();
            const calculated = calculateEngineFields(engineObj);
            res.json({ ...engineObj, ...calculated });
        } else {
            res.status(404).json({ message: 'Engine not localized' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an engine
// @route   POST /api/engines
const createEngine = async (req, res) => {
    try {
        const { assetNumber } = req.body;

        // 1. Check for global duplicates across BOTH Masters
        const [existingAsset, existingEngine] = await Promise.all([
            Asset.findOne({ assetNumber: assetNumber }),
            Engine.findOne({ assetNumber: assetNumber })
        ]);

        if (existingAsset) {
            return res.status(400).json({ message: `Asset Number ${assetNumber} is already registered in Asset Master for customer ${existingAsset.customerName}.` });
        }
        if (existingEngine) {
            return res.status(400).json({ message: `Asset Number ${assetNumber} is already registered in Cummins Engine Master for customer ${existingEngine.customerName}.` });
        }

        const engineData = calculateEngineFields(req.body);
        const engine = await Engine.create(engineData);
        res.status(201).json(engine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update engine
// @route   PUT /api/engines/:id
const updateEngine = async (req, res) => {
    try {
        const engine = await Engine.findById(req.params.id);
        if (engine) {
            const { _id, ...updateData } = req.body;
            const updatedData = calculateEngineFields({ ...engine.toObject(), ...updateData });
            Object.assign(engine, updatedData);
            const savedEngine = await engine.save();
            res.json(savedEngine);
        } else {
            res.status(404).json({ message: 'Engine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper for calculations and validation
const calculateEngineFields = (data) => {
    const fields = { ...data };

    // Normalize Branch, PO Type, Visit Type etc (similar to assetController)
    if (fields.poType) {
        const poTypeLower = String(fields.poType).toLowerCase().trim();
        if (poTypeLower === 'new') fields.poType = 'New';
        else if (poTypeLower === 'renewal') fields.poType = 'Renewal';
    }

    if (fields.typeOfVisits) {
        const vtLower = String(fields.typeOfVisits).toLowerCase().replace(/\s+/g, '').trim();
        const vtMap = {
            'monthly': 'Monthly',
            'bymonthly': 'By Monthly',
            'quarterly': 'Quarterly',
            'halfyearly': 'Half Yearly'
        };
        if (vtMap[vtLower]) fields.typeOfVisits = vtMap[vtLower];
    }

    // Normalize date fields
    const dateFields = [
        'contractStartDate', 'contractEndDate', 'scheduleDate', 'sonDate',
        'actualVisitDate', 'purchaseOrderDate', 'quoteDate', 'actualPoReceivedDate',
        'q1Date', 'q2Date', 'q3Date', 'q4Date', 'q1InvoiceDate', 'q2InvoiceDate',
        'q3InvoiceDate', 'q4InvoiceDate', 'q1PaymentReceivedDate', 'q2PaymentReceivedDate',
        'q3PaymentReceivedDate', 'q4PaymentReceivedDate', 'breakdownVisitDate',
        'aCheckDatetime', 'installDatetime', 'conversionQuoteDate', 'conversionRevisedQuoteDate',
        'bCheckDate'
    ];

    dateFields.forEach(key => {
        if (fields[key] === '') {
            fields[key] = null;
        } else if (fields[key] && (typeof fields[key] === 'string' || typeof fields[key] === 'number')) {
            const d = new Date(fields[key]);
            if (!isNaN(d.getTime())) {
                fields[key] = d;
            }
        }
    });

    try {
        // GST & Total
        const basic = Number(fields.basicAmount) || 0;
        fields.basicAmount = basic;
        fields.gstAmount = Number((basic * 0.18).toFixed(2));
        fields.totalAmount = Number((basic + fields.gstAmount).toFixed(2));

        // Contract Period & Months Pending
        if (fields.contractStartDate && fields.contractEndDate) {
            const start = new Date(fields.contractStartDate);
            const end = new Date(fields.contractEndDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const totalMonths = calculateMonths(start, end);
            fields.contractPeriod = `${totalMonths} Months`;

            const pendingMonths = calculateMonths(today, end);
            fields.contractMonthsPending = pendingMonths > 0 ? pendingMonths : 0;

            const compareEnd = new Date(end);
            compareEnd.setHours(0, 0, 0, 0);
            fields.status = compareEnd < today ? 'Inactive' : 'Active';
        }

        // Numeric fields
        ['q1Amount', 'q2Amount', 'q3Amount', 'q4Amount', 'noOfVisits', 'lastYearPriceBasic', 'amountHike', 'hikePercentage'].forEach(key => {
            if (fields[key] !== undefined && fields[key] !== '') {
                fields[key] = Number(fields[key]) || 0;
            }
        });

        // Price Hike
        if (fields.lastYearPriceBasic > 0) {
            fields.amountHike = Number((fields.basicAmount - fields.lastYearPriceBasic).toFixed(2));
            fields.hikePercentage = Number(((fields.amountHike / fields.lastYearPriceBasic) * 100).toFixed(2));
        }

    } catch (err) {
        console.error('Calculation Error:', err.message);
    }

    return fields;
};

// @desc    Delete multiple engines
// @route   DELETE /api/engines/bulk-delete
const bulkDeleteEngines = async (req, res) => {
    const { ids, filters } = req.body;
    console.log('Bulk Delete Engines Request - IDs:', ids?.length, 'Filters:', filters);

    try {
        let query = {};
        if (ids && Array.isArray(ids) && ids.length > 0) {
            // Explicitly cast to ObjectId for reliability
            const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
            query = { _id: { $in: objectIds } };
        } else if (filters) {
            query = buildEngineQuery(filters);
        } else {
            return res.status(400).json({ message: 'No engine IDs or filters provided' });
        }

        console.log('Final Delete Query (Engine):', JSON.stringify(query));
        const result = await Engine.deleteMany(query);
        console.log('Deleted Count (Engine):', result.deletedCount);
        res.json({ message: `${result.deletedCount} engines removed successfully` });
    } catch (error) {
        console.error('Bulk Delete Engines Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete engine
// @route   DELETE /api/engines/:id
const deleteEngine = async (req, res) => {
    try {
        const engine = await Engine.findById(req.params.id);
        if (engine) {
            await engine.deleteOne();
            res.json({ message: 'Engine removed' });
        } else {
            res.status(404).json({ message: 'Engine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export engines to Excel
// @route   GET /api/engines/export
const exportEngines = async (req, res) => {
    try {
        const engines = await Engine.find({}).lean();
        const data = engines.map(e => {
            const { _id, createdAt, updatedAt, __v, ...rest } = e;
            return rest;
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Engines');
        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        const fileName = `EngineReport_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.header('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk import engines
// @route   POST /api/engines/import
const importEngines = async (req, res) => {
    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const rawResults = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

        if (rawResults.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        const validEngines = [];
        const errors = [];
        const seenInFile = new Set();

        for (let i = 0; i < rawResults.length; i++) {
            const row = rawResults[i];
            if (!row.assetNumber && !row.customerName && !row.model) continue;

            try {
                if (!row.assetNumber) throw new Error('Asset Number is missing');
                const assetNo = String(row.assetNumber).trim();
                if (seenInFile.has(assetNo)) continue;
                seenInFile.add(assetNo);

                const validatedData = calculateEngineFields(row);
                validEngines.push(validatedData);
            } catch (err) {
                errors.push(`Row ${i + 2}: ${err.message}`);
            }
        }

        let createdCount = 0;
        if (validEngines.length > 0) {
            const assetNumbers = validEngines.map(a => a.assetNumber);

            // Check cross-collection duplicates (Asset & Engine)
            const [existingAssets, existingEngines] = await Promise.all([
                Asset.find({ assetNumber: { $in: assetNumbers } }, 'assetNumber'),
                Engine.find({ assetNumber: { $in: assetNumbers } }, 'assetNumber')
            ]);

            const existingNos = new Set([
                ...existingAssets.map(a => String(a.assetNumber).trim()),
                ...existingEngines.map(e => String(e.assetNumber).trim())
            ]);

            const finalToImport = validEngines.filter(a => !existingNos.has(String(a.assetNumber).trim()));
            if (finalToImport.length > 0) {
                const inserted = await Engine.insertMany(finalToImport, { ordered: false });
                createdCount = inserted.length;
            }
        }

        res.status(201).json({
            message: 'Import process completed',
            summary: {
                totalRows: rawResults.length,
                successfullyImported: createdCount,
                validationErrors: errors.length
            },
            errors: errors.slice(0, 20)
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during import: ' + error.message });
    }
};

// @desc    Download engine template
// @route   GET /api/engines/template
const downloadEngineTemplate = (req, res) => {
    const template = [{
        assetNumber: 'ENGINE001', model: 'Model X', branch: 'UPPAL', state: 'Telangana',
        customerName: 'Demo Customer', kva: '100', engineHpRange: '50-100',
        contractStartDate: '2023-01-01', contractEndDate: '2023-12-31',
        basicAmount: 50000, coordinator: 'John Doe', status: 'Active'
    }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(template);
    XLSX.utils.book_append_sheet(wb, ws, 'Engines');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.header('Content-Disposition', 'attachment; filename="engine_import_template.xlsx"');
    return res.send(buffer);
};

// @desc    Get engine statistics summary
// @route   GET /api/engines/stats
const getEngineStats = async (req, res) => {
    try {
        const total = await Engine.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const statusStats = {
            active: await Engine.countDocuments({ contractEndDate: { $gte: today } }),
            inactive: await Engine.countDocuments({ contractEndDate: { $lt: today } })
        };

        const branchStats = await Engine.aggregate([
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const hpRangeStats = await Engine.aggregate([
            { $group: { _id: '$engineHpRange', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            total,
            status: statusStats,
            branches: branchStats.map(b => ({ name: b._id || 'Unknown', count: b.count })),
            hpRanges: hpRangeStats.map(h => ({ range: h._id || 'Unknown', count: h.count }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add an inactive followup record to an engine
// @route   POST /api/engines/:id/followups
const addInactiveFollowup = async (req, res) => {
    try {
        const { id } = req.params;
        const engine = await Engine.findById(id);
        if (!engine) return res.status(404).json({ message: 'Engine not found' });

        engine.inactiveFollowups = engine.inactiveFollowups || [];
        engine.inactiveFollowups.push(req.body);

        if (req.body.poStatus === 'PO Received') {
            engine.status = 'Active';
        }

        await engine.save();
        res.status(201).json(engine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Inactive Followup Reports
// @route   GET /api/engines/followups/reports
const getFollowupReports = async (req, res) => {
    try {
        const { employeeId, fromDate, toDate, assetSearch } = req.query;
        const pipeline = [
            { $match: { 'inactiveFollowups.0': { $exists: true } } },
            { $unwind: '$inactiveFollowups' }
        ];

        const followupMatch = {};
        if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
            followupMatch['inactiveFollowups.employeeId'] = req.user.employeeId;
        } else if (employeeId) {
            followupMatch['inactiveFollowups.employeeId'] = { $regex: employeeId, $options: 'i' };
        }

        if (assetSearch) {
            followupMatch['$or'] = [{ assetNumber: { $regex: assetSearch, $options: 'i' } }];
        }

        if (fromDate || toDate) {
            followupMatch['inactiveFollowups.followUpDate'] = {};
            if (fromDate) followupMatch['inactiveFollowups.followUpDate'].$gte = new Date(fromDate);
            if (toDate) followupMatch['inactiveFollowups.followUpDate'].$lte = new Date(toDate);
        }

        if (Object.keys(followupMatch).length > 0) pipeline.push({ $match: followupMatch });

        pipeline.push({ $sort: { 'inactiveFollowups.followUpDate': -1 } });
        pipeline.push({
            $project: {
                _id: 1, assetNumber: 1, customerName: 1, branch: 1,
                followup: '$inactiveFollowups'
            }
        });

        const reports = await Engine.aggregate(pipeline);
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const exportFollowupReports = async (req, res) => {
    // Similar logic to getFollowupReports but returns XLSX buffer
    // Reusing asset logic but for Engines
    try {
        const reports = await Engine.aggregate([
            { $match: { 'inactiveFollowups.0': { $exists: true } } },
            { $unwind: '$inactiveFollowups' },
            { $project: { _id: 1, assetNumber: 1, customerName: 1, branch: 1, followup: '$inactiveFollowups' } }
        ]);

        const data = reports.map(r => ({
            'Asset Number': r.assetNumber,
            'Customer Name': r.customerName,
            'Branch': r.branch,
            'Followup Date': r.followup.followUpDate ? new Date(r.followup.followUpDate).toLocaleDateString() : '',
            'Remarks': r.followup.remarks || '',
            'PO Status': r.followup.poStatus || ''
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Followups');
        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="engine_followups.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const previewFollowup = async (req, res) => {
    try {
        const { id } = req.params;
        const reports = await Engine.aggregate([
            { $match: { 'inactiveFollowups._id': new mongoose.Types.ObjectId(id) } },
            { $unwind: '$inactiveFollowups' },
            { $match: { 'inactiveFollowups._id': new mongoose.Types.ObjectId(id) } },
            { $project: { _id: 1, assetNumber: 1, customerName: 1, branch: 1, followup: '$inactiveFollowups' } }
        ]);
        if (!reports || reports.length === 0) return res.status(404).json({ message: 'Followup not found' });
        res.json({ followup: reports[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteFollowup = async (req, res) => {
    try {
        const { id } = req.params;
        await Engine.findOneAndUpdate(
            { 'inactiveFollowups._id': id },
            { $pull: { inactiveFollowups: { _id: id } } }
        );
        res.json({ message: 'Followup deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEngines,
    getAllEngines,
    getEngineByAssetNumber,
    createEngine,
    updateEngine,
    deleteEngine,
    bulkDeleteEngines,
    exportEngines,
    importEngines,
    downloadEngineTemplate,
    getEngineStats,
    addInactiveFollowup,
    getFollowupReports,
    exportFollowupReports,
    previewFollowup,
    deleteFollowup
};
