const { MongoClient } = require('mongodb');

async function search() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    try {
        await client.connect();
        const admin = client.db().admin();
        const dbs = await admin.listDatabases();

        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            if (['local', 'config', 'admin'].includes(dbName)) continue;

            const db = client.db(dbName);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const doc = await db.collection(col.name).findOne({
                    $or: [
                        { employeeId: "100002" },
                        { employeeId: 100002 },
                        { employeeName: /priynaka/i },
                        { fullName: /priynaka/i }
                    ]
                });
                if (doc) {
                    console.log(`FOUND! DB: ${dbName}, Collection: ${col.name}`);
                    console.log('Document:', JSON.stringify(doc));
                }
            }
        }
        console.log('Global search finished.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}
search();
