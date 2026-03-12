const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },

    // Metadata
    createdDate: { type: Date, default: Date.now },
    createdBy: { type: String, default: 'System' },
    status: { type: String, default: 'Active' }, // Active, Inactive, Terminated, etc.

    // 1. Personal Details
    personal: {
        title: { type: String }, // Mr., Ms., Mrs.
        fullName: { type: String, required: true },
        gender: { type: String },
        dob: { type: Date },
        bloodGroup: { type: String },
        maritalStatus: { type: String },
        nationality: { type: String, default: 'Indian' }
    },

    // 2. Address & Contact
    address: {
        presentAddress: { type: String },
        permanentAddress: { type: String },
        mobileNumber: { type: String, required: true },
        personalEmail: { type: String, required: true }, // unique?
        emergencyContactName: { type: String },
        emergencyContactRelation: { type: String },
        emergencyContactNumber: { type: String }
    },

    // 3. Identity & KYC
    kyc: {
        aadhaarNumber: { type: String },
        panNumber: { type: String },
        uanNumber: { type: String },
        esicNumber: { type: String },
        bankAccountName: { type: String },
        bankAccountNumber: { type: String },
        bankIFSC: { type: String }
    },

    // 4. Employment Details
    employment: {
        dateOfJoining: { type: Date },
        employmentType: { type: String }, // Permanent, Contract, etc.
        rolls: { type: String }, // On Roll, Off roll, etc.
        department: { type: String },
        designation: { type: String },
        grade: { type: String }, // L1, L2, etc.
        state: { type: String },
        branchCode: { type: String },
        reportingManager: { type: String },
        workLocation: { type: String },
        shiftType: { type: String }
    },

    // 5. Documents (URLs or paths)
    documents: {
        photo: { type: String },
        aadhaarCard: { type: String },
        panCard: { type: String },
        resume: { type: String },
        bioData: { type: String },
        familyPhoto: { type: String },
        educationCertificates: [{ type: String }],
        technicalCertificates: [{ type: String }],
        bankStatement: { type: String }
    },

    // 6. Cummins Training
    training: {
        cumminsTrainingType: { type: String }, // e.g., TECH-01
        trainingCompletedDate: { type: Date }
    }

}, { timestamps: true });

module.exports = mongoose.model('HrmsEmployee', employeeSchema);
