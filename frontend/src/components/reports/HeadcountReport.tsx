import React from 'react';
import { HeadcountData } from '../../types/reports';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: HeadcountData[];
}

const HeadcountReport: React.FC<Props> = ({ data }) => {
    const handleExport = () => {
        exportToCSV(data, 'Headcount_Report');
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Global Headcount Analysis</h3>
                <button
                    onClick={handleExport}
                    style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-excel"></i> Export CSV
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Department</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Designation</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Male</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Female</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Permanent</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Contract</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Probation</th>
                            <th style={{ padding: '15px', color: '#64748b', fontWeight: 800 }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((h, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px', fontWeight: 700, color: '#1e293b' }}>{h.department}</td>
                                <td style={{ padding: '15px', color: '#475569' }}>{h.designation}</td>
                                <td style={{ padding: '15px', color: '#3b82f6' }}>{h.male}</td>
                                <td style={{ padding: '15px', color: '#ec4899' }}>{h.female}</td>
                                <td style={{ padding: '15px', color: '#166534' }}>{h.permanent}</td>
                                <td style={{ padding: '15px', color: '#475569' }}>{h.contract}</td>
                                <td style={{ padding: '15px', color: '#475569' }}>{h.probation}</td>
                                <td style={{ padding: '15px', fontWeight: 800, color: '#6366f1' }}>{h.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HeadcountReport;
