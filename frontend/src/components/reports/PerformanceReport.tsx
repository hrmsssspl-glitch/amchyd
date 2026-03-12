import React from 'react';
import { PerformanceSummary } from '../../types/reports';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: PerformanceSummary[];
}

const PerformanceReport: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Performance & Reward Analytics</h3>
                <button
                    onClick={() => exportToCSV(data, 'Performance_Report')}
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
                            <th style={{ padding: '15px', color: '#64748b' }}>PMS Rating</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Increment</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Promotion</th>
                            <th style={{ padding: '15px', color: '#64748b', fontWeight: 800 }}>Incentive</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{p.employeeId} • {p.department}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#1e293b' }}>
                                        <i className="fas fa-star" style={{ color: '#f59e0b' }}></i>
                                        {p.rating}
                                    </div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ color: p.increment ? '#10b981' : '#f43f5e' }}>
                                        <i className={`fas ${p.increment ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                                        {p.increment ? ' Recommended' : ' No'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ color: p.promotion ? '#10b981' : '#64748b' }}>
                                        <i className={`fas ${p.promotion ? 'fa-arrow-circle-up' : 'fa-minus-circle'}`}></i>
                                        {p.promotion ? ' Potential' : ' No'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 800, color: '#166534' }}>₹{p.incentive.toLocaleString()}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: p.rating >= 4 ? '#ecfdf5' : '#f1f5f9',
                                        color: p.rating >= 4 ? '#059669' : '#475569'
                                    }}>{p.rating >= 4 ? 'TOP PERFORMER' : 'STANDARD'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PerformanceReport;
