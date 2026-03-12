import React, { useState } from 'react';
import { TravelData } from '../../types/travel';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: TravelData;
}

const TravelReports: React.FC<Props> = ({ data }) => {
    const [reportType, setReportType] = useState('requests');

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = 'Travel_Report';

        if (reportType === 'requests') {
            exportData = data.requests.map(r => ({
                'Req No': r.id,
                'Employee': r.employeeName,
                'Type': r.type,
                'From': r.fromLocation,
                'To': r.toLocation,
                'Dates': `${r.fromDate} - ${r.toDate}`,
                'Status': r.status
            }));
            fileName = 'Travel_Request_Status';
        } else if (reportType === 'reimbursements') {
            exportData = data.claims.map(c => ({
                'Employee': c.employeeId,
                'Request': c.requestId,
                'Category': c.category,
                'Amount': c.amountClaimed,
                'Status': c.status
            }));
            fileName = 'Employee_Reimbursements';
        }

        exportToCSV(exportData, fileName);
    };

    const reports = [
        { id: 'requests', label: 'Travel Request Status', icon: 'fa-list-check' },
        { id: 'categories', label: 'Category-wise Expenses', icon: 'fa-tags' },
        { id: 'reimbursements', label: 'Employee Reimbursements', icon: 'fa-wallet' },
        { id: 'advances', label: 'Advance vs Settlement', icon: 'fa-balance-scale' },
        { id: 'compliance', label: 'Policy Compliance Audit', icon: 'fa-check-double' }
    ];

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#0c4a6e' }}>Travel Analytics & Expenditure Audits</h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ padding: '10px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                        <i className="fas fa-file-import" style={{ marginRight: '8px' }}></i> Import Bulk Claims
                    </button>
                    <button onClick={handleExport} style={{ padding: '10px 25px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                        <i className="fas fa-file-excel" style={{ marginRight: '8px' }}></i> Export All Data
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '8px' }}>
                {reports.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setReportType(r.id)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '16px',
                            fontSize: '13px',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            background: reportType === r.id ? '#0c4a6e' : '#f8fafc',
                            color: reportType === r.id ? 'white' : '#64748b',
                            border: reportType === r.id ? 'none' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <i className={`fas ${r.icon}`} style={{ marginRight: '10px' }}></i> {r.label}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {reportType === 'requests' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Req No</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Route</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Dates</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.requests.map(r => (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{r.id}</td>
                                    <td style={{ padding: '15px' }}>{r.employeeName}</td>
                                    <td style={{ padding: '15px' }}>{r.fromLocation} to {r.toLocation}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{r.fromDate} - {r.toDate}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{ color: '#0ea5e9', fontWeight: 'bold' }}>{r.status}</span>
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

export default TravelReports;
