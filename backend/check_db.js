const mongoose = require('mongoose');
const Asset = require('./models/assetModel');

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        const count = await Asset.countDocuments();
        console.log(`Total Assets in DB: ${count}`);

        const latest = await Asset.find().sort({ createdAt: -1 }).limit(5);
        console.log('Latest 5 Assets:');
        latest.forEach(a => console.log(`- ${a.assetNumber}: ${a.customerName} (${a.createdAt})`));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
run();
