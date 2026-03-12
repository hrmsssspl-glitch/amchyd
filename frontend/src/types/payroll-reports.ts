export interface PayrollSummaryReportData {
    month: string;
    totalEmployees: number;
    totalGrossSalary: number;
    totalDeductions: number;
    totalNetPay: number;
    status: 'Draft' | 'Locked' | 'Processed';
}

export interface EmployeePayslipReportData {
    employeeId: string;
    employeeName: string;
    month: string;
    grossSalary: number;
    totalDeductions: number;
    netPay: number;
    payslipUrl?: string; // Link to download
}

export interface StatutoryComplianceReportData {
    month: string;
    pfAmount: number;
    esicAmount: number;
    ptAmount: number;
    tdsAmount: number;
    status: 'Pending' | 'Filed' | 'Paid';
}
