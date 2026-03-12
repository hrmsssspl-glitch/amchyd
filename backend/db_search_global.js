const { MongoClient } = require('mongodb');

async function diag() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const admin = client.db().admin();
        const dbs = await admin.listDatabases();

        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (dbName === 'local' || dbName === 'config') continue;

            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments({
                    $or: [
                        { employeeName: /priynaka/i },
                        { fullName: /priynaka/i },
                        { "personal.fullName": /priynaka/i },
                        { employeeId: /100002/ }
                    ]
                });
                if (count > 0) {
                    console.log(`FOUND in DB: ${dbName}, Col: ${col.name}, Count: ${count}`);
                    const sample = await db.collection(col.name).findOne({
                        $or: [
                            { employeeName: /priynaka/i },
                            { fullName: /priynaka/i },
                            { "personal.fullName": /priynaka/i },
                            { employeeId: /100002/ }
                        ]
                    });
                    console.log('Sample Keys:', Object.keys(sample));
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}
diag();
