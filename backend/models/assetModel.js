const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
    assetNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    kva: { type: String },
    engineHpRange: { type: String },
    branch: {
        type: String,
        required: true,
        enum: ['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL']
    },
    customerName: { type: String, required: true },
    gstNumber: { type: String },
    contactPerson: { type: String },
    contactNumber: { type: String },
    mailId: { type: String },
    contractStartDate: { type: Date, required: true },
    contractEndDate: { type: Date, required: true },
    noOfVisits: { type: Number, min: 1, max: 36 },
    typeOfVisits: {
        type: String,
        enum: ['Monthly', 'By Monthly', 'Quarterly', 'Half Yearly']
    },
    contractPeriod: { type: String }, // Calculated: X months X days
    contractMonthsPending: { type: Number }, // Calculated
    purchaseOrderNo: { type: String },
    purchaseOrderDate: { type: Date },
    quotationNo: { type: String },
    quoteDate: { type: Date },
    actualPOReceived: { type: String }, // 'Yes' / 'No' or dropdown
    actualPoReceivedDate: { type: Date }, // Calendar picker
    poAttachment: { type: String }, // File path
    poType: { type: String, enum: ['New', 'Renewal'] },
    basicAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 }, // 18%
    totalAmount: { type: Number, default: 0 },
    lastYearPriceBasic: { type: Number, default: 0 },
    amountHike: { type: Number, default: 0 },
    hikePercentage: { type: Number, default: 0 },
    hikeGetBy: { type: String },
    paymentTerms: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Half Yearly', '100%']
    },
    billingType: {
        type: String,
        enum: [
            'Monthly Advance', 'Monthly After',
            'Quarterly Advance', 'Quarterly After',
            'Half Yearly Advance', 'Half Yearly After',
            '100% Advance', '100% After'
        ]
    },
    // Billing milestone dates, amounts and tracking
    q1Date: { type: Date },
    q1Amount: { type: Number },
    q1TallyInvoiceNo: { type: String },
    q1InvoiceDate: { type: Date },
    q1PaymentStatus: { type: String, enum: ['Yes', 'No', 'Pending', ''], default: '' },
    q1PaymentDetails: { type: String },
    q1PaymentReceivedDate: { type: Date },

    q2Date: { type: Date },
    q2Amount: { type: Number },
    q2TallyInvoiceNo: { type: String },
    q2InvoiceDate: { type: Date },
    q2PaymentStatus: { type: String, enum: ['Yes', 'No', 'Pending', ''], default: '' },
    q2PaymentDetails: { type: String },
    q2PaymentReceivedDate: { type: Date },

    q3Date: { type: Date },
    q3Amount: { type: Number },
    q3TallyInvoiceNo: { type: String },
    q3InvoiceDate: { type: Date },
    q3PaymentStatus: { type: String, enum: ['Yes', 'No', 'Pending', ''], default: '' },
    q3PaymentDetails: { type: String },
    q3PaymentReceivedDate: { type: Date },

    q4Date: { type: Date },
    q4Amount: { type: Number },
    q4TallyInvoiceNo: { type: String },
    q4InvoiceDate: { type: Date },
    q4PaymentStatus: { type: String, enum: ['Yes', 'No', 'Pending', ''], default: '' },
    q4PaymentDetails: { type: String },
    q4PaymentReceivedDate: { type: Date },

    coordinator: { type: String },
    engineerName: { type: String },
    engineerContact: { type: String },

    // Inactive Followup Fields
    inactiveFollowups: [{
        employeeId: { type: String },
        employeeName: { type: String },
        empContactNumber: { type: String },
        followUpDate: { type: Date },
        customerContactedName: { type: String },
        customerContactNumber: { type: String },
        customerContactEmail: { type: String },
        remarks: { type: String },
        poStatus: { type: String, enum: ['PO Received', 'Not Received', 'Pending', ''] },
        createdAt: { type: Date, default: Date.now }
    }],

    status: { type: String, default: 'Active' }
}, {
    timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);
module.exports = Asset;
