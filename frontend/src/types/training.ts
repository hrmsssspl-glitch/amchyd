export type TrainingType = 'Internal' | 'External';
export type TrainingObjective = 'Skill' | 'Compliance' | 'Product';
export type TrainingMode = 'Classroom' | 'Online' | 'Hybrid';
export type TrainingStatus = 'Planned' | 'Ongoing' | 'Completed';

export interface TrainingProgram {
    id: string;
    name: string;
    type: TrainingType;
    trainerName: string;
    objective: TrainingObjective;
    fromDate: string;
    toDate: string;
    duration: string;
    mode: TrainingMode;
    applicableDepartment: string;
    applicableDesignation: string;
    status: TrainingStatus;
}

export interface TrainingNomination {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    programId: string;
    programName: string;
    nominationDate: string;
    nominatedBy: string;
    approvalStatus: 'Pending' | 'Approved' | 'Rejected';
}

export interface TrainingCompletion {
    employeeId: string;
    programId: string;
    attendanceStatus: 'Attended' | 'Not Attended';
    completionStatus: 'Completed' | 'Incomplete';
    completionDate?: string;
    remarks?: string;
    examConducted: boolean;
    examResult?: 'Pass' | 'Fail';
    score?: string;
    evaluatedBy?: string;
    evaluationDate?: string;
}

export interface TrainingCertificate {
    id: string;
    employeeId: string;
    programId: string;
    isBestPerformance: boolean;
    certificateNumber: string;
    issuedDate: string;
    validTill?: string;
}

export interface CumminsTraining {
    employeeId: string;
    cumminsId: string;
    category: 'Technical' | 'Product';
    nominationDate: string;
    completionStatus: 'Completed' | 'Pending';
    certificationUploaded: boolean;
}

export interface TrainingData {
    programs: TrainingProgram[];
    nominations: TrainingNomination[];
    completions: TrainingCompletion[];
    certificates: TrainingCertificate[];
    cummins: CumminsTraining[];
}
