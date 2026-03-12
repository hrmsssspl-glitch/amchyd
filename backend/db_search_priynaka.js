const mongoose = require('mongoose');

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        console.log('Connected to DB sspl-admin');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments({
                $or: [
                    { employeeId: "100002" },
                    { employeeName: /priynaka/i },
                    { fullName: /priynaka/i },
                    { "personal.fullName": /priynaka/i }
                ]
            });
            if (count > 0) {
                console.log(`Found priynaka in collection: ${col.name} (Count: ${count})`);
                const doc = await db.collection(col.name).findOne({
                    $or: [
                        { employeeId: "100002" },
                        { employeeName: /priynaka/i },
                        { fullName: /priynaka/i },
                        { "personal.fullName": /priynaka/i }
                    ]
                });
                console.log('Sample Document Keys:', Object.keys(doc));
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
diag();
