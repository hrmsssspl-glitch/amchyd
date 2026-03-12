export type PMSPeriod = 'FY' | 'Half Yearly' | 'Quarterly';
export type PMSStatus = 'Open' | 'In Progress' | 'Closed' | 'Normalization' | 'Finalized';
export type AppraisalStage = 'Self' | 'Manager' | 'Reviewer' | 'HR' | 'Completed';

export interface PMSCycle {
    id: string;
    period: PMSPeriod;
    fromDate: string;
    toDate: string;
    department: string;
    grade: string;
    status: PMSStatus;
}

export interface KRA {
    id: string;
    employeeId: string;
    name: string;
    description: string;
    weightage: number; // Percentage
    startDate: string;
    endDate: string;
    approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

export interface KPI {
    id: string;
    kraId: string;
    description: string;
    target: string;
    unit: '%' | 'Number' | 'Value';
    weightage: number;
    method: 'Quantitative' | 'Qualitative';
}

export interface AppraisalRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    cycleId: string;
    stage: AppraisalStage;

    // Ratings
    selfRating?: number;
    managerRating?: number;
    reviewerRating?: number;
    finalScore?: number;
    normalizedRating?: string; // Outstanding, Good, Average

    // Comments
    selfComments?: string;
    managerComments?: string;
    reviewerComments?: string;
    strengths?: string;
    improvementAreas?: string;

    // Recommendations
    incrementPercentage?: number;
    promotionRecommended: boolean;
    newDesignation?: string;
    incentiveAmount?: number;

    submissionDate?: string;
}

export interface PMSData {
    cycles: PMSCycle[];
    kras: KRA[];
    kpis: KPI[];
    appraisals: AppraisalRecord[];
}
