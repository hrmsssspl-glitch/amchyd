import React from 'react';
import { LeaveApplication } from '../../types/leave';

interface Props {
    data: LeaveApplication[];
    onUpdate: (data: LeaveApplication[]) => void;
}

const LeaveApprovals: React.FC<Props> = ({ data, onUpdate }) => {
    const handleStatusUpdate = (id: string, stage: 'TL' | 'RM' | 'HR', status: 'Approved' | 'Rejected') => {
        const updated = data.map(app => {
            if (app.id === id) {
                const newApp = { ...app };
                if (stage === 'TL') newApp.teamLeadStatus = status;
                if (stage === 'RM') newApp.reportingManagerStatus = status;
                if (stage === 'HR') {
                    newApp.hrStatus = status;
                    newApp.overallStatus = status; // Final stage
                }
                return newApp;
            }
            return app;
        });
        onUpdate(updated);
    };

    const getStatusStyle = (status: string) => ({
        padding: '5px 10px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: 'bold' as const,
        background: status === 'Approved' ? '#dcfce7' : status === 'Rejected' ? '#fee2e2' : '#fef9c3',
        color: status === 'Approved' ? '#166534' : status === 'Rejected' ? '#991b1b' : '#854d0e',
        border: '1px solid'
    });

    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b' }}>
                <i className="fas fa-tasks" style={{ color: '#4f46e5' }}></i>
                Leave Approval Workflow (Manager / HR Portal)
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Employee</th>
                            <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Leave Details</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>TL Status</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Manager Status</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>HR Status</th>
                            <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #e2e8f0' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((app, idx) => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{app.employeeName}</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{app.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#4f46e5' }}>{app.leaveType} - {app.numberOfDays} Days</div>
                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{app.fromDate} to {app.toDate}</div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={getStatusStyle(app.teamLeadStatus)}>{app.teamLeadStatus}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={getStatusStyle(app.reportingManagerStatus)}>{app.reportingManagerStatus}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={getStatusStyle(app.hrStatus)}>{app.hrStatus}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    {app.overallStatus === 'Pending' ? (
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'RM', 'Approved')}
                                                style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                                            >Approve</button>
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'RM', 'Rejected')}
                                                style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                                            >Reject</button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Processed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#e0f2fe', borderRadius: '8px', color: '#0369a1', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fas fa-info-circle"></i>
                <span>Workflow: Team Lead → Reporting Manager → HR Head. Approval updates Attendance & Payroll automatically.</span>
            </div>
        </div>
    );
};

export default LeaveApprovals;
