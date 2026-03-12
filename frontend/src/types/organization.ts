export interface CompanyInfo {
    companyName: string;
    companyCode: string;
    cinGst: string;
    registeredAddress: string;
    corporateAddress: string;
    contactEmail: string;
    contactPhone: string;
    establishmentYear: string;
    industryType: string;
    panNumber: string;
    websiteUrl: string;
    logo?: string;
    logoUrl?: string;
}

export interface State {
    _id?: string;
    name: string;
    code: string;
    status: 'Active' | 'Inactive';
}

export type UnitType = 'Head Office' | 'Regional Office' | 'Zonal Office' | 'Branch Office' | 'Satellite Office' | 'Service & Spare Outlets';

export interface Branch {
    id: string;
    branchName: string;
    branchCode: string;
    state: 'Andhra Pradesh' | 'Telangana' | string;
    city: string;
    address: string;
    contactPerson: string;
    contactNumber: string;
    emailId: string;
    operationalSince: string;
    unitType: UnitType;
    capacity: number;
    gstNumber: string;
    status: 'Active' | 'Inactive';
}

export interface Department {
    id: string;
    state: string;
    branch: string;
    branchCode: string;
    departmentName: string;
    subDepartment: string;
    departmentCode: string;
    gradeLevel?: string;
    levelCode?: string;
    reportingHierarchy: string;
    employmentType?: string;
    numberOfPositions?: number;
    payScale?: string;
    location: string;
    status: 'Active' | 'Inactive';
}

export interface Designation {
    id: string;
    designationName: string;
    gradeLevel: string;
    reportingHierarchy: string;
    department: string;
    jobDescription: string;
    minQualification: string;
    employmentType: string;
    payScale: string;
    levelCode: string;
    numberOfPositions: number;
    status: 'Active' | 'Inactive';
}

export interface OrganizationData {
    company: CompanyInfo;
    branches: Branch[];
    departments: Department[];
    designations: Designation[];
}
