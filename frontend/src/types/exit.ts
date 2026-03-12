export type ExitType = 'Voluntary' | 'Involuntary' | 'Retrenchment';
export type ClearanceStatus = 'Pending' | 'Completed';
export type FnFStatus = 'Pending' | 'Completed';
export type RejoiningEligibility = 'Yes' | 'No';

export interface ExitRecord {
    id: string; // Employee ID
    name: string;
    department: string;
    designation: string;
    employmentType: string;
    resignationDate: string;
    lastWorkingDay: string;
    noticePeriod: number;
    exitType: ExitType;
    status: 'In Process' | 'Cleared' | 'Settled' | 'Closed';
}

export interface ExitInterviewData {
    employeeId: string;
    interviewDate: string;
    interviewedBy: string;
    feedback: string;
    reasonForLeaving: 'Voluntary' | 'Compensation' | 'Work Environment' | 'Others';
    rejoiningEligibility: RejoiningEligibility;
    remarks?: string;
}

export interface ClearanceData {
    employeeId: string;
    asset: ClearanceStatus;
    payroll: ClearanceStatus;
    finance: ClearanceStatus;
    hr: ClearanceStatus;
    itAdmin: ClearanceStatus;
    totalStatus: 'Cleared' | 'Pending';
}

export interface FnFData {
    employeeId: string;
    salaryTillLastDay: number;
    leaveEncashment: number;
    gratuity: number;
    bonusIncentives: number;
    deductions: number;
    netPayable: number;
    paymentDate?: string;
    status: FnFStatus;
}

export interface ExitLetters {
    employeeId: string;
    relievingIssued: boolean;
    experienceIssued: boolean;
    letterDate?: string;
    letterReference?: string;
}

export interface SeparationData {
    exits: ExitRecord[];
    interviews: ExitInterviewData[];
    clearances: ClearanceData[];
    settlements: FnFData[];
    letters: ExitLetters[];
}
