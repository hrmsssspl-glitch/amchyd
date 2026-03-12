import React from 'react';
import { TrainingNomination, TrainingProgram } from '../../types/training';

interface Props {
    nominations: TrainingNomination[];
    programs: TrainingProgram[];
}

const NominationCenter: React.FC<Props> = ({ nominations, programs }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-user-tag" style={{ color: '#4f46e5' }}></i>
                Employee Training Nominations
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', color: '#64748b' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Employee Name</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Dept / Desig</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Training Program</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Nominated By</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Approval Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nominations.map(n => (
                            <tr key={n.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{n.employeeName}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{n.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px' }}>{n.department} / {n.designation}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#4f46e5' }}>{n.programName}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{n.nominatedBy}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                        background: n.approvalStatus === 'Approved' ? '#dcfce7' : '#fee2e2',
                                        color: n.approvalStatus === 'Approved' ? '#166534' : '#991b1b'
                                    }}>{n.approvalStatus}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button style={{ padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ background: '#eef2ff', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #4f46e5' }}>
                    <h5 style={{ margin: '0 0 8px 0', color: '#1e3a8a' }}>Manager-Led Nominations</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#3730a3' }}>Managers can nominate high-potential employees for advanced technical skill programs as part of the career growth plan.</p>
                </div>
                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #10b981' }}>
                    <h5 style={{ margin: '0 0 8px 0', color: '#14532d' }}>Mandatory Compliance</h5>
                    <p style={{ margin: 0, fontSize: '12px', color: '#15803d' }}>Safety and ISO trainings are auto-nominated for all applicable departments to ensure 100% regulatory compliance. </p>
                </div>
            </div>
        </div>
    );
};

export default NominationCenter;
