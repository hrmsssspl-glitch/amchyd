const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: [true, 'Employee ID is mandatory'],
            unique: true,
            trim: true,
        },
        employeeName: {
            type: String,
            required: [true, 'Employee Name is mandatory'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', ''],
            default: 'Active',
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', ''],
            default: '',
        },
        dateOfJoining: {
            type: Date,
        },
        designation: {
            type: String,
            trim: true,
            default: '',
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        aadharNo: {
            type: String,
            trim: true,
        },
        panNo: {
            type: String,
            trim: true,
        },
        surname: { type: String, trim: true },
        fatherName: { type: String, trim: true },
        motherName: { type: String, trim: true },
        nationality: { type: String, trim: true },
        religion: { type: String, trim: true },
        alternateContactNumber: { type: String, trim: true },
        personalMailId: { type: String, trim: true },
        officialMailId: { type: String, trim: true },
        reportingManager: { type: String, trim: true },
        employmentRole: {
            type: String,
            default: '',
        },
        presentAddress: { type: String, trim: true },
        permanentAddress: { type: String, trim: true },
        permanentAddressContact: { type: String, trim: true },
        dateOfBirth: { type: Date },
        drivingLicenseNo: { type: String, trim: true },
        maritalStatus: { type: String, trim: true },
        marriageDate: { type: Date },
        anyPhysicalDisabilities: { type: String, trim: true },
        bankName: { type: String, trim: true },
        bankAccountNo: { type: String, trim: true },
        bankBranch: { type: String, trim: true },
        ifscCode: { type: String, trim: true },
        qualifications: [
            {
                board: String,
                specialization: String,
                passingYear: String,
            },
        ],
        previousExperience: [
            {
                employerName: String,
                designation: String,
                periodFrom: Date,
                periodTo: Date,
                totalExperience: String,
                responsibilities: String,
                salary: String,
                referenceName: String,
                referenceMobile: String,
            },
        ],
        jobDescription: { type: String, trim: true },
        familyMembers: [
            {
                name: String,
                relationship: String,
                dob: Date,
                occupation: String,
            },
        ],
        emergencyContacts: [
            {
                contactPerson: String,
                relation: String,
                address: String,
                mobileNumber: String,
            },
        ],
        bloodGroup: { type: String, trim: true },
        allergic: { type: String, trim: true },
        bloodPressure: { type: String, trim: true },
        sugarLevel: { type: String, trim: true },
        eyeSight: { type: String, trim: true },
        majorIllness: { type: String, trim: true },
        languages: {
            telugu: { type: Boolean, default: false },
            english: { type: Boolean, default: false },
            hindi: { type: Boolean, default: false },
        },
        assignedBranches: { type: [String], default: [] },
        state: { type: String, trim: true },

        // Attachments
        bioDataPath: { type: String, trim: true },
        aadharUploadPath: { type: String, trim: true },
        panUploadPath: { type: String, trim: true },
        personalPhotoPath: { type: String, trim: true },
        familyPhotoPath: { type: String, trim: true },
        educationalCertificatesPath: { type: String, trim: true },
        technicalCertificatesPath: { type: String, trim: true },
        bankStatementPath: { type: String, trim: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Employee', employeeSchema);
