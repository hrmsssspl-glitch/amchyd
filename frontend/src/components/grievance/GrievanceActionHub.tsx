import React from 'react';
import { GrievanceAction, Grievance } from '../../types/grievance';

interface Props {
    actions: GrievanceAction[];
    grievances: Grievance[];
}

const GrievanceActionHub: React.FC<Props> = ({ actions, grievances }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#164e63', fontSize: '20px' }}>Action Taken Log</h3>
                <button style={{ padding: '10px 20px', background: '#0891b2', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    <i className="fas fa-gavel" style={{ marginRight: '8px' }}></i> Record Action
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ecfeff' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Action Type</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Grievance ID</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Effective Date</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Description</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Approved By</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Letter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions.map((a, idx) => {
                            const relatedGrievance = grievances.find(g => g.id === a.grievanceId);
                            return (
                                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>{a.actionType}</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600, color: '#164e63' }}>{a.grievanceId}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{relatedGrievance?.employeeName}</div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#475569' }}>{a.effectiveDate}</td>
                                    <td style={{ padding: '15px', maxWidth: '300px', fontSize: '13px', color: '#64748b' }}>{a.description}</td>
                                    <td style={{ padding: '15px', color: '#475569' }}>{a.approvedBy}</td>
                                    <td style={{ padding: '15px' }}>
                                        <button style={{ border: 'none', background: '#0891b2', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Download</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GrievanceActionHub;
