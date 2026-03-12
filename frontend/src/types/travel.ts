export type TravelType = 'Local' | 'TR' | 'Outstation';
export type TravelStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Settled';
export type ExpenseCategory = 'Tickets' | 'Fuel' | 'Hotel' | 'Food' | 'Entertainment' | 'Others';

export interface TravelPolicy {
    id: string;
    type: TravelType;
    grade: string;
    limitPerDay: number;
    hotelCategory: string;
    transportMode: string;
}

export interface TravelRequest {
    id: string; // Travel Request No
    employeeId: string;
    employeeName: string;
    purpose: string;
    type: TravelType;
    fromLocation: string;
    toLocation: string;
    fromDate: string;
    toDate: string;
    expectedExpense: number;
    advanceRequired: boolean;
    advanceAmount?: number;
    requestDate: string;
    status: TravelStatus;
}

export interface ExpenseClaim {
    id: string;
    requestId: string;
    employeeId: string;
    category: ExpenseCategory;
    date: string;
    amountClaimed: number;
    amountApproved?: number;
    disallowedAmount?: number;
    billsUploaded: boolean;
    remarks?: string;
    status: 'Pending' | 'Verified' | 'Disallowed';
}

export interface TravelSettlement {
    requestId: string;
    employeeId: string;
    advancePaid: number;
    totalApprovedExpenses: number;
    reimbursementAmount: number; // Payable or Recoverable
    paymentMode: 'Bank' | 'Cash';
    status: 'Settled' | 'Pending';
    settlementDate?: string;
}

export interface TravelData {
    policies: TravelPolicy[];
    requests: TravelRequest[];
    claims: ExpenseClaim[];
    settlements: TravelSettlement[];
}
