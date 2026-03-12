import { UserRole } from './index';

// User-specific permission configuration
export interface UserPermission {
    userId: string; // Login ID
    menuIds: number[]; // Allowed menu IDs
    moduleIds: number[]; // Allowed module IDs
    customPermissions?: {
        canExport?: boolean;
        canImport?: boolean;
        canDelete?: boolean;
        canApprove?: boolean;
    };
}

// Permission management
export interface PermissionConfig {
    rolePermissions: RolePermissions;
    userPermissions: UserPermission[];
}

export interface RolePermissions {
    [key: string]: {
        moduleIds: number[];
        menuIds: number[];
    };
}

// Permission assignment record
export interface PermissionAssignment {
    id: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    assignedMenus: number[];
    assignedModules: number[];
    assignedBy: string;
    assignedDate: string;
    lastModified: string;
}

// Permission Template
export interface PermissionTemplate {
    id: string;
    name: string;
    description: string;
    menuIds: number[];
    moduleIds: number[];
    createdBy: string;
    createdDate: string;
    lastModified: string;
}

// Bulk assignment criteria
export interface BulkAssignmentCriteria {
    templateId: string;
    assignmentType: 'department' | 'designation' | 'branch' | 'state' | 'employeeIds';
    department?: string;
    designation?: string;
    branch?: string;
    state?: string;
    employeeIds?: string[];
}

// Bulk assignment result
export interface BulkAssignmentResult {
    success: boolean;
    assignedCount: number;
    failedCount: number;
    assignedEmployees: string[];
    failedEmployees: string[];
    message: string;
}
