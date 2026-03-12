const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log(`Found ${collections.length} collections:`);

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count}`);
            if (count > 0 && col.name === 'employees') {
                const sample = await db.collection(col.name).findOne();
                console.log(`  Sample from ${col.name}:`, JSON.stringify(sample).substring(0, 200));
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
diag();
