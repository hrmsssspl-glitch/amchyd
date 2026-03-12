const mongoose = require('mongoose');
const Employee = require('./models/employeeModel');

async function test() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        console.log('Connected to DB');

        const testData = {
            employeeId: "100609",
            employeeName: "Test User",
            status: "Active", // Matches enum
            gender: "Male"    // Matches enum
        };

        try {
            const created = await Employee.create(testData);
            console.log('Successfully created test employee:', created.employeeId);
            await Employee.deleteOne({ _id: created._id });
        } catch (err) {
            console.error('Creation failed with error:', err.message);
            if (err.errors) {
                Object.keys(err.errors).forEach(key => {
                    console.error(`- Field "${key}": ${err.errors[key].message}`);
                });
            }
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
test();
