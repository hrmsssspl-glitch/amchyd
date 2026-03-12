export interface Tender {
    id: string;
    state: 'Andhra Pradesh' | 'Telangana';
    branch: string;
    tenderFloatingDate: string; // Date string YYYY-MM-DD
    tenderType: 'Parts' | 'AMC' | 'Parts & AMC' | 'Engine Sales' | 'Others';
    tenderTypeManual?: string; // If tenderType is 'Others'
    customerName: string;
    contactPersonName: string;
    contactNumber: string;
    contactEmailId: string;
    tenderWebLink: string;
    tenderNumber: string;
    tenderPublishedDate: string; // Date string
    tenderDescription: string;
    tenderValue: number;
    tenderLastDate: string; // Date string

    // EMD Section
    emdDetails: 'Cheque' | 'BG';
    emdValue: number;
    emdValidityFromDate: string;
    emdValidityEndDate: string;
    emdReturnedByCustomer: 'Yes' | 'No';
    emdReturnedDate?: string;

    // BG Section (Bank Guarantee) - separate from EMD? User listed both "EMD" and "BG" fields.
    // "BG- Details - Value", "BG - Validity Date", etc.
    // Wait, EMD-Details has Cheque/BG dropdown. If BG is selected there, maybe BG fields apply?
    // Or is there a separate BG section?
    // "EMD -Details - Cheque/BG"
    // "BG- Details - Value"
    // It looks like there are two distinct sections or maybe related.
    // If EMD type is BG, then EMD fields apply.
    // But there is also specific "BG - Details".
    // Let's assume there's an EMD section and a standalone BG section (maybe for Performance Bank Guarantee?).
    // Or maybe the user means: If EMD is BG, then capture BG details.
    // "EMD -Details - Cheque/BG"
    // "EMD Value"
    // "EMD Validity date"
    // "EMD Returned by Customer"
    // "BG- Details - Value"
    // "BG - Validity Date"
    // "BG Returned by Customer"

    // It seems like there might be *two* guarantees involved or the user listed them separately.
    // Let's verify: "EMD" (Earnest Money Deposit) is usually separate from "Bank Guarantee" (Performance, etc).
    // So I'll add a separate BG section.

    bgValue?: number;
    bgValidityFromDate?: string;
    bgValidityEndDate?: string;
    bgReturnedByCustomer?: 'Yes' | 'No';
    bgReturnedDate?: string;

    sssplAuthorisedName: string;
    tenderSubmissionDate: string;
    tenderQuotedValue: number;
    tenderNegotiationValue: number;

    tenderStatus: 'In Progress' | 'Order Received' | 'Cancelled';

    // PO Details (likely if Order Received)
    poNumber?: string;
    poValue?: number;
    poDate?: string;

    invoiceNumber?: string;
    invoiceDate?: string;
    invoiceAmount?: number;

    paymentStatus: 'Received' | 'Pending';
    paymentReceivedDate?: string;
    paymentMode?: 'Cheque' | 'Neft';
    paymentReference?: string;

    // Metadata
    createdBy: string;
    createdDate: string; // ISO string
}

export type TenderStatus = Tender['tenderStatus'];
