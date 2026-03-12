const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`${col.name}: ${count}`);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
diag();
