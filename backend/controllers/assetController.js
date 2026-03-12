const Asset = require('../models/assetModel');
const Engine = require('../models/engineModel');
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
const buildAssetQuery = (filters) => {
    const {
        keyword, assetNumber, kva, engineHpRange, branch,
        coordinator, customerName, status, purchaseOrderNo,
        contractMonthsPending, billingMonth, poMonth,
        engineerName, advisor, contractStartDateFrom, contractEndDateTo
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
    if (coordinator) query.coordinator = { $regex: coordinator, $options: 'i' };
    if (engineerName) query.engineerName = { $regex: engineerName, $options: 'i' };
    if (customerName) query.customerName = { $regex: customerName, $options: 'i' };
    if (advisor) query.advisor = { $regex: advisor, $options: 'i' };
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

// @desc    Get all assets (paginated with advanced filters)
// @route   GET /api/assets
const getAssets = async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 25; // Dynamic page size
    const page = Number(req.query.pageNumber) || 1;

    let query = buildAssetQuery(req.query);
    // Apply branch filter for non-admin users based on their assigned branches
    if (req.user && req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        if (Array.isArray(req.user.assignedBranches) && req.user.assignedBranches.length > 0) {
            query.branch = { $in: req.user.assignedBranches };
        }
    }
    console.log('GET Assets - Query:', JSON.stringify(query));
    console.log('GET Assets - DB Connection State:', mongoose.connection.readyState);
    console.log('GET Assets - DB Name:', mongoose.connection.name);
    console.log('GET Assets - Collection Name:', Asset.collection.name);

    try {
        const count = await Asset.countDocuments(query);
        let assets = await Asset.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        // Dynamically calculate fields for the response to ensure consistency
        assets = assets.map(asset => {
            const assetObj = asset.toObject();
            const calculated = calculateAssetFields(assetObj);
            return { ...assetObj, ...calculated };
        });

        res.json({ assets, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an asset
// @route   POST /api/assets
const createAsset = async (req, res) => {
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
            // Merge existing data with updates to satisfy calculateAssetFields requirements
            // Also ensure we don't try to overwrite the _id
            const { _id, ...updateData } = req.body;
            const updatedData = calculateAssetFields({ ...asset.toObject(), ...updateData });
            Object.assign(asset, updatedData);
            const savedAsset = await asset.save();
            res.json(savedAsset);
        } else {
            res.status(404).json({ message: 'Asset not found' });
        }
    } catch (error) {
        console.error('Update Asset Error Details:', {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({ message: error.message });
    }
};

// Helper for calculations and validation
const calculateAssetFields = (data) => {
    const fields = { ...data };

    // 1. Normalize Branch (Case-insensitive)
    const validBranches = ['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL'];
    if (fields.branch) {
        const normalizedBranch = String(fields.branch).toUpperCase().trim();
        if (validBranches.includes(normalizedBranch)) {
            fields.branch = normalizedBranch;
        }
    }

    // 2. Normalize PO Type (Case-insensitive)
    if (fields.poType) {
        const poTypeLower = String(fields.poType).toLowerCase().trim();
        if (poTypeLower === 'new') fields.poType = 'New';
        else if (poTypeLower === 'renewal') fields.poType = 'Renewal';
    }

    // 3. Normalize Visit Type (Case-insensitive)
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

    // 4. Validate Critical Dates
    const dateFieldsToValidate = [
        { name: 'contractStartDate', label: 'Contract Start Date' },
        { name: 'contractEndDate', label: 'Contract End Date' }
    ];

    for (const field of dateFieldsToValidate) {
        if (!fields[field.name]) {
            throw new Error(`${field.label} is required`);
        }
        let d = new Date(fields[field.name]);

        // Handle Excel numeric date serials if they somehow slip through as numbers
        if (typeof fields[field.name] === 'number') {
            // Excel serial to JS date: (serial - 25569) * 86400 * 1000
            d = new Date((fields[field.name] - 25569) * 86400 * 1000);
        }

        if (isNaN(d.getTime())) {
            throw new Error(`Invalid ${field.label}: "${fields[field.name]}"`);
        }
        fields[field.name] = d; // Store as actual Date object
    }

    // Normalize other date fields to null if they are empty strings to prevent Mongoose cast errors
    const otherDates = [
        'scheduleDate', 'sonDate', 'actualVisitDate', 'purchaseOrderDate', 'quoteDate',
        'actualPoReceivedDate', 'q1Date', 'q2Date', 'q3Date', 'q4Date', 'q1InvoiceDate',
        'q2InvoiceDate', 'q3InvoiceDate', 'q4InvoiceDate', 'q1PaymentReceivedDate',
        'q2PaymentReceivedDate', 'q3PaymentReceivedDate', 'q4PaymentReceivedDate',
        'breakdownVisitDate'
    ];
    otherDates.forEach(key => {
        if (fields[key] === '') {
            fields[key] = null;
        } else if (fields[key] && typeof fields[key] === 'string') {
            const d = new Date(fields[key]);
            if (!isNaN(d.getTime())) {
                fields[key] = d;
            }
        }
    });

    try {
        // 5. GST & Total
        const basic = Number(fields.basicAmount) || 0;
        fields.basicAmount = basic;
        fields.gstAmount = Number((basic * 0.18).toFixed(2));
        fields.totalAmount = Number((basic + fields.gstAmount).toFixed(2));

        // 6. Contract Period & Months Pending
        const start = new Date(fields.contractStartDate);
        const end = new Date(fields.contractEndDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalMonths = calculateMonths(start, end);
        fields.contractPeriod = `${totalMonths} Months`;

        const pendingMonths = calculateMonths(today, end);
        fields.contractMonthsPending = pendingMonths > 0 ? pendingMonths : 0;

        // 7. Auto-calculate Status
        const compareEnd = new Date(end);
        compareEnd.setHours(0, 0, 0, 0);
        const compareToday = new Date();
        compareToday.setHours(0, 0, 0, 0);
        fields.status = compareEnd < compareToday ? 'Inactive' : 'Active';

        // 8. Ensure all numeric fields are Numbers
        ['q1Amount', 'q2Amount', 'q3Amount', 'q4Amount', 'noOfVisits', 'lastYearPriceBasic', 'amountHike', 'hikePercentage'].forEach(key => {
            if (fields[key] !== undefined && fields[key] !== '') {
                fields[key] = Number(fields[key]) || 0;
            }
        });

        // Price Hike Calculations
        if (fields.lastYearPriceBasic > 0) {
            fields.amountHike = Number((fields.basicAmount - fields.lastYearPriceBasic).toFixed(2));
            fields.hikePercentage = Number(((fields.amountHike / fields.lastYearPriceBasic) * 100).toFixed(2));
        }

    } catch (err) {
        console.error('Calculation Error in calculateAssetFields:', err.message, err.stack);
        throw new Error('Error calculating asset fields: ' + err.message);
    }

    return fields;
};

// @desc    Delete multiple assets
// @route   DELETE /api/assets/bulk-delete
const bulkDeleteAssets = async (req, res) => {
    const { ids, filters } = req.body;
    console.log('Bulk Delete Request - IDs:', ids?.length, 'Filters:', filters);

    try {
        let query = {};
        if (ids && Array.isArray(ids) && ids.length > 0) {
            query = { _id: { $in: ids } };
        } else if (filters) {
            query = buildAssetQuery(filters);
        } else {
            return res.status(400).json({ message: 'No asset IDs or filters provided' });
        }

        console.log('Final Delete Query:', JSON.stringify(query));
        const result = await Asset.deleteMany(query);
        console.log('Deleted Count:', result.deletedCount);
        res.json({ message: `${result.deletedCount} assets removed successfully` });
    } catch (error) {
        console.error('Bulk Delete Error:', error);
        res.status(500).json({ message: error.message });
    }
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
        const workbook = XLSX.read(req.files.file.data, { type: 'buffer', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const rawResults = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

        if (rawResults.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty' });
        }

        console.log(`Starting import for ${rawResults.length} rows...`);

        // Header Mapping logic
        const headerMap = {
            'assetNumber': ['Asset Number', 'Asset No', 'Asset#', 'Asset ID', 'Asset No.'],
            'model': ['Model', 'Asset Model', 'Model Name'],
            'branch': ['Branch', 'Location'],
            'customerName': ['Customer Name', 'Customer', 'Client', 'Client Name'],
            'contractStartDate': ['Contract Start Date', 'Start Date', 'Contract Start'],
            'contractEndDate': ['Contract End Date', 'End Date', 'Contract End'],
            'basicAmount': ['Basic Amount', 'Basic', 'Amount (Basic)', 'AMC Amount'],
            'kva': ['KVA', 'Capacity'],
            'engineHpRange': ['Engine HP Range', 'HP Range', 'HP'],
            'coordinator': ['Coordinator', 'AMC Coordinator'],
            'engineerName': ['Engineer Name', 'Engineer', 'Assigned Engineer'],
            'engineerContact': ['Engineer Contact', 'Engineer Phone'],
            'advisor': ['Advisor', 'Technical Advisor'],
            'purchaseOrderNo': ['PO Number', 'PO NO', 'Purchase Order No', 'Order Number'],
            'purchaseOrderDate': ['PO Date', 'Purchase Order Date']
        };

        const results = rawResults.map(row => {
            const normalizedRow = {};
            // Map known headers
            Object.keys(headerMap).forEach(key => {
                const possibleHeaders = headerMap[key];
                // Check if any of the possible headers exist in the row
                const foundHeader = Object.keys(row).find(h =>
                    possibleHeaders.some(ph => ph.toLowerCase().replace(/\s+/g, '') === h.toLowerCase().replace(/\s+/g, '')) ||
                    h.toLowerCase() === key.toLowerCase()
                );

                if (foundHeader) {
                    normalizedRow[key] = row[foundHeader];
                } else if (row[key] !== undefined) {
                    normalizedRow[key] = row[key];
                }
            });
            // Keep other fields too
            Object.keys(row).forEach(h => {
                if (!normalizedRow[h]) normalizedRow[h] = row[h];
            });
            return normalizedRow;
        });

        console.log(`Starting import for ${results.length} rows...`);

        const validAssets = [];
        const errors = [];
        const seenInFile = new Set();
        let fileDuplicates = 0;
        let skippedEmpty = 0;

        for (let i = 0; i < results.length; i++) {
            const row = results[i];

            // Skip completely empty rows
            if (!row.assetNumber && !row.customerName && !row.model) {
                skippedEmpty++;
                continue;
            }

            try {
                if (!row.assetNumber && row.assetNumber !== 0) {
                    throw new Error('Asset Number is missing (Check your Excel headers)');
                }

                const assetNo = String(row.assetNumber).trim();
                if (!assetNo) {
                    throw new Error('Asset Number is empty');
                }
                if (seenInFile.has(assetNo)) {
                    fileDuplicates++;
                    continue;
                }
                seenInFile.add(assetNo);

                // Apply calculations and validation
                const validatedData = calculateAssetFields(row);
                validAssets.push(validatedData);
            } catch (err) {
                errors.push(`Row ${i + 2} (${row.assetNumber || 'No Asset #'}): ${err.message}`);
            }
        }

        let dbDuplicates = 0;
        let createdCount = 0;
        const finalToImport = [];

        if (validAssets.length > 0) {
            const assetNumbers = validAssets.map(a => a.assetNumber);

            // Check cross-collection duplicates (Asset & Engine)
            const [existingAssets, existingEngines] = await Promise.all([
                Asset.find({ assetNumber: { $in: assetNumbers } }, 'assetNumber'),
                Engine.find({ assetNumber: { $in: assetNumbers } }, 'assetNumber')
            ]);

            const existingNos = new Set([
                ...existingAssets.map(a => String(a.assetNumber).trim()),
                ...existingEngines.map(e => String(e.assetNumber).trim())
            ]);

            for (const asset of validAssets) {
                if (!existingNos.has(String(asset.assetNumber).trim())) {
                    finalToImport.push(asset);
                } else {
                    dbDuplicates++;
                }
            }

            if (finalToImport.length > 0) {
                try {
                    const inserted = await Asset.insertMany(finalToImport, { ordered: false });
                    console.log(`Successfully persisted ${inserted.length} assets to DB: ${mongoose.connection.name}`);
                    createdCount = inserted.length;
                } catch (bulkErr) {
                    console.error('Bulk Insert Error:', bulkErr);
                    // If some succeeded despite error (shouldn't happen with ordered: false mostly, but just in case)
                    createdCount = bulkErr.insertedDocs ? bulkErr.insertedDocs.length : 0;
                    if (bulkErr.writeErrors) {
                        errors.push(`Database Error: Some records could not be saved. Check unique constraints.`);
                    }
                }
            }
        }

        res.status(201).json({
            message: 'Import process completed',
            summary: {
                totalRows: rawResults.length,
                successfullyImported: createdCount,
                validationErrors: errors.length,
                duplicateInFile: fileDuplicates,
                alreadyInDatabase: dbDuplicates,
                skippedEmpty: skippedEmpty
            },
            errors: errors.slice(0, 20), // Return first 20 errors
            totalErrors: errors.length
        });
    } catch (error) {
        console.error('Import Error:', error);
        res.status(500).json({ message: 'Server error during import: ' + error.message });
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
            poType: 'New',
            purchaseOrderNo: 'PO/123/24-25',
            purchaseOrderDate: '2023-01-01',
            noOfVisits: 4,
            advisor: 'Advisor Name',
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

// @desc    Get asset statistics summary
// @route   GET /api/assets/stats
const getAssetStats = async (req, res) => {
    try {
        const total = await Asset.countDocuments();

        const branchStats = await Asset.aggregate([
            { $group: { _id: '$branch', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const hpRangeStats = await Asset.aggregate([
            { $group: { _id: '$engineHpRange', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const visitFreqStats = await Asset.aggregate([
            { $group: { _id: '$typeOfVisits', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const statusStats = {
            active: await Asset.countDocuments({ contractEndDate: { $gte: today } }),
            inactive: await Asset.countDocuments({ contractEndDate: { $lt: today } })
        };

        const financialStats = await Asset.aggregate([
            {
                $group: {
                    _id: null,
                    totalBasicAmount: { $sum: "$basicAmount" },
                    totalQ1Amount: { $sum: "$q1Amount" },
                    totalQ2Amount: { $sum: "$q2Amount" },
                    totalQ3Amount: { $sum: "$q3Amount" },
                    totalQ4Amount: { $sum: "$q4Amount" },
                    totalInvoicedQ1: { $sum: { $cond: [{ $eq: ["$q1PaymentStatus", "Yes"] }, "$q1Amount", 0] } },
                    totalInvoicedQ2: { $sum: { $cond: [{ $eq: ["$q2PaymentStatus", "Yes"] }, "$q2Amount", 0] } },
                    totalInvoicedQ3: { $sum: { $cond: [{ $eq: ["$q3PaymentStatus", "Yes"] }, "$q3Amount", 0] } },
                    totalInvoicedQ4: { $sum: { $cond: [{ $eq: ["$q4PaymentStatus", "Yes"] }, "$q4Amount", 0] } }
                }
            }
        ]);

        let financials = {
            totalBasicAmount: 0,
            totalProjection: 0,
            totalInvoiced: 0,
            totalPending: 0
        };

        if (financialStats.length > 0) {
            const f = financialStats[0];
            financials.totalBasicAmount = f.totalBasicAmount || 0;
            financials.totalProjection = (f.totalQ1Amount || 0) + (f.totalQ2Amount || 0) + (f.totalQ3Amount || 0) + (f.totalQ4Amount || 0);
            financials.totalInvoiced = (f.totalInvoicedQ1 || 0) + (f.totalInvoicedQ2 || 0) + (f.totalInvoicedQ3 || 0) + (f.totalInvoicedQ4 || 0);
            financials.totalPending = financials.totalProjection - financials.totalInvoiced;
        }

        res.json({
            total,
            branches: branchStats.map(b => ({ name: b._id || 'Unknown', count: b.count })),
            hpRanges: hpRangeStats.map(h => ({ range: h._id || 'Unknown', count: h.count })),
            frequencies: visitFreqStats.map(v => ({ type: v._id || 'Not Assigned', count: v.count })),
            status: statusStats,
            financials
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add an inactive followup record to an asset
// @route   POST /api/assets/:id/followups
const addInactiveFollowup = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            employeeId, employeeName, empContactNumber,
            followUpDate, customerContactedName, customerContactNumber,
            customerContactEmail, remarks, poStatus
        } = req.body;

        const asset = await Asset.findById(id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        const newFollowup = {
            employeeId,
            employeeName,
            empContactNumber,
            followUpDate: followUpDate ? new Date(followUpDate) : new Date(),
            customerContactedName,
            customerContactNumber,
            customerContactEmail,
            remarks,
            poStatus
        };

        asset.inactiveFollowups = asset.inactiveFollowups || [];
        asset.inactiveFollowups.push(newFollowup);

        if (poStatus === 'PO Received') {
            asset.status = 'Active';
        }

        const updatedAsset = await asset.save();
        res.status(201).json(updatedAsset);
    } catch (error) {
        console.error('Error adding inactive followup:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Inactive Followup Reports (day-wise, employee-based)
// @route   GET /api/assets/followups/reports
const getFollowupReports = async (req, res) => {
    try {
        const { employeeId, fromDate, toDate, assetSearch } = req.query;

        const pipeline = [
            { $match: { 'inactiveFollowups.0': { $exists: true } } },
            { $unwind: '$inactiveFollowups' }
        ];

        const followupMatch = {};

        // Non-admins can only see their own follow-ups
        if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
            followupMatch['inactiveFollowups.employeeId'] = req.user.employeeId;
        } else if (employeeId && employeeId.trim() !== '') {
            followupMatch['inactiveFollowups.employeeId'] = { $regex: employeeId, $options: 'i' };
        }
        // Asset search filter for admin view
        if (assetSearch && assetSearch.trim() !== '') {
            const assetRegex = { $regex: assetSearch, $options: 'i' };
            // Match either assetNumber or asset _id (as string)
            followupMatch['$or'] = [{ assetNumber: assetRegex }, { _id: assetRegex }];
        }



        if (fromDate || toDate) {
            followupMatch['inactiveFollowups.followUpDate'] = {};
            if (fromDate) followupMatch['inactiveFollowups.followUpDate'].$gte = new Date(fromDate);
            if (toDate) {
                const endOfDay = new Date(toDate);
                endOfDay.setHours(23, 59, 59, 999);
                followupMatch['inactiveFollowups.followUpDate'].$lte = endOfDay;
            }
        }

        if (Object.keys(followupMatch).length > 0) {
            pipeline.push({ $match: followupMatch });
        }

        pipeline.push({ $sort: { 'inactiveFollowups.followUpDate': -1, 'inactiveFollowups.createdAt': -1 } });

        pipeline.push({
            $project: {
                _id: 1,
                assetNumber: 1,
                customerName: 1,
                branch: 1,
                followup: '$inactiveFollowups'
            }
        });

        const reports = await Asset.aggregate(pipeline);
        res.json(reports);
    } catch (error) {
        console.error('Get Followup Reports Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export Inactive Followup Reports to Excel
// @route   GET /api/assets/followups/export
const exportFollowupReports = async (req, res) => {
    try {
        const { employeeId, fromDate, toDate, assetSearch } = req.query;

        const pipeline = [
            { $match: { 'inactiveFollowups.0': { $exists: true } } },
            { $unwind: '$inactiveFollowups' }
        ];

        const followupMatch = {};

        // Non-admins can only see their own follow-ups
        if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
            followupMatch['inactiveFollowups.employeeId'] = req.user.employeeId;
        } else if (employeeId && employeeId.trim() !== '') {
            followupMatch['inactiveFollowups.employeeId'] = { $regex: employeeId, $options: 'i' };
        }

        // Asset search filter for admin view
        if (assetSearch && assetSearch.trim() !== '') {
            const assetRegex = { $regex: assetSearch, $options: 'i' };
            followupMatch['$or'] = [{ assetNumber: assetRegex }, { _id: assetRegex }];
        }

        if (fromDate || toDate) {
            followupMatch['inactiveFollowups.followUpDate'] = {};
            if (fromDate) followupMatch['inactiveFollowups.followUpDate'].$gte = new Date(fromDate);
            if (toDate) {
                const endOfDay = new Date(toDate);
                endOfDay.setHours(23, 59, 59, 999);
                followupMatch['inactiveFollowups.followUpDate'].$lte = endOfDay;
            }
        }

        if (Object.keys(followupMatch).length > 0) {
            pipeline.push({ $match: followupMatch });
        }

        pipeline.push({ $sort: { 'inactiveFollowups.followUpDate': -1, 'inactiveFollowups.createdAt': -1 } });

        pipeline.push({
            $project: {
                _id: 1,
                assetNumber: 1,
                customerName: 1,
                branch: 1,
                followup: '$inactiveFollowups'
            }
        });

        const reports = await Asset.aggregate(pipeline);

        const data = reports.map(r => ({
            'Asset Number': r.assetNumber,
            'Customer Name': r.customerName,
            'Branch': r.branch,
            'Employee ID': r.followup.employeeId || '',
            'Employee Name': r.followup.employeeName || '',
            'Followup Date': r.followup.followUpDate ? new Date(r.followup.followUpDate).toLocaleDateString() : '',
            'Customer Contacted': r.followup.customerContactedName || '',
            'Contact Number': r.followup.customerContactNumber || '',
            'Contact Email': r.followup.customerContactEmail || '',
            'Remarks': r.followup.remarks || '',
            'PO Status': r.followup.poStatus || ''
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inactive Followups');

        const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Disposition', 'attachment; filename="inactive_followups.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buf);
    } catch (error) {
        console.error('Export Followup Reports Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Preview a single followup
// @route   GET /api/assets/followups/:id/preview
const previewFollowup = async (req, res) => {
    try {
        const { id } = req.params;

        const pipeline = [
            { $match: { 'inactiveFollowups._id': new mongoose.Types.ObjectId(id) } },
            { $unwind: '$inactiveFollowups' },
            { $match: { 'inactiveFollowups._id': new mongoose.Types.ObjectId(id) } },
            {
                $project: {
                    _id: 1,
                    assetNumber: 1,
                    customerName: 1,
                    branch: 1,
                    followup: '$inactiveFollowups'
                }
            }
        ];

        const reports = await Asset.aggregate(pipeline);

        if (!reports || reports.length === 0) {
            return res.status(404).json({ message: 'Followup not found' });
        }

        res.json({ followup: reports[0] });
    } catch (error) {
        console.error('Preview Followup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a followup
// @route   DELETE /api/assets/followups/:id
const deleteFollowup = async (req, res) => {
    try {
        const { id } = req.params;

        // Find asset containing this followup and remove it
        const asset = await Asset.findOneAndUpdate(
            { 'inactiveFollowups._id': id },
            { $pull: { inactiveFollowups: { _id: id } } },
            { new: true }
        );

        if (!asset) {
            return res.status(404).json({ message: 'Followup not found or already deleted' });
        }

        res.json({ message: 'Followup deleted successfully' });
    } catch (error) {
        console.error('Delete Followup Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    bulkDeleteAssets,
    exportAssets,
    importAssets,
    downloadAssetTemplate,
    getAssetStats,
    addInactiveFollowup,
    getFollowupReports,
    exportFollowupReports,
    previewFollowup,
    deleteFollowup
};
