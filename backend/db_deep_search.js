const { MongoClient } = require('mongodb');

async function diag() {
    const url = 'mongodb://localhost:27017/sspl-admin';
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db('sspl-admin');
        const collections = await db.listCollections().toArray();

        for (const col of collections) {
            const name = col.name;
            const docs = await db.collection(name).find({}).toArray();
            for (const doc of docs) {
                const s = JSON.stringify(doc);
                if (s.toLowerCase().includes('priynaka')) {
                    console.log(`FOUND in collection: ${name}`);
                    console.log(`Document: ${s.substring(0, 500)}`);
                    process.exit(0);
                }
            }
        }
        console.log('Priynaka not found in sspl-admin');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}
diag();
