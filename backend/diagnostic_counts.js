const mongoose = require('mongoose');
const Asset = require('./models/assetModel');
const dotenv = require('dotenv');
const path = require('path');

// When running from backend/ directory
dotenv.config();

const runDiagnostic = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const total = await Asset.countDocuments({});
        const active = await Asset.countDocuments({ status: 'Active' });
        const inactive = await Asset.countDocuments({ status: 'Inactive' });

        console.log(`\n--- ASSET DIAGNOSTIC ---`);
        console.log(`Total Assets: ${total}`);
        console.log(`Active Assets: ${active}`);
        console.log(`Inactive Assets: ${inactive}`);
        console.log(`Others (if any): ${total - active - inactive}`);

        const duplicates = await Asset.aggregate([
            { $group: { _id: "$assetNumber", count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } }
        ]);

        if (duplicates.length > 0) {
            console.log(`\nDuplicate Asset Numbers found: ${duplicates.length}`);
            console.log(duplicates.slice(0, 5));
        } else {
            console.log(`\nNo duplicate Asset Numbers found.`);
        }

        process.exit(0);
    } catch (err) {
        console.error('Diagnostic error:', err);
        process.exit(1);
    }
};

runDiagnostic();
