const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const docs = await db.collection('employees').find({}).toArray();
        console.log(`Total documents in 'employees': ${docs.length}`);

        if (docs.length > 0) {
            console.log('First 5 documents:');
            docs.slice(0, 5).forEach((d, i) => {
                console.log(`${i + 1}: ${JSON.stringify(d).substring(0, 300)}`);
            });
        } else {
            // Check other collections that might contain employees
            const collections = await db.listCollections().toArray();
            console.log('Other collections:');
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                if (col.name.includes('emp')) {
                    console.log(`- ${col.name}: ${count}`);
                    if (count > 0) {
                        const sample = await db.collection(col.name).findOne();
                        console.log(`  Sample: ${JSON.stringify(sample).substring(0, 200)}`);
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
