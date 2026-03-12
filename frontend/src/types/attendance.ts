export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day Present' | 'Half Day Absent' | 'Leave' | 'Compensatory Off' | 'Compensatory Working';
export type LeaveCode = 'CL' | 'SL' | 'ESI' | 'EL' | 'CO' | 'ML' | 'PL' | 'AL' | 'OD' | 'EDU' | 'TRN';



export interface LeaveType {
    code: LeaveCode;
    name: string;
    description: string;
}

export interface LeaveBalance {
    employeeId: string;
    employeeName: string;
    cl: number;
    sl: number;
    el: number;
    co: number;
    total: number;
}

export type TrackingType = 'Manual' | 'IP-Based' | 'Geo-Tag' | 'Biometric' | 'Mobile App';

export interface DailyAttendance {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string; // DD-MM-YYYY
    inTime: string; // HH:mm
    outTime: string; // HH:mm
    totalWorkingHours: number;
    shiftName: string;
    isLate: boolean;
    isEarlyEntry: boolean;
    isEarlyExit: boolean;
    shortageOfHours: boolean;
    status: AttendanceStatus;
    leaveType?: LeaveCode;
    isCompensatoryWorking?: boolean;
    isCompensatoryOff?: boolean;

    // Tracking Fields
    trackingType: TrackingType;
    ipAddress?: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
    remarks?: string;
}

export interface MonthlyAttendanceSummary {
    employeeId: string;
    employeeName: string;
    month: string;
    presentDays: number;
    absentDays: number;
    halfDays: number;
    leaveDays: number;
    payDays: number;
    lopDays: number;
}

export interface UnifiedAttendanceRecord extends DailyAttendance {
    otHours: number;
    otAmount: number;
    clBalance: number;
    slBalance: number;
    elBalance: number;
    coBalance: number;
    compOffWorkingDate?: string;
    compOffDate?: string;
    exceptionIssue?: string;
    exceptionRemarks?: string;
    presentDaysMonth?: number;
    absentDaysMonth?: number;
    payDaysMonth?: number;
}

export interface AttendanceReportData {
    daily: DailyAttendance[];
    monthly: MonthlyAttendanceSummary[];
    lateEarly: { employeeId: string; name: string; date: string; late: boolean; early: boolean }[];
    extraHours: { employeeId: string; name: string; month: string; otHours: number; otAmount: number }[];
    leaveBalances: LeaveBalance[];
    compOffs: { employeeId: string; name: string; workingDate: string; compOffDate: string; status: string }[];
    exceptions: { employeeId: string; name: string; date: string; issue: string; remarks: string }[];
    unified: UnifiedAttendanceRecord[];
}
