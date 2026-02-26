const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
    try {
        await User.deleteMany();

        const admin = await User.create({
            employeeId: 'SA001',
            employeeName: 'Super Admin',
            password: 'admin123',
            role: 'Super Admin',
        });

        console.log('Seed Data Created!');
        console.log('Super Admin User:');
        console.log('Employee ID: SA001');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
