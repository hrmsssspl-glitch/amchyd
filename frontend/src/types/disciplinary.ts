export type DisciplinarySeverity = 'Minor' | 'Major' | 'Critical';
export type DisciplinaryStatus = 'Open' | 'Under Enquiry' | 'Closed' | 'Withdrawn';
export type DisciplinaryActionType = 'Warning' | 'Suspension' | 'Termination' | 'None';

export interface DisciplinaryCase {
    id: string; // Case ID
    employeeId: string;
    employeeName: string;
    department: string;
    complaintSource: string;
    description: string;
    complaintDate: string;
    severity: DisciplinarySeverity;
    status: DisciplinaryStatus;
    documents?: string[];
}

export interface ShowCauseNotice {
    noticeNo: string;
    caseId: string;
    issueDate: string;
    responseDueDate: string;
    responseStatus: 'Pending' | 'Submitted';
    responseDocument?: string;
    hrRemarks: string;
}

export interface EnquiryDetails {
    caseId: string;
    type: 'Domestic' | 'Internal';
    committeeMembers: string[];
    startDate: string;
    endDate?: string;
    report?: string;
    findings?: string;
    minutes?: DisciplinaryMinutes[];
}

export interface DisciplinaryMinutes {
    meetingDate: string;
    participants: string[];
    minutes: string;
    observations: string;
    acknowledged: boolean;
}

export interface DisciplinaryAction {
    caseId: string;
    actionType: DisciplinaryActionType;
    description: string;
    effectiveFrom: string;
    effectiveTo?: string;
    approvalBy: string;
    actionLetter?: string;
}

export interface DisciplinaryData {
    cases: DisciplinaryCase[];
    notices: ShowCauseNotice[];
    enquiries: EnquiryDetails[];
    actions: DisciplinaryAction[];
}
