import React, { useState, useEffect } from 'react';
import { getLeaveTypes, LeaveTypeConfig } from '../../utils/leaveTypeStorage';

const LeaveTypesMaster: React.FC = () => {
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeConfig[]>([]);

    useEffect(() => {
        setLeaveTypes(getLeaveTypes());

        const handleUpdate = () => {
            setLeaveTypes(getLeaveTypes());
        };

        window.addEventListener('leaveTypesUpdated', handleUpdate);
        return () => window.removeEventListener('leaveTypesUpdated', handleUpdate);
    }, []);

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Leave Types Master</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                    Managed in Organization Master &gt; Leave Types
                </p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                    <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', fontSize: '14px' }}>
                        <th style={{ padding: '12px' }}>Leave Code</th>
                        <th style={{ padding: '12px' }}>Leave Type</th>
                        <th style={{ padding: '12px' }}>Days Allowed</th>
                        <th style={{ padding: '12px' }}>Description</th>
                        <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaveTypes.map((leave) => (
                        <tr key={leave.id || leave.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px', fontWeight: 'bold', color: '#3b82f6' }}>{leave.code}</td>
                            <td style={{ padding: '12px', fontWeight: '500' }}>{leave.name}</td>
                            <td style={{ padding: '12px' }}>{leave.daysAllowed}</td>
                            <td style={{ padding: '12px', color: '#64748b' }}>{leave.description}</td>
                            <td style={{ padding: '12px' }}>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '10px', fontSize: '11px',
                                    background: leave.status === 'Active' ? '#dcfce7' : '#fee2e2',
                                    color: leave.status === 'Active' ? '#166534' : '#991b1b'
                                }}>{leave.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveTypesMaster;
