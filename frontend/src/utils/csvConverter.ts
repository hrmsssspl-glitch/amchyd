import * as XLSX from 'xlsx';

/**
 * CSV Converter Utility
 * Converts Employee Master Export to Bulk User Import format
 */

export interface EmployeeMasterRow {
    [key: string]: any;
}

export interface ConvertedUserRow {
    username: string;
    name: string;
    password: string;
    role: string;
    employeeId: string;
    state: string;
    branch: string;
    email: string;
    phone: string;
}

export interface ConversionResult {
    success: boolean;
    convertedRows: ConvertedUserRow[];
    errors: string[];
    totalRows: number;
    convertedCount: number;
}

/**
 * Common column name mappings
 * Maps various possible column names to our standard format
 */
const COLUMN_MAPPINGS: { [key: string]: string[] } = {
    employeeId: [
        'employee id', 'employeeid', 'emp id', 'empid', 'employee_id', 'emp_id',
        'employee code', 'employeecode', 'emp code', 'empcode', 'employee number',
        'emp no', 'employee no', 'staff id', 'staffid'
    ],
    name: [
        'employee name', 'employeename', 'emp name', 'empname', 'full name',
        'fullname', 'name', 'staff name', 'person name'
    ],
    state: [
        'state', 'state name', 'statename', 'location state', 'work state'
    ],
    branch: [
        'branch', 'branch name', 'branchname', 'location', 'office', 'work location',
        'branch location', 'office location', 'site'
    ],
    email: [
        'email', 'email id', 'emailid', 'email address', 'e-mail', 'mail',
        'official email', 'work email'
    ],
    phone: [
        'phone', 'phone number', 'phonenumber', 'mobile', 'mobile number',
        'contact', 'contact number', 'cell', 'telephone'
    ],
    designation: [
        'designation', 'position', 'job title', 'title', 'role name'
    ],
    department: [
        'department', 'dept', 'department name', 'division'
    ]
};

/**
 * Find matching column name from possible variations
 */
const findColumnName = (headers: string[], possibleNames: string[]): string | null => {
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());

    for (const possibleName of possibleNames) {
        const index = normalizedHeaders.indexOf(possibleName.toLowerCase());
        if (index !== -1) {
            return headers[index];
        }
    }

    return null;
};

/**
 * Generate username from employee ID or name
 */
const generateUsername = (employeeId: string, name: string): string => {
    if (employeeId && employeeId.trim() !== '') {
        return employeeId.trim().toUpperCase();
    }

    // Fallback: generate from name
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return `${nameParts[0].toLowerCase()}.${nameParts[nameParts.length - 1].toLowerCase()}`;
    }

    return name.toLowerCase().replace(/\s+/g, '.');
};

/**
 * Convert Employee Master CSV/Excel to Bulk Import format
 */
export const convertEmployeeMasterToImportFormat = async (
    file: File,
    defaultPassword: string = 'emp123'
): Promise<ConversionResult> => {
    const result: ConversionResult = {
        success: false,
        convertedRows: [],
        errors: [],
        totalRows: 0,
        convertedCount: 0
    };

    try {
        let data: any[];

        // Read file based on type
        if (file.name.endsWith('.csv')) {
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');

            if (lines.length < 2) {
                result.errors.push('CSV file must contain header and at least one data row');
                return result;
            }

            const headers = lines[0].split(',').map(h => h.trim());
            data = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const row: any = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
        } else {
            // Excel file
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(worksheet);
        }

        result.totalRows = data.length;

        if (data.length === 0) {
            result.errors.push('File contains no data rows');
            return result;
        }

        // Get headers from first row
        const headers = Object.keys(data[0]);

        // Find column mappings
        const employeeIdCol = findColumnName(headers, COLUMN_MAPPINGS.employeeId);
        const nameCol = findColumnName(headers, COLUMN_MAPPINGS.name);
        const stateCol = findColumnName(headers, COLUMN_MAPPINGS.state);
        const branchCol = findColumnName(headers, COLUMN_MAPPINGS.branch);
        const emailCol = findColumnName(headers, COLUMN_MAPPINGS.email);
        const phoneCol = findColumnName(headers, COLUMN_MAPPINGS.phone);

        // Validate required columns
        if (!nameCol) {
            result.errors.push('Could not find "Name" column. Please ensure your file has an employee name column.');
            return result;
        }

        // Convert each row
        data.forEach((row: any, index: number) => {
            try {
                const employeeId = employeeIdCol ? String(row[employeeIdCol] || '').trim() : '';
                const name = nameCol ? String(row[nameCol] || '').trim() : '';
                const state = stateCol ? String(row[stateCol] || '').trim() : '';
                const branch = branchCol ? String(row[branchCol] || '').trim() : '';
                const email = emailCol ? String(row[emailCol] || '').trim() : '';
                const phone = phoneCol ? String(row[phoneCol] || '').trim() : '';

                if (!name) {
                    result.errors.push(`Row ${index + 2}: Name is required`);
                    return;
                }

                const username = generateUsername(employeeId, name);

                const convertedRow: ConvertedUserRow = {
                    username: username,
                    name: name,
                    password: defaultPassword,
                    role: 'employee',
                    employeeId: employeeId || username,
                    state: state,
                    branch: branch,
                    email: email,
                    phone: phone
                };

                result.convertedRows.push(convertedRow);
                result.convertedCount++;
            } catch (error: any) {
                result.errors.push(`Row ${index + 2}: ${error.message}`);
            }
        });

        result.success = result.convertedCount > 0;
        return result;

    } catch (error: any) {
        result.errors.push(`Error reading file: ${error.message}`);
        return result;
    }
};

/**
 * Download converted data as CSV
 */
export const downloadConvertedCSV = (convertedRows: ConvertedUserRow[], filename: string = 'converted_users.csv'): void => {
    const headers = ['username', 'name', 'password', 'role', 'employeeId', 'state', 'branch', 'email', 'phone'];

    const csvContent = [
        headers.join(','),
        ...convertedRows.map(row =>
            headers.map(header => {
                const value = row[header as keyof ConvertedUserRow] || '';
                // Escape commas and quotes
                if (value.includes(',') || value.includes('"')) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Download converted data as Excel
 */
export const downloadConvertedExcel = (convertedRows: ConvertedUserRow[], filename: string = 'converted_users.xlsx'): void => {
    // Convert to array of arrays format
    const headers = ['username', 'name', 'password', 'role', 'employeeId', 'state', 'branch', 'email', 'phone'];
    const data = [
        headers,
        ...convertedRows.map(row => headers.map(h => row[h as keyof ConvertedUserRow] || ''))
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, filename);
};
