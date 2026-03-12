export interface HeadcountData {
    department: string;
    designation: string;
    male: number;
    female: number;
    permanent: number;
    contract: number;
    probation: number;
    total: number;
}

export interface AttendanceSummary {
    employeeId: string;
    name: string;
    department: string;
    workingDays: number;
    present: number;
    absent: number;
    halfDay: number;
    compOff: number;
    overtimeHours: number;
    lateMarks: number;
}

export interface LeaveBalance {
    employeeId: string;
    name: string;
    cl: number;
    sl: number;
    el: number;
    compOff: number;
    paternityMaternity: number;
    totalTaken: number;
}

export interface PayrollSummary {
    employeeId: string;
    name: string;
    department: string;
    grossSalary: number;
    deductions: number;
    netPay: number;
    pfContribution: number;
    esicContribution: number;
    bonus: number;
    incentives: number;
}

export interface AttritionData {
    employeeId: string;
    name: string;
    department: string;
    designation: string;
    joiningDate: string;
    lastDay: string;
    exitType: string;
    reason: string;
}

export interface PerformanceSummary {
    employeeId: string;
    name: string;
    department: string;
    designation: string;
    rating: number;
    increment: boolean;
    promotion: boolean;
    incentive: number;
}

export interface HRKPI {
    label: string;
    value: string | number;
    description: string;
    trend?: 'up' | 'down' | 'neutral';
}

export interface ReportsData {
    headcount: HeadcountData[];
    attendance: AttendanceSummary[];
    leaves: LeaveBalance[];
    payroll: PayrollSummary[];
    attrition: AttritionData[];
    performance: PerformanceSummary[];
    kpis: HRKPI[];
}
