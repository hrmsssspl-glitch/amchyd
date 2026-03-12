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

function normalizeRow(row) {
    const normalizedRow = {};
    Object.keys(headerMap).forEach(key => {
        const possibleHeaders = headerMap[key];
        const foundHeader = Object.keys(row).find(h =>
            possibleHeaders.some(ph => ph.toLowerCase().replace(/\s+/g, '') === h.toLowerCase().replace(/\s+/g, '')) ||
            h.toLowerCase() === key.toLowerCase()
        );
        if (foundHeader) normalizedRow[key] = row[foundHeader];
        else if (row[key] !== undefined) normalizedRow[key] = row[key];
    });
    Object.keys(row).forEach(h => { if (!normalizedRow[h]) normalizedRow[h] = row[h]; });
    return normalizedRow;
}

function calculateAssetFieldsMock(data) {
    const fields = { ...data };
    const validBranches = ['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL'];
    if (fields.branch) {
        const normalizedBranch = String(fields.branch).toUpperCase().trim();
        if (validBranches.includes(normalizedBranch)) fields.branch = normalizedBranch;
    }
    if (fields.poType) {
        const poTypeLower = String(fields.poType).toLowerCase().trim();
        if (poTypeLower === 'new') fields.poType = 'New';
        else if (poTypeLower === 'renewal') fields.poType = 'Renewal';
    }
    if (fields.typeOfVisits) {
        const vtLower = String(fields.typeOfVisits).toLowerCase().replace(/\s+/g, '').trim();
        const vtMap = { 'monthly': 'Monthly', 'bymonthly': 'By Monthly', 'quarterly': 'Quarterly', 'halfyearly': 'Half Yearly' };
        if (vtMap[vtLower]) fields.typeOfVisits = vtMap[vtLower];
    }
    const dates = ['contractStartDate', 'contractEndDate'];
    dates.forEach(f => {
        if (fields[f]) {
            let d = new Date(fields[f]);
            if (typeof fields[f] === 'number') d = new Date((fields[f] - 25569) * 86400 * 1000);
            fields[f] = d.toISOString();
        }
    });
    return fields;
}

const testRows = [
    { 'Asset Number': '  ASSET-101  ', 'Customer Name': 'Test Corp', 'Model': 'X1', 'poType': 'RENEWAL', 'branch': 'uppal' },
    { 'assetNumber': 12345, 'customerName': 'Numeric Corp', 'contractStartDate': 45846, 'contractEndDate': 46211 },
    { 'Asset#': 'ASSET-103', 'Client Name': 'Third Corp', 'Asset Model': 'Y2', 'typeOfVisits': 'half yearly' }
];

console.log('Testing Enhanced Normalization:');
testRows.forEach((row, i) => {
    const norm = normalizeRow(row);
    const final = calculateAssetFieldsMock(norm);
    console.log(`Row ${i + 1} Final:`, JSON.stringify(final, null, 2));
});
