export type AssetType = 'Laptop' | 'PC' | 'Mobile' | 'SIM' | 'ID Card' | 'Tool Kit' | 'Others';
export type AssetStatus = 'Available' | 'Issued' | 'Returned';
export type AssetCondition = 'New' | 'Good' | 'Used' | 'Damaged';

export interface Asset {
    id: string; // Asset ID (Auto generated)
    type: AssetType;
    model: string;
    code: string; // Unique company code
    value: number;
    purchaseDate: string;
    hasWarranty: boolean;
    vendorName: string;
    status: AssetStatus;
}

export interface AssetAllocation {
    id: string;
    employeeId: string;
    employeeName: string;
    department: string;
    designation: string;
    assetType: AssetType;
    assetCode: string;
    accessories: string[]; // Charger, Bag, Mouse etc.
    toolkitIncluded: boolean;
    issueDate: string;
    issuedBy: string;
    conditionAtIssue: AssetCondition;
    acknowledgementSigned: boolean;
    remarks?: string;
}

export interface AssetInspection {
    id: string;
    employeeId: string;
    assetCode: string;
    currentCondition: AssetCondition;
    inspectionDate: string;
    inspectedBy: string;
    remarks?: string;
}

export interface AssetReturn {
    id: string;
    employeeId: string;
    assetCode: string;
    returnDate: string;
    conditionAtReturn: AssetCondition;
    recoveryRequired: boolean;
    recoveryAmount?: number;
    clearanceStatus: 'Cleared' | 'Pending';
    remarks?: string;
}

export interface AssetsData {
    inventory: Asset[];
    allocations: AssetAllocation[];
    inspections: AssetInspection[];
    returns: AssetReturn[];
}
