import React from 'react';
import { ClearanceData, ExitRecord } from '../../types/exit';

interface Props {
    clearances: ClearanceData[];
    exits: ExitRecord[];
}

const ClearanceDesk: React.FC<Props> = ({ clearances, exits }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px' }}>No Dues Clearance Console</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b', textAlign: 'center' }}>Asset</th>
                            <th style={{ padding: '15px', color: '#64748b', textAlign: 'center' }}>Payroll</th>
                            <th style={{ padding: '15px', color: '#64748b', textAlign: 'center' }}>Finance</th>
                            <th style={{ padding: '15px', color: '#64748b', textAlign: 'center' }}>HR</th>
                            <th style={{ padding: '15px', color: '#64748b', textAlign: 'center' }}>IT/Admin</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Overall</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clearances.map((c) => {
                            const relatedExit = exits.find(e => e.id === c.employeeId);
                            const getStatusBadge = (status: string) => (
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    background: status === 'Completed' ? '#dcfce7' : '#fef2f2',
                                    color: status === 'Completed' ? '#166534' : '#991b1b',
                                    border: `1px solid ${status === 'Completed' ? '#bbf7d0' : '#fecaca'}`
                                }}>{status}</span>
                            );

                            return (
                                <tr key={c.employeeId} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{relatedExit?.name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.employeeId}</div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{getStatusBadge(c.asset)}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{getStatusBadge(c.payroll)}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{getStatusBadge(c.finance)}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{getStatusBadge(c.hr)}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{getStatusBadge(c.itAdmin)}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            background: c.totalStatus === 'Cleared' ? '#22c55e' : '#f59e0b',
                                            color: 'white'
                                        }}>{c.totalStatus}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', borderRadius: '12px', border: '1px solid #fef3c7', color: '#92400e', fontSize: '13px' }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
                <strong>Audit Rule:</strong> Full & Final Settlement cannot be initiated until <strong>Overall Clearance Status</strong> is marked as "Cleared".
            </div>
        </div>
    );
};

export default ClearanceDesk;
