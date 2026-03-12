const mongoose = require('mongoose');

const engineSchema = mongoose.Schema({
    assetNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    kva: { type: String },
    engineHpRange: { type: String },
    branch: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: ''
    },
    customerName: { type: String, required: true },
    gstNumber: { type: String },
    contactPerson: { type: String },
    contactNumber: { type: String },
    mailId: { type: String },
    purchaseManagerName: { type: String },
    purchaseManagerContact: { type: String },
    purchaseManagerEmail: { type: String },
    contractStartDate: { type: Date },
    contractEndDate: { type: Date },
    aCheckDatetime: { type: Date },
    calendarYear: { type: String },
    installDatetime: { type: Date },
    industrySegment: { type: String },
    application: {
        type: String,
        enum: ['Compressor', 'Genset', 'Mining', 'Powergen', '']
    },
    customerSegment: { type: String },
    assetType: {
        type: String,
        default: ''
    },
    bCheckDate: { type: Date },
    bCheckCalendarYear: { type: String },
    bCheckValue: { type: Number },
    noOfVisits: { type: Number },
    typeOfVisits: {
        type: String,
        enum: ['Monthly', 'By Monthly', 'Bi Monthly', 'Quarterly', 'Half Yearly', '']
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
    poType: { type: String, enum: ['New', 'Renewal', ''] },
    basicAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 }, // 18%
    totalAmount: { type: Number, default: 0 },
    lastYearPriceBasic: { type: Number, default: 0 },
    amountHike: { type: Number, default: 0 },
    hikePercentage: { type: Number, default: 0 },
    hikeGetBy: { type: String },
    paymentTerms: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Half Yearly', '100%', '']
    },
    billingType: {
        type: String,
        enum: [
            'Monthly Advance', 'Monthly After',
            'Quarterly Advance', 'Quarterly After',
            'Half Yearly Advance', 'Half Yearly After',
            '100% Advance', '100% After',
            ''
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
    engineerEmpId: { type: String, default: '' },
    engineerName: { type: String },
    engineerContact: { type: String },
    advisor: { type: String },
    remarks: { type: String, default: '' },
    status: { type: String }, // Calculated automatically, but keep as string

    // Scheduler Fields
    scheduleDate: { type: Date },
    scheduledBy: { type: String },
    sonNumber: { type: String },
    sonDate: { type: Date },
    visitStatus: { type: String, enum: ['Pending', 'Completed', 'Postponed', 'Assigned', ''], default: 'Pending' },
    actualVisitDate: { type: Date },
    visitRemarks: { type: String, default: '' },

    // Breakdown Visit Fields
    isBreakdownVisit: { type: String, enum: ['Yes', 'No', ''], default: '' },
    breakdownVisitDate: { type: Date },
    breakdownVisitDetails: { type: String, default: '' },

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

    // AMC Conversion / Quote Fields
    conversionQuotationNo: { type: String },
    conversionQuoteDate: { type: Date },
    conversionQuoteValue: { type: Number },
    conversionQuoteCreatedBy: { type: String },
    conversionRevisedQuoteDate: { type: Date },
    conversionRevisedQuoteValue: { type: Number },
    conversionRevisedPriceApprovedBy: { type: String },
    conversionQuoteStatus: {
        type: String,
        enum: ['Hot', 'Warm', 'Cold']
    },
    conversionQuoteAssignedToId: { type: String },
    conversionQuoteAssignedToName: { type: String },
    conversionNoOfVisits: { type: Number },
    conversionTypeOfVisits: { type: String }, // Remove enum to allow flexible values
    conversionGstValue: { type: Number },
    conversionTotalValue: { type: Number },
    conversionRevisedGstValue: { type: Number },
    conversionRevisedTotalValue: { type: Number },
    conversionModifiedById: { type: String },
    conversionModifiedByName: { type: String },
}, {
    timestamps: true
});

const Engine = mongoose.model('Engine', engineSchema);
module.exports = Engine;
