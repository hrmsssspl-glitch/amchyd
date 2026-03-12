const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, ref: 'HrmsEmployee' },
    employeeName: { type: String }, // Optional, can be populated
    date: { type: String, required: true }, // YYYY-MM-DD

    shiftName: { type: String, default: 'General' },

    inTime: { type: String }, // HH:mm
    outTime: { type: String }, // HH:mm

    totalWorkingHours: { type: Number, default: 0 },

    status: {
        type: String,
        enum: ['Present', 'Absent', 'Half Day Present', 'Half Day Absent', 'Leave', 'Compensatory Off', 'Compensatory Working', 'Holiday', 'Weekly Off'],
        default: 'Absent'
    },

    leaveType: { type: String }, // If status is Leave

    // Tracking
    trackingType: { type: String, enum: ['Manual', 'IP-Based', 'Geo-Tag', 'Biometric'], default: 'Manual' },
    ipAddress: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    locationName: { type: String },

    // Flags
    isLate: { type: Boolean, default: false },
    isEarlyEntry: { type: Boolean, default: false },
    isEarlyExit: { type: Boolean, default: false },
    shortageOfHours: { type: Boolean, default: false }, // If working hours < shift hours

    remarks: { type: String }
}, { timestamps: true });

// Compound index to ensure one log per employee per day
attendanceLogSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HrmsAttendanceLog', attendanceLogSchema);
