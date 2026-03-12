const mongoose = require('mongoose');
const employeeModel = require('./models/employeeModel');
// Try to require the hrms model if it exists
let hrmsEmployee;
try {
    hrmsEmployee = require('./models/hrms/Employee');
} catch (e) { }

async function diag() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sspl-admin');
        console.log('Connected to DB');

        const count1 = await employeeModel.countDocuments();
        console.log(`Employees in 'Employee' (employeeModel): ${count1}`);
        if (count1 > 0) {
            const sample = await employeeModel.findOne();
            console.log('Sample from Employee:', JSON.stringify({ id: sample.employeeId, name: sample.employeeName, fullName: sample.fullName }));
        }

        if (hrmsEmployee) {
            const count2 = await hrmsEmployee.countDocuments();
            console.log(`Employees in 'HrmsEmployee' (hrms/Employee): ${count2}`);
            if (count2 > 0) {
                const sample = await hrmsEmployee.findOne();
                console.log('Sample from HrmsEmployee:', JSON.stringify({ id: sample.employeeId, personal: sample.personal }));
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}
diag();
