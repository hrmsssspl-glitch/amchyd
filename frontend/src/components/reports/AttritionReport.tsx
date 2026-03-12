import React from 'react';
import { AttritionData } from '../../types/reports';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: AttritionData[];
}

const AttritionReport: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Attrition & Exit Trend Analysis</h3>
                <button
                    onClick={() => exportToCSV(data, 'Attrition_Report')}
                    style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-excel"></i> Export CSV
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Designation</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Joining Date</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Last Working Day</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Exit Type</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((a, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{a.name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.employeeId} • {a.department}</div>
                                </td>
                                <td style={{ padding: '15px' }}>{a.designation}</td>
                                <td style={{ padding: '15px' }}>{a.joiningDate}</td>
                                <td style={{ padding: '15px', color: '#dc2626', fontWeight: 600 }}>{a.lastDay}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: a.exitType === 'Voluntary' ? '#ecfdf5' : '#fff7ed',
                                        color: a.exitType === 'Voluntary' ? '#059669' : '#c2410b'
                                    }}>{a.exitType}</span>
                                </td>
                                <td style={{ padding: '15px', color: '#475569' }}>{a.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#fef2f2', borderRadius: '15px', border: '1px solid #fee2e2' }}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', color: '#ef4444' }}><i className="fas fa-exclamation-triangle"></i></div>
                    <div>
                        <h5 style={{ margin: '0 0 5px 0', color: '#991b1b' }}>High Attrition Alert: IT Department</h5>
                        <p style={{ margin: 0, color: '#b91c1c', fontSize: '13px' }}>The IT department has seen a 12% increase in voluntary exits over the last quarter. Reviewing compensation and work-life balance policies is recommended.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttritionReport;
