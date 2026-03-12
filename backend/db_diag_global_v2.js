const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/');
        console.log('Connected to MongoDB');

        const admin = mongoose.connection.useDb('admin').admin();
        const dbs = await admin.listDatabases();

        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (dbName === 'local' || dbName === 'config') continue;

            console.log(`Database: ${dbName}`);
            const conn = mongoose.connection.useDb(dbName);
            const collections = await conn.db.listCollections().toArray();
            for (const col of collections) {
                const count = await conn.db.collection(col.name).countDocuments();
                if (count > 0) {
                    console.log(`  - ${col.name}: ${count}`);
                    if (col.name.includes('emp')) {
                        const sample = await conn.db.collection(col.name).findOne();
                        console.log(`    Sample: ${JSON.stringify(sample).substring(0, 100)}`);
                    }
                }
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
diag();
