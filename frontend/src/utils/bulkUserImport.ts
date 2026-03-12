import { User, UserRole } from '../types';
import * as XLSX from 'xlsx';

export interface BulkUserData {
    username: string;
    name: string;
    password: string;
    role: UserRole;
    employeeId?: string;
    state?: string;
    branch?: string;
    email?: string;
    phone?: string;
}

export interface ImportValidationError {
    row: number;
    field: string;
    value: string;
    error: string;
}

export interface ImportResult {
    success: boolean;
    totalRows: number;
    validRows: number;
    invalidRows: number;
    users: BulkUserData[];
    errors: ImportValidationError[];
}

// Validate a single user row
const validateUserRow = (row: any, rowIndex: number): ImportValidationError[] => {
    const errors: ImportValidationError[] = [];

    // Required fields validation
    if (!row.username || row.username.trim() === '') {
        errors.push({
            row: rowIndex,
            field: 'username',
            value: row.username || '',
            error: 'Username is required'
        });
    }

    if (!row.name || row.name.trim() === '') {
        errors.push({
            row: rowIndex,
            field: 'name',
            value: row.name || '',
            error: 'Name is required'
        });
    }

    if (!row.password || row.password.trim() === '') {
        errors.push({
            row: rowIndex,
            field: 'password',
            value: row.password || '',
            error: 'Password is required'
        });
    }

    if (!row.role || row.role.trim() === '') {
        errors.push({
            row: rowIndex,
            field: 'role',
            value: row.role || '',
            error: 'Role is required'
        });
    } else {
        const validRoles: UserRole[] = ['superadmin', 'admin', 'hr_manager', 'employee'];
        if (!validRoles.includes(row.role as UserRole)) {
            errors.push({
                row: rowIndex,
                field: 'role',
                value: row.role,
                error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
            });
        }
    }

    // Employee-specific validation - now optional, will be auto-filled if missing
    // No errors for missing employeeId, state, or branch - they'll be handled during import

    return errors;
};

// Parse CSV file
export const parseCSVFile = (file: File): Promise<ImportResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim() !== '');

                if (lines.length < 2) {
                    reject(new Error('CSV file must contain header and at least one data row'));
                    return;
                }

                // Parse header
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

                // Validate required headers
                const requiredHeaders = ['username', 'name', 'password', 'role'];
                const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

                if (missingHeaders.length > 0) {
                    reject(new Error(`Missing required headers: ${missingHeaders.join(', ')}`));
                    return;
                }

                // Parse data rows
                const users: BulkUserData[] = [];
                const errors: ImportValidationError[] = [];

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    const row: any = {};

                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });

                    // Validate row
                    const rowErrors = validateUserRow(row, i + 1);

                    if (rowErrors.length > 0) {
                        errors.push(...rowErrors);
                    } else {
                        const employeeId = row.employeeid || row.employee_id || row.username;
                        const state = row.state || 'Not Specified';
                        const branch = row.branch || 'Not Specified';

                        users.push({
                            username: row.username,
                            name: row.name,
                            password: row.password,
                            role: row.role as UserRole,
                            employeeId: employeeId,
                            state: state,
                            branch: branch,
                            email: row.email,
                            phone: row.phone
                        });
                    }
                }

                resolve({
                    success: errors.length === 0,
                    totalRows: lines.length - 1,
                    validRows: users.length,
                    invalidRows: errors.length,
                    users,
                    errors
                });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

// Parse Excel file
export const parseExcelFile = (file: File): Promise<ImportResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                // Get first sheet
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

                if (jsonData.length === 0) {
                    reject(new Error('Excel file is empty'));
                    return;
                }

                // Parse and validate data
                const users: BulkUserData[] = [];
                const errors: ImportValidationError[] = [];

                jsonData.forEach((row: any, index: number) => {
                    // Normalize keys to lowercase
                    const normalizedRow: any = {};
                    Object.keys(row).forEach((key: string) => {
                        normalizedRow[key.toLowerCase().trim()] = row[key];
                    });

                    // Validate row
                    const rowErrors = validateUserRow(normalizedRow, index + 2); // +2 because Excel rows start at 1 and we have header

                    if (rowErrors.length > 0) {
                        errors.push(...rowErrors);
                    } else {
                        const employeeId = normalizedRow.employeeid || normalizedRow.employee_id || normalizedRow['employee id'] || normalizedRow.username;
                        const state = normalizedRow.state || 'Not Specified';
                        const branch = normalizedRow.branch || 'Not Specified';

                        users.push({
                            username: normalizedRow.username,
                            name: normalizedRow.name,
                            password: normalizedRow.password,
                            role: normalizedRow.role as UserRole,
                            employeeId: employeeId,
                            state: state,
                            branch: branch,
                            email: normalizedRow.email,
                            phone: normalizedRow.phone
                        });
                    }
                });

                resolve({
                    success: errors.length === 0,
                    totalRows: jsonData.length,
                    validRows: users.length,
                    invalidRows: errors.length,
                    users,
                    errors
                });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsBinaryString(file);
    });
};

// Generate CSV template
export const generateCSVTemplate = (): string => {
    const headers = [
        'username',
        'name',
        'password',
        'role',
        'employeeId',
        'state',
        'branch',
        'email',
        'phone'
    ];

    const sampleData = [
        'EMP001,Rajesh Kumar,emp123,employee,EMP001,Andhra Pradesh,Vijayawada (Head Office),rajesh@example.com,9876543210',
        'EMP002,Priya Sharma,emp123,employee,EMP002,Telangana,Hyderabad,priya@example.com,9876543211',
        'hr.manager,HR Manager,hr123,hr_manager,,,,,9876543212'
    ];

    return [headers.join(','), ...sampleData].join('\n');
};

// Generate Excel template
export const generateExcelTemplate = (): void => {
    const data = [
        {
            username: 'EMP001',
            name: 'Rajesh Kumar',
            password: 'emp123',
            role: 'employee',
            employeeId: 'EMP001',
            state: 'Andhra Pradesh',
            branch: 'Vijayawada (Head Office)',
            email: 'rajesh@example.com',
            phone: '9876543210'
        },
        {
            username: 'EMP002',
            name: 'Priya Sharma',
            password: 'emp123',
            role: 'employee',
            employeeId: 'EMP002',
            state: 'Telangana',
            branch: 'Hyderabad',
            email: 'priya@example.com',
            phone: '9876543211'
        },
        {
            username: 'hr.manager',
            name: 'HR Manager',
            password: 'hr123',
            role: 'hr_manager',
            employeeId: '',
            state: '',
            branch: '',
            email: '',
            phone: '9876543212'
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Download file
    XLSX.writeFile(workbook, 'user_import_template.xlsx');
};

// Download CSV template
export const downloadCSVTemplate = (): void => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'user_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
