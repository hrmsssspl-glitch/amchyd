import { PermissionTemplate, BulkAssignmentCriteria, BulkAssignmentResult, UserPermission } from '../types/permissions';
import { User } from '../types';
import { saveUserPermission, getUserPermissions } from './permissionService';

const TEMPLATES_STORAGE_KEY = 'hrms_permission_templates';

// Get all permission templates
export const getPermissionTemplates = (): PermissionTemplate[] => {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error parsing permission templates:', error);
            return [];
        }
    }
    return [];
};

// Save a permission template
export const savePermissionTemplate = (template: PermissionTemplate): void => {
    const templates = getPermissionTemplates();
    const existingIndex = templates.findIndex(t => t.id === template.id);

    if (existingIndex >= 0) {
        templates[existingIndex] = template;
    } else {
        templates.push(template);
    }

    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
};

// Delete a permission template
export const deletePermissionTemplate = (templateId: string): void => {
    const templates = getPermissionTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
};

// Get a specific template
export const getTemplateById = (templateId: string): PermissionTemplate | null => {
    const templates = getPermissionTemplates();
    return templates.find(t => t.id === templateId) || null;
};

// Bulk assign permissions to employees
export const bulkAssignPermissions = (
    criteria: BulkAssignmentCriteria,
    allUsers: User[]
): BulkAssignmentResult => {
    const template = getTemplateById(criteria.templateId);

    if (!template) {
        return {
            success: false,
            assignedCount: 0,
            failedCount: 0,
            assignedEmployees: [],
            failedEmployees: [],
            message: 'Template not found'
        };
    }

    let targetEmployees: User[] = [];

    // Filter employees based on criteria
    switch (criteria.assignmentType) {
        case 'department':
            // Filter by department (you'll need to add department field to User type)
            targetEmployees = allUsers.filter(u =>
                u.role === 'employee' && (u as any).department === criteria.department
            );
            break;

        case 'designation':
            // Filter by designation
            targetEmployees = allUsers.filter(u =>
                u.role === 'employee' && (u as any).designation === criteria.designation
            );
            break;

        case 'branch':
            // Filter by branch
            targetEmployees = allUsers.filter(u =>
                u.role === 'employee' && u.branch === criteria.branch
            );
            break;

        case 'state':
            // Filter by state
            targetEmployees = allUsers.filter(u =>
                u.role === 'employee' && u.state === criteria.state
            );
            break;

        case 'employeeIds':
            // Filter by specific employee IDs
            targetEmployees = allUsers.filter(u =>
                u.role === 'employee' && criteria.employeeIds?.includes(u.username)
            );
            break;

        default:
            return {
                success: false,
                assignedCount: 0,
                failedCount: 0,
                assignedEmployees: [],
                failedEmployees: [],
                message: 'Invalid assignment type'
            };
    }

    // Assign permissions to each employee
    const assignedEmployees: string[] = [];
    const failedEmployees: string[] = [];

    targetEmployees.forEach(employee => {
        try {
            const permission: UserPermission = {
                userId: employee.username,
                menuIds: template.menuIds,
                moduleIds: template.moduleIds
            };
            saveUserPermission(permission);
            assignedEmployees.push(employee.username);
        } catch (error) {
            failedEmployees.push(employee.username);
        }
    });

    return {
        success: assignedEmployees.length > 0,
        assignedCount: assignedEmployees.length,
        failedCount: failedEmployees.length,
        assignedEmployees,
        failedEmployees,
        message: `Successfully assigned permissions to ${assignedEmployees.length} employee(s)`
    };
};

// Create default templates
export const createDefaultTemplates = (currentUser: string): void => {
    const existingTemplates = getPermissionTemplates();

    if (existingTemplates.length === 0) {
        const defaultTemplates: PermissionTemplate[] = [
            {
                id: 'template_payroll_officer',
                name: 'Payroll Officer',
                description: 'Access to payroll processing, employee master, and reports',
                menuIds: [1, 4, 5, 17], // Dashboard, Employee Master, Payroll, Reports
                moduleIds: [3, 4, 16], // Employee Master, Payroll, Reports
                createdBy: currentUser,
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            {
                id: 'template_recruitment_coordinator',
                name: 'Recruitment Coordinator',
                description: 'Access to recruitment, onboarding, and employee master',
                menuIds: [1, 4, 8, 10], // Dashboard, Employee Master, Recruitment, Training
                moduleIds: [3, 7, 9], // Employee Master, Recruitment, Training
                createdBy: currentUser,
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            {
                id: 'template_branch_manager',
                name: 'Branch Manager',
                description: 'Comprehensive access for branch-level management',
                menuIds: [1, 4, 6, 7, 9, 10, 13, 14], // Dashboard, Employee, Attendance, Leave, Performance, Training, Disciplinary, Grievance
                moduleIds: [3, 5, 6, 8, 9, 12, 13], // Employee, Attendance, Leave, Performance, Training, Disciplinary, Grievance
                createdBy: currentUser,
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            {
                id: 'template_hr_assistant',
                name: 'HR Assistant',
                description: 'Day-to-day HR operations support',
                menuIds: [1, 4, 6, 7, 11, 12], // Dashboard, Employee, Attendance, Leave, Assets, Travel
                moduleIds: [3, 5, 6, 10, 11], // Employee, Attendance, Leave, Assets, Travel
                createdBy: currentUser,
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            },
            {
                id: 'template_basic_employee',
                name: 'Basic Employee',
                description: 'Standard employee access',
                menuIds: [1, 6, 7, 10], // Dashboard, Attendance, Leave, Training
                moduleIds: [5, 6, 9], // Attendance, Leave, Training
                createdBy: currentUser,
                createdDate: new Date().toISOString(),
                lastModified: new Date().toISOString()
            }
        ];

        defaultTemplates.forEach(template => savePermissionTemplate(template));
    }
};
