const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/');
        console.log('Connected to MongoDB server');

        const admin = mongoose.connection.useDb('admin').admin();
        const dbs = await admin.listDatabases();
        console.log('Databases on this server:');
        for (const dbInfo of dbs.databases) {
            console.log(`- ${dbInfo.name} (${dbInfo.sizeOnDisk} bytes)`);
            const conn = mongoose.connection.useDb(dbInfo.name);
            const collections = await conn.db.listCollections().toArray();
            for (const col of collections) {
                const count = await conn.db.collection(col.name).countDocuments();
                if (count > 0) {
                    console.log(`  * ${col.name}: ${count}`);
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
