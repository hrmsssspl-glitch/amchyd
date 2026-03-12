export type LicenseType = 'Labour' | 'Trade' | 'Other';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending';
export type AuditType = 'PF' | 'ESIC' | 'Labour' | 'Safety' | 'Bonus';

export interface ComplianceLicense {
    id: string; // License ID
    type: LicenseType;
    number: string;
    validFrom: string;
    validTo: string;
    department: string;
    status: 'Active' | 'Expired';
    remarks?: string;
}

export interface PFESICReturn {
    employeeId: string;
    employeeName: string;
    pfNumber: string;
    returnMonth: string;
    pfContribution: number;
    esicNumber: string;
    esicContribution: number;
    status: 'Submitted' | 'Pending';
    remarks?: string;
}

export interface StatutoryPayment {
    employeeId: string;
    employeeName: string;
    ptDeducted: number;
    returnMonth: string;
    bonusEligible: boolean;
    bonusPayable: number;
    bonusStatus: 'Paid' | 'Pending';
    nonPaymentReason?: string;
}

export interface LabourCompliance {
    employeeId: string;
    employeeName: string;
    department: string;
    contractType: 'Permanent' | 'Contract' | 'Trainee';
    checklist: string[];
    documentSubmitted: boolean;
    verifiedBy: string;
    status: ComplianceStatus;
}

export interface ContractorRecord {
    contractorName: string;
    employeeName: string;
    type: 'Temporary' | 'Outsourced';
    startDate: string;
    endDate: string;
    employeeCount: number;
    documentsSubmitted: 'Submitted' | 'Pending';
    status: ComplianceStatus;
}

export interface SafetyIncident {
    employeeId: string;
    employeeName: string;
    date: string;
    type: 'Minor' | 'Major';
    location: string;
    reportingManager: string;
    actionTaken: string;
    status: 'Closed' | 'Pending';
}

export interface ComplianceAudit {
    id: string;
    type: AuditType;
    period: string;
    auditor: string;
    findings: string;
    status: ComplianceStatus;
    actionTaken: string;
    closureDate?: string;
}

export interface ComplianceData {
    licenses: ComplianceLicense[];
    pfEsicReturns: PFESICReturn[];
    statutoryPayments: StatutoryPayment[];
    labourCompliance: LabourCompliance[];
    contractors: ContractorRecord[];
    incidents: SafetyIncident[];
    audits: ComplianceAudit[];
}
