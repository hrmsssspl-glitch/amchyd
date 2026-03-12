const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        const db = mongoose.connection.db;
        const count = await db.collection('engines').countDocuments();
        console.log(`Engines in 'engines' collection: ${count}`);
        if (count > 0) {
            const sample = await db.collection('engines').findOne();
            console.log('Sample Engine:', JSON.stringify(sample).substring(0, 200));
        }
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
}
diag();
