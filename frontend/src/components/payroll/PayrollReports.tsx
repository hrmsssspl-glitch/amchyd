import React, { useState } from 'react';
import { exportToCSV } from '../../utils/csvExport';

const PayrollReports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'summary' | 'payslip' | 'statutory'>('summary');

    // Dummy Data
    const summaryData = [
        { month: 'Jan 2024', totalEmployees: 245, grossSalary: 12500000, totalDeductions: 1500000, netPay: 11000000, status: 'Processed' },
        { month: 'Dec 2023', totalEmployees: 240, grossSalary: 12200000, totalDeductions: 1450000, netPay: 10750000, status: 'Locked' },
    ];

    const employeeData = [
        { id: 'EMP001', name: 'John Doe', month: 'Jan 2024', gross: 85000, deductions: 10000, net: 75000 },
        { id: 'EMP002', name: 'Jane Smith', month: 'Jan 2024', gross: 92000, deductions: 12000, net: 80000 },
    ];

    const complianceData = [
        { month: 'Jan 2024', pf: 450000, esic: 120000, pt: 85000, tds: 350000, status: 'Pending' },
        { month: 'Dec 2023', pf: 440000, esic: 115000, pt: 84000, tds: 340000, status: 'Filed' },
    ];

    const handleDownload = () => {
        let exportData: any[] = [];
        let fileName = 'Payroll_Report';

        if (activeTab === 'summary') {
            exportData = summaryData;
            fileName = 'Payroll_Summary_Report';
        } else if (activeTab === 'payslip') {
            exportData = employeeData;
            fileName = 'Employee_Payslip_Report';
        } else if (activeTab === 'statutory') {
            exportData = complianceData;
            fileName = 'Statutory_Compliance_Report';
        }

        exportToCSV(exportData, fileName);
    };

    return (
        <div className="payroll-reports-container" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#6366f1', margin: 0 }}>Payroll Reports</h3>
                <button
                    onClick={handleDownload}
                    style={{
                        padding: '8px 16px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fas fa-file-excel"></i> Export to CSV
                </button>
            </div>

            <div className="report-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <button
                    onClick={() => setActiveTab('summary')}
                    style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: activeTab === 'summary' ? '#4f46e5' : '#f1f5f9', color: activeTab === 'summary' ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
                >
                    Payroll Summary
                </button>
                <button
                    onClick={() => setActiveTab('payslip')}
                    style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: activeTab === 'payslip' ? '#4f46e5' : '#f1f5f9', color: activeTab === 'payslip' ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
                >
                    Employee Payslips
                </button>
                <button
                    onClick={() => setActiveTab('statutory')}
                    style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: activeTab === 'statutory' ? '#4f46e5' : '#f1f5f9', color: activeTab === 'statutory' ? 'white' : '#64748b', cursor: 'pointer', fontWeight: 600 }}
                >
                    Statutory Compliance
                </button>
            </div>

            {/* Tables */}
            <div className="report-content">
                {activeTab === 'summary' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Salary Month</th>
                                <th style={{ padding: '12px' }}>Total Employees</th>
                                <th style={{ padding: '12px' }}>Gross Salary</th>
                                <th style={{ padding: '12px' }}>Total Deductions</th>
                                <th style={{ padding: '12px' }}>Net Pay</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summaryData.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}>{row.month}</td>
                                    <td style={{ padding: '12px' }}>{row.totalEmployees}</td>
                                    <td style={{ padding: '12px' }}>₹{row.grossSalary.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>₹{row.totalDeductions.toLocaleString()}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{row.netPay.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: row.status === 'Processed' ? '#dcfce7' : '#e0e7ff', color: row.status === 'Processed' ? '#166534' : '#3730a3' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'payslip' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Employee ID</th>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Month</th>
                                <th style={{ padding: '12px' }}>Gross</th>
                                <th style={{ padding: '12px' }}>Deductions</th>
                                <th style={{ padding: '12px' }}>Net Pay</th>
                                <th style={{ padding: '12px' }}>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeData.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}>{row.id}</td>
                                    <td style={{ padding: '12px' }}>{row.name}</td>
                                    <td style={{ padding: '12px' }}>{row.month}</td>
                                    <td style={{ padding: '12px' }}>₹{row.gross.toLocaleString()}</td>
                                    <td style={{ padding: '12px', color: '#ef4444' }}>₹{row.deductions.toLocaleString()}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{row.net.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        <button style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                                            <i className="fas fa-file-pdf"></i> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'statutory' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', color: '#475569', textAlign: 'left' }}>
                                <th style={{ padding: '12px' }}>Month</th>
                                <th style={{ padding: '12px' }}>PF Amount</th>
                                <th style={{ padding: '12px' }}>ESIC Amount</th>
                                <th style={{ padding: '12px' }}>PT</th>
                                <th style={{ padding: '12px' }}>TDS</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complianceData.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}>{row.month}</td>
                                    <td style={{ padding: '12px' }}>₹{row.pf.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>₹{row.esic.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>₹{row.pt.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>₹{row.tds.toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', background: row.status === 'Filed' ? '#dcfce7' : '#fee2e2', color: row.status === 'Filed' ? '#166534' : '#991b1b' }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PayrollReports;
