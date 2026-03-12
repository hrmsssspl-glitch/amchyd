const { MongoClient } = require('mongodb');

async function check() {
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db('sspl-admin');
        const collection = db.collection('employees');

        const count = await collection.countDocuments();
        console.log('Raw count in sspl-admin.employees:', count);

        const doc = await collection.findOne({ employeeId: "100002" });
        console.log('Search for 100002:', doc ? 'FOUND' : 'NOT FOUND');
        if (doc) console.log('Doc:', JSON.stringify(doc));

        const any = await collection.findOne({});
        console.log('Any doc in employees:', any ? 'FOUND' : 'NOT FOUND');

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}
check();
