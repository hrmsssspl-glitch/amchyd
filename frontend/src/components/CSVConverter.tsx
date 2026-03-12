import React, { useState } from 'react';
import {
    convertEmployeeMasterToImportFormat,
    downloadConvertedCSV,
    downloadConvertedExcel,
    ConversionResult
} from '../utils/csvConverter';

interface CSVConverterProps {
    onClose: () => void;
    onUseConverted: (file: File) => void;
}

const CSVConverter: React.FC<CSVConverterProps> = ({ onClose, onUseConverted }) => {
    const [file, setFile] = useState<File | null>(null);
    const [defaultPassword, setDefaultPassword] = useState('emp123');
    const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setConversionResult(null);
        }
    };

    const handleConvert = async () => {
        if (!file) {
            alert('Please select a file');
            return;
        }

        setIsConverting(true);

        try {
            const result = await convertEmployeeMasterToImportFormat(file, defaultPassword);
            setConversionResult(result);
        } catch (error: any) {
            alert(`Error converting file: ${error.message}`);
        } finally {
            setIsConverting(false);
        }
    };

    const handleDownloadCSV = () => {
        if (conversionResult && conversionResult.convertedRows.length > 0) {
            downloadConvertedCSV(conversionResult.convertedRows, 'bulk_import_ready.csv');
        }
    };

    const handleDownloadExcel = () => {
        if (conversionResult && conversionResult.convertedRows.length > 0) {
            downloadConvertedExcel(conversionResult.convertedRows, 'bulk_import_ready.xlsx');
        }
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
            zIndex: 1001
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '900px',
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
                            <i className="fas fa-exchange-alt" style={{ marginRight: '12px', color: '#10b981' }}></i>
                            CSV Format Converter
                        </h2>
                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                            Convert your Employee Master export to Bulk Import format
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
                    {/* Instructions */}
                    <div style={{
                        background: '#dbeafe',
                        border: '1px solid #3b82f6',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '25px'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#1e40af', fontSize: '16px', fontWeight: '600' }}>
                            <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                            How It Works
                        </h3>
                        <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#1e40af', lineHeight: '1.8' }}>
                            <li>Upload your Employee Master CSV or Excel file</li>
                            <li>Set a default password for all employees</li>
                            <li>Click "Convert" - the system will automatically map columns</li>
                            <li>Download the converted file in the correct format</li>
                            <li>Use the converted file for Bulk Import</li>
                        </ol>
                    </div>

                    {/* File Upload */}
                    <div style={{
                        background: '#f8fafc',
                        border: '2px dashed #cbd5e1',
                        borderRadius: '12px',
                        padding: '25px',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                            <i className="fas fa-file-upload" style={{ marginRight: '8px', color: '#10b981' }}></i>
                            Step 1: Upload Your File
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
                    </div>

                    {/* Password Setting */}
                    <div style={{
                        background: '#fef3c7',
                        border: '1px solid #fbbf24',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', color: '#92400e', fontSize: '16px', fontWeight: '600' }}>
                            <i className="fas fa-key" style={{ marginRight: '8px' }}></i>
                            Step 2: Set Default Password
                        </h3>
                        <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#78350f' }}>
                            This password will be assigned to all employees. They can change it after first login.
                        </p>
                        <input
                            type="text"
                            value={defaultPassword}
                            onChange={(e) => setDefaultPassword(e.target.value)}
                            placeholder="Default password for all employees"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1.5px solid #fbbf24',
                                borderRadius: '8px',
                                fontSize: '14px'
                            }}
                        />
                    </div>

                    {/* Convert Button */}
                    <button
                        onClick={handleConvert}
                        disabled={!file || isConverting}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: file && !isConverting ? '#10b981' : '#cbd5e1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: file && !isConverting ? 'pointer' : 'not-allowed',
                            fontSize: '16px',
                            fontWeight: '600',
                            marginBottom: '25px'
                        }}
                    >
                        {isConverting ? (
                            <>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                                Converting...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-magic" style={{ marginRight: '8px' }}></i>
                                Convert to Import Format
                            </>
                        )}
                    </button>

                    {/* Conversion Result */}
                    {conversionResult && (
                        <>
                            {/* Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
                                <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e40af' }}>{conversionResult.totalRows}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Total Rows</div>
                                </div>
                                <div style={{ background: '#d1fae5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#065f46' }}>{conversionResult.convertedCount}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Converted</div>
                                </div>
                                <div style={{ background: '#fee2e2', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>{conversionResult.errors.length}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Errors</div>
                                </div>
                            </div>

                            {/* Errors */}
                            {conversionResult.errors.length > 0 && (
                                <div style={{ background: '#fee2e2', border: '1px solid #dc2626', borderRadius: '12px', padding: '20px', marginBottom: '25px' }}>
                                    <h3 style={{ margin: '0 0 15px 0', color: '#dc2626', fontSize: '16px', fontWeight: '600' }}>
                                        <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                                        Conversion Warnings ({conversionResult.errors.length})
                                    </h3>
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        {conversionResult.errors.map((error, idx) => (
                                            <div key={idx} style={{ padding: '6px', background: 'white', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                                                {error}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Success - Download Options */}
                            {conversionResult.convertedCount > 0 && (
                                <div style={{ background: '#d1fae5', border: '2px solid #10b981', borderRadius: '12px', padding: '25px' }}>
                                    <h3 style={{ margin: '0 0 15px 0', color: '#065f46', fontSize: '18px', fontWeight: '600', textAlign: 'center' }}>
                                        <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                                        Conversion Successful!
                                    </h3>
                                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#065f46', textAlign: 'center' }}>
                                        {conversionResult.convertedCount} employee(s) ready for import
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                        <button
                                            onClick={handleDownloadCSV}
                                            style={{
                                                padding: '12px 20px',
                                                background: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <i className="fas fa-file-csv"></i>
                                            Download as CSV
                                        </button>
                                        <button
                                            onClick={handleDownloadExcel}
                                            style={{
                                                padding: '12px 20px',
                                                background: '#059669',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <i className="fas fa-file-excel"></i>
                                            Download as Excel
                                        </button>
                                    </div>
                                    <div style={{
                                        marginTop: '15px',
                                        padding: '12px',
                                        background: 'white',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#065f46',
                                        textAlign: 'center'
                                    }}>
                                        <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
                                        After downloading, use the converted file in the Bulk Import feature
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CSVConverter;
