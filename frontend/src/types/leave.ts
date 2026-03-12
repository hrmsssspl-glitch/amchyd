export type LeaveTypeCode = 'CL' | 'SL' | 'ESI' | 'EL' | 'CO' | 'ML' | 'PL' | 'AL' | 'OD' | 'EDU' | 'TRN';

export interface LeaveTypeConfig {
    code: LeaveTypeCode;
    name: string;
    description: string;
}

export type LeaveStatus = 'Applied' | 'Approved' | 'Rejected' | 'Pending';

export interface LeaveApplication {
    id: string;
    employeeId: string;
    employeeName: string;
    applicationDate: string;
    leaveType: LeaveTypeCode;
    fromDate: string;
    fromHalf: '1st' | '2nd' | 'Full';
    toDate: string;
    toHalf: '1st' | '2nd' | 'Full';
    numberOfDays: number;
    reason: string;
    substituteId?: string;
    substituteName?: string;
    teamLeadStatus: LeaveStatus;
    reportingManagerStatus: LeaveStatus;
    hrStatus: LeaveStatus;
    overallStatus: LeaveStatus;
    rejectionReason?: string;
    isEncashment?: boolean;
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

export interface LeaveEncashment {
    id: string;
    employeeId: string;
    employeeName: string;
    leaveType: 'EL'; // Only EL usually
    openingBalance: number;
    encashableLeaves: number; // 50% of available
    requestedDays: number;
    amount: number;
    status: LeaveStatus;
    payrollMonth: string;
}

export interface LeaveReportData {
    applications: LeaveApplication[];
    balances: LeaveBalance[];
    encashments: LeaveEncashment[];
}
