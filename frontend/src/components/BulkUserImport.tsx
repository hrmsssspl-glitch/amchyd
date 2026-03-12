import React, { useState } from 'react';
import { User } from '../types';
import {
    parseCSVFile,
    parseExcelFile,
    downloadCSVTemplate,
    generateExcelTemplate,
    BulkUserData,
    ImportResult
} from '../utils/bulkUserImport';
import CSVConverter from './CSVConverter';

interface BulkUserImportProps {
    currentUser: User;
    onImportComplete: (users: BulkUserData[]) => void;
    onClose: () => void;
}

const BulkUserImport: React.FC<BulkUserImportProps> = ({ currentUser, onImportComplete, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload');
    const [showConverter, setShowConverter] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImportResult(null);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        setIsProcessing(true);

        try {
            let result: ImportResult;

            if (file.name.endsWith('.csv')) {
                result = await parseCSVFile(file);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                result = await parseExcelFile(file);
            } else {
                alert('Please upload a CSV or Excel file');
                setIsProcessing(false);
                return;
            }

            setImportResult(result);
            setStep('preview');
        } catch (error: any) {
            alert(`Error parsing file: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmImport = () => {
        if (importResult && importResult.users.length > 0) {
            onImportComplete(importResult.users);
            setStep('complete');
        }
    };

    const handleDownloadCSVTemplate = () => {
        downloadCSVTemplate();
    };

    const handleDownloadExcelTemplate = () => {
        generateExcelTemplate();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '1000px',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '25px',
                    borderBottom: '2px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc'
                }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-file-upload" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            Bulk User Import
                        </h2>
                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            Upload CSV or Excel file to import multiple users at once
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 12px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '25px' }}>
                    {/* Step 1: Upload */}
                    {step === 'upload' && (
                        <>
                            {/* Download Templates */}
                            <div style={{
                                background: '#eff6ff',
                                border: '2px dashed #5d5fef',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                    <i className="fas fa-download" style={{ marginRight: '8px', color: '#5d5fef' }}></i>
                                    Step 1: Download Template
                                </h3>
                                <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>
                                    Download a template file with sample data and required format
                                </p>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={handleDownloadCSVTemplate}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#10b981',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="fas fa-file-csv"></i>
                                        Download CSV Template
                                    </button>
                                    <button
                                        onClick={handleDownloadExcelTemplate}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#059669',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className="fas fa-file-excel"></i>
                                        Download Excel Template
                                    </button>
                                </div>
                            </div>

                            {/* Required Format Info */}
                            <div style={{
                                background: '#fef3c7',
                                border: '1px solid #fbbf24',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                    <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
                                    Required Format
                                </h3>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    <p style={{ margin: '0 0 10px 0' }}><strong>Required Columns:</strong></p>
                                    <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
                                        <li><strong>username</strong> - Login ID (e.g., EMP001, admin)</li>
                                        <li><strong>name</strong> - Full name</li>
                                        <li><strong>password</strong> - Initial password</li>
                                        <li><strong>role</strong> - superadmin, admin, hr_manager, or employee</li>
                                    </ul>
                                    <p style={{ margin: '10px 0' }}><strong>For Employee Role (Additional Required):</strong></p>
                                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                        <li><strong>employeeId</strong> - Employee ID</li>
                                        <li><strong>state</strong> - State name</li>
                                        <li><strong>branch</strong> - Branch name</li>
                                    </ul>
                                    <p style={{ margin: '10px 0' }}><strong>Optional Columns:</strong></p>
                                    <ul style={{ margin: '0', paddingLeft: '20px' }}>
                                        <li><strong>email</strong> - Email address</li>
                                        <li><strong>phone</strong> - Phone number</li>
                                    </ul>
                                </div>
                            </div>

                            {/* CSV Converter Helper */}
                            <div style={{
                                background: '#f0fdf4',
                                border: '2px solid #10b981',
                                borderRadius: '12px',
                                padding: '20px',
                                marginBottom: '25px'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#065f46', fontSize: '16px', fontWeight: '600' }}>
                                    <i className="fas fa-magic" style={{ marginRight: '8px' }}></i>
                                    Need Help Converting Your File?
                                </h3>
                                <p style={{ margin: '0 0 15px 0', color: '#047857', fontSize: '14px' }}>
                                    If you have an Employee Master export that doesn't match our format, use our converter tool to automatically transform it!
                                </p>
                                <button
                                    onClick={() => setShowConverter(true)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className="fas fa-exchange-alt"></i>
                                    Open CSV Converter
                                </button>
                            </div>

                            {/* Upload File */}
                            <div style={{
                                background: '#f8fafc',
                                border: '2px dashed #cbd5e1',
                                borderRadius: '12px',
                                padding: '30px',
                                textAlign: 'center'
                            }}>
                                <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                    <i className="fas fa-cloud-upload-alt" style={{ marginRight: '8px', color: '#5d5fef' }}></i>
                                    Step 2: Upload File
                                </h3>
                                <input
                                    type="file"
                                    accept=".csv,.xlsx,.xls"
                                    onChange={handleFileChange}
                                    style={{ marginBottom: '15px' }}
                                />
                                {file && (
                                    <div style={{ marginTop: '15px', padding: '10px', background: '#dbeafe', borderRadius: '8px', fontSize: '14px', color: '#1e40af' }}>
                                        <i className="fas fa-file" style={{ marginRight: '8px' }}></i>
                                        Selected: {file.name}
                                    </div>
                                )}
                                <button
                                    onClick={handleFileUpload}
                                    disabled={!file || isProcessing}
                                    style={{
                                        marginTop: '15px',
                                        padding: '12px 30px',
                                        background: file && !isProcessing ? '#5d5fef' : '#cbd5e1',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: file && !isProcessing ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    {isProcessing ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
                                            Upload and Validate
                                        </>
                                    )}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 2: Preview */}
                    {step === 'preview' && importResult && (
                        <>
                            {/* Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e40af' }}>{importResult.totalRows}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Total Rows</div>
                                </div>
                                <div style={{ background: '#d1fae5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#065f46' }}>{importResult.validRows}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Valid Users</div>
                                </div>
                                <div style={{ background: '#fee2e2', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>{importResult.errors.length}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Errors</div>
                                </div>
                            </div>

                            {/* Errors */}
                            {importResult.errors.length > 0 && (
                                <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '12px', padding: '20px', marginBottom: '25px' }}>
                                    <h3 style={{ margin: '0 0 15px 0', color: '#dc2626', fontSize: '16px', fontWeight: '600' }}>
                                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                                        Validation Errors ({importResult.errors.length})
                                    </h3>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {importResult.errors.map((error, idx) => (
                                            <div key={idx} style={{ padding: '8px', background: 'white', borderRadius: '6px', marginBottom: '8px', fontSize: '13px' }}>
                                                <strong>Row {error.row}:</strong> {error.error} (Field: {error.field}, Value: "{error.value}")
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Valid Users Preview */}
                            {importResult.users.length > 0 && (
                                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px' }}>
                                    <h3 style={{ margin: 0, padding: '15px', borderBottom: '1px solid #e2e8f0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                        <i className="fas fa-users" style={{ marginRight: '8px', color: '#10b981' }}></i>
                                        Valid Users to Import ({importResult.users.length})
                                    </h3>
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                                            <thead style={{ background: '#f8fafc', position: 'sticky', top: 0 }}>
                                                <tr>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Username</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Name</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Employee ID</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>State</th>
                                                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e2e8f0' }}>Branch</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {importResult.users.map((user, idx) => (
                                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                        <td style={{ padding: '12px', fontWeight: '600', color: '#5d5fef' }}>{user.username}</td>
                                                        <td style={{ padding: '12px' }}>{user.name}</td>
                                                        <td style={{ padding: '12px' }}>
                                                            <span style={{
                                                                padding: '4px 8px',
                                                                background: '#dbeafe',
                                                                color: '#1e40af',
                                                                borderRadius: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600'
                                                            }}>
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td style={{ padding: '12px', color: '#64748b' }}>{user.employeeId || '-'}</td>
                                                        <td style={{ padding: '12px', color: '#64748b' }}>{user.state || '-'}</td>
                                                        <td style={{ padding: '12px', color: '#64748b' }}>{user.branch || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => { setStep('upload'); setImportResult(null); setFile(null); }}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirmImport}
                                    disabled={importResult.users.length === 0}
                                    style={{
                                        padding: '10px 20px',
                                        background: importResult.users.length > 0 ? '#10b981' : '#cbd5e1',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: importResult.users.length > 0 ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                                    Import {importResult.users.length} User(s)
                                </button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Complete */}
                    {step === 'complete' && importResult && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '60px', color: '#10b981', marginBottom: '20px' }}>
                                <i className="fas fa-check-circle"></i>
                            </div>
                            <h3 style={{ margin: '0 0 10px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                                Import Successful!
                            </h3>
                            <p style={{ margin: '0 0 30px 0', color: '#64748b', fontSize: '16px' }}>
                                Successfully imported {importResult.users.length} user(s)
                            </p>
                            <button
                                onClick={onClose}
                                style={{
                                    padding: '12px 30px',
                                    background: '#5d5fef',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CSV Converter Modal */}
            {showConverter && (
                <CSVConverter
                    onClose={() => setShowConverter(false)}
                    onUseConverted={(convertedFile) => {
                        setFile(convertedFile);
                        setShowConverter(false);
                    }}
                />
            )}
        </div>
    );
};

export default BulkUserImport;
