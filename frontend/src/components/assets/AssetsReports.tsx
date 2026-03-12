import React, { useState } from 'react';
import { AssetsData } from '../../types/assets';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: AssetsData;
}

const AssetsReports: React.FC<Props> = ({ data }) => {
    const [reportType, setReportType] = useState('inventory');

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = 'Asset_Report';

        if (reportType === 'inventory') {
            exportData = data.inventory.map(a => ({
                'ID': a.id,
                'Code': a.code,
                'Type': a.type,
                'Model': a.model,
                'Value': a.value,
                'Status': a.status
            }));
            fileName = 'Asset_Inventory_Registry';
        } else if (reportType === 'allocation') {
            exportData = data.allocations.map(alc => ({
                'Employee ID': alc.employeeId,
                'Employee Name': alc.employeeName,
                'Asset Code': alc.assetCode,
                'Issue Date': alc.issueDate,
                'Status': alc.acknowledgementSigned ? 'Acknowledged' : 'Pending'
            }));
            fileName = 'Asset_Allocation_Report';
        }

        exportToCSV(exportData, fileName);
    };

    const reports = [
        { id: 'inventory', label: 'Asset Inventory Report', icon: 'fa-warehouse' },
        { id: 'allocation', label: 'Employee Asset Details', icon: 'fa-id-badge' },
        { id: 'return', label: 'Issued vs Returned', icon: 'fa-exchange-alt' },
        { id: 'damaged', label: 'Damaged / Lost Assets', icon: 'fa-dumpster' },
        { id: 'exit', label: 'Exit Clearance Status', icon: 'fa-door-open' }
    ];

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Asset Analytics & Compliance Reports</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ padding: '10px 18px', border: '1px solid #cbd5e1', borderRadius: '10px', background: 'white', fontSize: '13px', fontWeight: 'bold' }}>
                        <i className="fas fa-file-import" style={{ marginRight: '8px' }}></i> Bulk Upload
                    </button>
                    <button onClick={handleExport} style={{ padding: '10px 22px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                        <i className="fas fa-file-excel" style={{ marginRight: '8px' }}></i> Export CSV
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '8px' }}>
                {reports.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setReportType(r.id)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '14px',
                            fontSize: '13px',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            background: reportType === r.id ? '#1e293b' : '#f8fafc',
                            color: reportType === r.id ? 'white' : '#64748b',
                            border: reportType === r.id ? 'none' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i className={`fas ${r.icon}`} style={{ marginRight: '10px' }}></i> {r.label}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {reportType === 'inventory' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Asset Code</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Asset Type</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Total Units</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Initially Issued</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>In Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>Laptop</td>
                                <td style={{ padding: '15px' }}>IT Hardware</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>45</td>
                                <td style={{ padding: '15px', textAlign: 'center', color: '#f59e0b', fontWeight: 'bold' }}>38</td>
                                <td style={{ padding: '15px', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>07</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>Mobile</td>
                                <td style={{ padding: '15px' }}>Communication</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>12</td>
                                <td style={{ padding: '15px', textAlign: 'center', color: '#f59e0b', fontWeight: 'bold' }}>05</td>
                                <td style={{ padding: '15px', textAlign: 'center', color: '#10b981', fontWeight: 'bold' }}>07</td>
                            </tr>
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AssetsReports;
