export type GrievanceCategory = 'Work' | 'Pay' | 'Behavior' | 'Policy' | 'Harassment';
export type GrievanceStatus = 'Open' | 'Under Review' | 'Resolved' | 'Partially Resolved' | 'Closed';
export type ConfidentialityLevel = 'Normal' | 'High';

export interface Grievance {
    id: string; // Grievance ID (Auto-generated)
    employeeId: string;
    employeeName: string;
    department: string;
    category: GrievanceCategory;
    description: string;
    date: string;
    confidentiality: ConfidentialityLevel;
    status: GrievanceStatus;
    documents?: string[];
}

export interface GrievanceEnquiry {
    grievanceId: string;
    type: 'Internal' | 'Committee';
    committeeMembers: string[];
    startDate: string;
    endDate?: string;
    report?: string;
    findings?: string;
}

export interface GrievanceMinutes {
    grievanceId: string;
    meetingDate: string;
    participants: string[];
    minutes: string;
    observations: string;
}

export interface GrievanceAction {
    grievanceId: string;
    actionType: 'Warning' | 'Counseling' | 'Suspension' | 'Policy Change';
    description: string;
    effectiveDate: string;
    approvedBy: string;
    letter?: string;
}

export interface GrievanceResolution {
    grievanceId: string;
    status: 'Resolved' | 'Partially Resolved' | 'Closed';
    closureDate: string;
    employeeAcceptance: 'Accepted' | 'Escalated';
    remarks: string;
}

export interface GrievanceData {
    grievances: Grievance[];
    enquiries: GrievanceEnquiry[];
    actions: GrievanceAction[];
    resolutions: GrievanceResolution[];
}
