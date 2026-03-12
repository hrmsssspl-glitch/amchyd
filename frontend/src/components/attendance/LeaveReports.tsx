import React, { useState } from 'react';
import { LeaveApplication, LeaveBalance, LeaveEncashment } from '../../types/leave';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    applications: LeaveApplication[];
    balances: LeaveBalance[];
    encashments: LeaveEncashment[];
}

const LeaveReports: React.FC<Props> = ({ applications, balances, encashments }) => {
    const [reportType, setReportType] = useState('application');

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = 'Report';

        if (reportType === 'application') {
            exportData = applications;
            fileName = 'Leave_Applications';
        } else if (reportType === 'balance') {
            exportData = balances;
            fileName = 'Leave_Balances';
        } else if (reportType === 'encashment') {
            exportData = encashments;
            fileName = 'Leave_Encashments';
        } else if (reportType === 'manhours') {
            exportData = applications.map(app => ({
                'Employee ID': app.employeeId,
                'Name': app.employeeName,
                'Leave Type': app.leaveType,
                'Days': app.numberOfDays,
                'Attendance Status': 'Leave Posted',
                'Purpose': 'Safety/Payroll Verification'
            }));
            fileName = 'Manhours_Safety_Report';
        }

        exportToCSV(exportData, fileName);
    };

    const reports = [
        { id: 'application', label: 'Leave Application Report', icon: 'fa-file-invoice' },
        { id: 'balance', label: 'Leave Balance Report', icon: 'fa-balance-scale' },
        { id: 'approval', label: 'Approved/Rejected Report', icon: 'fa-check-double' },
        { id: 'encashment', label: 'Leave Encashment Report', icon: 'fa-money-bill-alt' },
        { id: 'manhours', label: 'Man Hours Security Report', icon: 'fa-hard-hat' }
    ];

    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b' }}>
                    <i className="fas fa-chart-bar" style={{ color: '#4f46e5' }}></i>
                    Leave Management Reports & Analytics
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => document.getElementById('leave-import-input')?.click()}
                        style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <i className="fas fa-file-import"></i> Bulk Import
                    </button>
                    <input
                        id="leave-import-input"
                        type="file"
                        accept=".csv"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const text = event.target?.result as string;
                                    console.log('Importing Leave Data:', text);
                                    alert('CSV Data imported successfully (simulated)');
                                };
                                reader.readAsText(file);
                            }
                        }}
                    />
                    <button
                        onClick={handleExport}
                        style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
                    >
                        <i className="fas fa-file-excel"></i> Export Report
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                {reports.map(report => (
                    <div
                        key={report.id}
                        onClick={() => setReportType(report.id)}
                        style={{
                            padding: '12px 20px',
                            background: reportType === report.id ? '#4f46e5' : '#f8fafc',
                            color: reportType === report.id ? 'white' : '#64748b',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: reportType === report.id ? 'none' : '1px solid #e2e8f0',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <i className={`fas ${report.icon}`}></i>
                        {report.label}
                    </div>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {reportType === 'application' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Emp ID</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>From</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>To</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Days</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px' }}>{app.employeeId}</td>
                                    <td style={{ padding: '12px' }}>{app.employeeName}</td>
                                    <td style={{ padding: '12px' }}>{app.leaveType}</td>
                                    <td style={{ padding: '12px' }}>{app.fromDate}</td>
                                    <td style={{ padding: '12px' }}>{app.toDate}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{app.numberOfDays}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{app.overallStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {reportType === 'balance' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Emp ID</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>CL</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>SL</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>EL</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>CO</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {balances.map((b, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px' }}>{b.employeeId}</td>
                                    <td style={{ padding: '12px' }}>{b.employeeName}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{b.cl}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{b.sl}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{b.el}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{b.co}</td>
                                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{b.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {reportType === 'manhours' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#1e293b', color: 'white' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Employee Name</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Leave Category</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Days</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Attendance Verification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.filter(a => a.overallStatus === 'Approved').map((app, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '12px' }}>{app.employeeId}</td>
                                    <td style={{ padding: '12px' }}>{app.employeeName}</td>
                                    <td style={{ padding: '12px' }}>{app.leaveType}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{app.numberOfDays}</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Leave Posted to Attendance</span>
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

export default LeaveReports;
