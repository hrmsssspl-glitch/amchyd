import React, { useRef } from 'react';
import { exportToCSV } from '../../utils/csvExport';
import { flattenEmployee, unflattenEmployee } from '../../utils/employeeCsvUtils';
import { EmployeeMasterData } from '../../types/employee';

interface BulkEmployeeUploadProps {
    employees: EmployeeMasterData[];
    onImport: (newEmployees: EmployeeMasterData[]) => void;
}

const BulkEmployeeUpload: React.FC<BulkEmployeeUploadProps> = ({ employees, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportAll = () => {
        const flattenedData = employees.map(flattenEmployee);
        exportToCSV(flattenedData, 'Employee_Master_Export');
    };

    const handleDownloadTemplate = () => {
        // Create a dummy employee for template
        const templateEmployee: EmployeeMasterData = {
            personal: { surname: 'Doe', name: 'John', fatherName: 'Senior Doe', motherName: 'Jane Doe Senior', nationality: 'Indian', religion: 'Christianity', dob: '1990-01-01', gender: 'Male', maritalStatus: 'Single', physicalDisabilities: 'None', bloodGroup: 'O+' },
            contact: { personalNumber: '9988776655', alternateContactNumber: '9988776644', personalEmail: 'john@example.com', officialEmail: 'john.doe@company.com', presentAddress: '123 St, Hyderabad', permanentAddress: '123 St, Hyderabad', permanentAddressContactNumber: '9988776655' },
            kyc: { panNo: 'ABCDE1234F', aadharNo: '123412341234' },
            bank: { bankName: 'HDFC', accountNo: '1234567890', branch: 'Madhapur', ifscCode: 'HDFC0001234' },
            employment: { empNo: 'EMP001', doj: '2023-01-01', designation: 'Executive', department: 'SALES', branch: 'Hyderabad', reportingManager: 'Manager Name', rolls: 'On Roll' },
            education: [],
            experience: [],
            family: [],
            emergency: [],
            medical: { allergic: 'None', bloodPressure: 'Normal', sugar: 'Normal', eyeSight: 'Normal', majorIllness: 'None' },
            languages: { telugu: true, english: true, hindi: true }
        };
        const templateData = [flattenEmployee(templateEmployee)];
        exportToCSV(templateData, 'Employee_Master_Template');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            if (!text) return;

            // Simple CSV Parser
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.replace(/^"(.*)"$/, '$1').trim());

            const importedEmployees: EmployeeMasterData[] = [];

            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue;

                // Regex to handle quoted commas
                const rowValues = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
                const cleanValues = rowValues.map(v => v.replace(/^"(.*)"$/, '$1').trim());

                const flatObj: any = {};
                headers.forEach((header, index) => {
                    flatObj[header] = cleanValues[index];
                });

                importedEmployees.push(unflattenEmployee(flatObj));
            }

            onImport(importedEmployees);
            alert(`Successfully imported ${importedEmployees.length} employees!`);
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>
                <i className="fas fa-file-import" style={{ fontSize: '40px', color: '#6366f1', marginBottom: '15px' }}></i>
                <h3 style={{ color: '#1e293b', margin: '0 0 10px 0' }}>Bulk Employee Management</h3>
                <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
                    Manage your entire employee database at once. Download the template, fill it with data, and upload it back.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={handleDownloadTemplate}
                    style={{ padding: '12px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-download"></i> Download Template
                </button>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ padding: '12px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-upload"></i> Upload CSV Master
                </button>

                <button
                    onClick={handleExportAll}
                    style={{ padding: '12px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-export"></i> Export All Employees
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv"
                    style={{ display: 'none' }}
                />
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', display: 'inline-block' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
                    <i className="fas fa-info-circle"></i> <strong>Note:</strong> Quoted commas in fields are supported. Ensure headers remain unchanged.
                </p>
            </div>
        </div>
    );
};

export default BulkEmployeeUpload;
