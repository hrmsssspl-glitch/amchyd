export interface SalaryStructure {
    employeeId: string;
    employeeName: string;
    ctc: number;
    grossSalary: number;
    basicSalary: number;
    hra: number;
    specialAllowance: number;
    conveyanceAllowance: number;
    medicalAllowance: number;
    otherAllowances: number;

    // Eligibilities & Insurance
    groupHealthInsurance: number; // Employer provided amount
    groupAccidentalInsurance: number; // Employer provided amount
    travelReimbursementEligibility: boolean;
    bonusEligibility: boolean;
    incentiveEligibility: boolean;
    gratuityEligibility: boolean;
    pfEligibility: boolean;
    professionalTaxEligibility: boolean;
    incomeTaxEligibility: boolean;
    tdsEligibility: boolean;
    esiEligibility: boolean;

    // Previous Month Adjustments (for initial setup or informational)
    shortPaidLastMonth?: number;
    excessPaidLastMonth?: number;
    arrears?: number;
    salaryAdvance?: number;
}

export interface PayrollProcessing {
    employeeId: string;
    employeeName: string;
    salaryMonth: string; // MM-YYYY
    payDays: number;
    lopDays: number;
    grossSalary: number; // Calculated based on attendance
    totalDeductions: number;
    netPay: number;
    paymentMode: 'Bank' | 'Cash' | 'Cheque';

    // Bank Details
    bankAccountNumber: string;
    ifscCode: string;
    branchName: string;
    branchAddress: string;

    // Auto-fetched details
    aadhaarNumber: string;
    panNumber: string;
    uanNumber: string;
    pfNumber: string;
    esiNumber: string;
}

export interface StatutoryDeductions {
    pfEmployee: number;
    pfEmployer: number;
    esiEmployee: number;
    esiEmployer: number;
    professionalTax: number;
    incomeTax: number;
    tds: number;
    labourWelfareFund: number;

    // Recoveries
    salaryAdvanceRecovery: number;
    tourAdvanceRecovery: number;
    medicalAdvanceRecovery: number;
    festivalAdvanceRecovery: number;
    excessPaidRecovery: number;

    // Insurance Employee Share
    groupHealthInsuranceEmployee: number;
    groupAccidentalInsuranceEmployee: number;
}

export interface PayrollData {
    id?: string;
    structure: SalaryStructure;
    processing: PayrollProcessing;
    deductions: StatutoryDeductions;
}
