const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee Id is mandatory'],
            unique: true,
            trim: true,
        },
        employeeName: {
            type: String,
            required: [true, 'Employee Name is mandatory'],
            trim: true,
        },
        password: {
            type: String,
            required: function () {
                return ['Super Admin', 'Admin'].includes(this.role);
            },
        },
        role: {
            type: String,
            required: true,
            enum: [
                'Super Admin',
                'Admin',
                'HR Head',
                'Branch Manager',
                'Service Manager',
                'Advisor',
                'AMC Coordinator',
                'Service Engineer',
                'Accounts Manager',
                'Accounts executive',
                'Coordinator',
                'SPC',
                'Ashwasan Coordinator',
                'NEPI Coordinator',
                'Leads Coordinator',
                'HR Executive',
                'Operations Head',
                'Sales Execitive',
                'Sales Manager',
            ],
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
