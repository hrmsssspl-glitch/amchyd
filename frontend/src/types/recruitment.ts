export type CandidateStatus = 'New' | 'Interview Scheduled' | 'Interview Cleared' | 'Interview Not Cleared' | 'On Hold' | 'Selected' | 'Offer Issued' | 'Offer Accepted' | 'Offer Declined' | 'Joined' | 'Rejected';

export interface Candidate {
    id: string;
    name: string;
    email: string;
    phone: string;
    experience: number;
    relevantExperience: number;
    source: 'Referral' | 'Portal' | 'Consultant' | 'Ex-Emp';
    currentCompany?: string;
    currentCTC?: number;
    expectedCTC?: number;
    jobCode: string;
    status: CandidateStatus;
    resumeUrl?: string;
    idProofs: string[]; // Pan, Aadhar, etc.
}

export interface InterviewRecord {
    candidateId: string;
    interviewDate: string;
    panel: string[];
    status: 'Scheduled' | 'Cleared' | 'Not Cleared' | 'No Show' | 'Postponed';
    remarks: string;
    selectionStatus: 'Selected' | 'On Hold' | 'Data Bank';
}

export interface OfferDetails {
    candidateId: string;
    employeeId: string; // Potential ID
    offeredSalary: number;
    joiningBonus?: number;
    hikePercentage: number;
    expectedDOJ: string;
    issueDate: string;
    status: 'Accepted' | 'Pending' | 'Declined';
    remarks?: string;
}

export interface OnboardingChecklist {
    candidateId: string;
    offerAccepted: boolean;
    appointmentLetterIssued: boolean;
    idProofSubmitted: boolean;
    qualificationCertificates: boolean;
    experienceCertificate: boolean;
    paySlips: boolean;
    bankStatement: boolean;
    addressProof: boolean;
    bankDetails: boolean;
    pfEsiDeclaration: boolean;
    inductionCompleted: boolean;
    inductionDate?: string;
    uniformIssued: boolean;
    safetyKitIssued: boolean;
    idCardIssued: boolean;
}

export interface RecruitmentData {
    candidates: Candidate[];
    interviews: InterviewRecord[];
    offers: OfferDetails[];
    checklists: OnboardingChecklist[];
}
