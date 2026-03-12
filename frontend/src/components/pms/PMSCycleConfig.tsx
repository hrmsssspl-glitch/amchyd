import React from 'react';
import { PMSCycle } from '../../types/pms';

interface Props {
    cycles: PMSCycle[];
}

const PMSCycleConfig: React.FC<Props> = ({ cycles }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Appraisal Cycle Configuration</h3>
                <button style={{ padding: '10px 20px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    + Initialize New Cycle
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', color: '#64748b' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Cycle ID</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Period</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Date Range</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Department / Grade</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cycles.map(cycle => (
                            <tr key={cycle.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#6366f1' }}>{cycle.id}</td>
                                <td style={{ padding: '15px' }}>{cycle.period}</td>
                                <td style={{ padding: '15px' }}>{cycle.fromDate} to {cycle.toDate}</td>
                                <td style={{ padding: '15px' }}>{cycle.department} / {cycle.grade}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                        background: cycle.status === 'In Progress' ? '#e0f2fe' : '#f1f5f9',
                                        color: cycle.status === 'In Progress' ? '#0369a1' : '#475569'
                                    }}>{cycle.status}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#6366f1', cursor: 'pointer' }}><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '25px', padding: '20px', background: '#eef2ff', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ minWidth: '45px', minHeight: '45px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <i className="fas fa-info-circle fa-lg"></i>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 4px 0', color: '#1e3a8a' }}>Critical PMS Control</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#3730a3' }}>Ensure the Appraisal Period matches the Financial Year requirements. Open cycles allow employees to start Goal Setting & Self-Appraisals.</p>
                </div>
            </div>
        </div>
    );
};

export default PMSCycleConfig;
