import React, { useState } from 'react';
import { PMSData } from '../../types/pms';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: PMSData;
}

const PerformanceReports: React.FC<Props> = ({ data }) => {
    const [reportType, setReportType] = useState('performance');

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = 'Performance_Report';

        if (reportType === 'performance') {
            exportData = data.appraisals.map(a => ({
                'ID': a.employeeId,
                'Name': a.employeeName,
                'Manager Rating': a.managerRating,
                'Normalization': a.normalizedRating || 'Pending',
                'Status': a.stage
            }));
            fileName = 'Employee_Performance';
        } else if (reportType === 'increment') {
            exportData = data.appraisals.map(a => ({
                'ID': a.employeeId,
                'Name': a.employeeName,
                'Final Rating': a.managerRating,
                'Increment %': a.incrementPercentage,
                'Effective Date': '2024-04-01'
            }));
            fileName = 'Increment_Recommendations';
        } else if (reportType === 'incentive') {
            exportData = data.appraisals.map(a => ({
                'ID': a.employeeId,
                'Name': a.employeeName,
                'Rating': a.managerRating,
                'Incentive Amount': a.incentiveAmount || 0
            }));
            fileName = 'Incentive_Report';
        }

        exportToCSV(exportData, fileName);
    };

    const navItems = [
        { id: 'performance', label: 'Performance Report', icon: 'fa-star' },
        { id: 'dept', label: 'Department Summary', icon: 'fa-sitemap' },
        { id: 'increment', label: 'Increment Recommendations', icon: 'fa-trending-up' },
        { id: 'promotion', label: 'Promotion Registry', icon: 'fa-user-graduate' },
        { id: 'incentive', label: 'Incentive / Reward Report', icon: 'fa-gift' }
    ];

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Performance & Reward Intelligence</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '8px 15px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', fontSize: '13px' }}>
                        <i className="fas fa-file-import"></i> Bulk Import KRAs
                    </button>
                    <button onClick={handleExport} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px' }}>
                        <i className="fas fa-file-excel"></i> Export Analytics
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '5px' }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setReportType(item.id)}
                        style={{
                            padding: '12px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap',
                            background: reportType === item.id ? '#1e293b' : '#f8fafc',
                            color: reportType === item.id ? 'white' : '#64748b',
                            border: reportType === item.id ? 'none' : '1px solid #e2e8f0',
                            cursor: 'pointer'
                        }}
                    >
                        <i className={`fas ${item.icon}`} style={{ marginRight: '10px' }}></i> {item.label}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {reportType === 'performance' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Final Score</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Category</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Appraisal Stage</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.appraisals.map((a, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{a.employeeName}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{a.employeeId}</div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: '#6366f1' }}>{a.managerRating}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>EXCELLENT</span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{a.stage} Review</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{a.submissionDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {reportType === 'increment' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Final Rating</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Increment Rec.</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Effective From</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>HR Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.appraisals.map((a, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{a.employeeName}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{a.managerRating}</td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#10b981' }}>{a.incrementPercentage}%</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>01 Apr 2024</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button style={{ padding: '5px 12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px' }}>Post to Payroll</button>
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

export default PerformanceReports;
