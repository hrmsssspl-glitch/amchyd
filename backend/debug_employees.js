const mongoose = require('mongoose');
const Employee = require('./models/employeeModel');

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        console.log('Connected to DB');

        const total = await Employee.countDocuments();
        console.log(`Total records in Employee model: ${total}`);

        if (total > 0) {
            const firstTen = await Employee.find().limit(10);
            console.log('First 10 records:');
            firstTen.forEach(e => {
                console.log(`- ID: "${e.employeeId}", Name: "${e.employeeName}", CreatedAt: ${e.createdAt}`);
            });

            // Test the exact query used in getEmployees
            const sampleId = firstTen[0].employeeId;
            const testQuery = {
                $or: [
                    { employeeId: { $regex: sampleId, $options: 'i' } }
                ]
            };
            const found = await Employee.findOne(testQuery);
            console.log(`Regex search for "${sampleId}": ${found ? 'Found' : 'NOT Found'}`);
        } else {
            // If zero, check the raw collection 'employees' one last time
            const rawDocs = await mongoose.connection.db.collection('employees').find().toArray();
            console.log(`Raw 'employees' collection count: ${rawDocs.length}`);
            if (rawDocs.length > 0) {
                console.log('Raw Sample ID:', rawDocs[0].employeeId);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
debug();
