import React from 'react';
import { LeaveBalance } from '../../types/reports';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: LeaveBalance[];
}

const LeaveBalanceReport: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Employee Leave Entitlement & Balance</h3>
                <button
                    onClick={() => exportToCSV(data, 'Leave_Balance_Report')}
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
                            <th style={{ padding: '15px', color: '#64748b' }}>CL Balance</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>SL Balance</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>EL Balance</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Comp Off</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Mat/Pat Leave</th>
                            <th style={{ padding: '15px', color: '#64748b', fontWeight: 800 }}>Total Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((l, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{l.name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{l.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 700 }}>{l.cl}</td>
                                <td style={{ padding: '15px', fontWeight: 700 }}>{l.sl}</td>
                                <td style={{ padding: '15px', fontWeight: 700 }}>{l.el}</td>
                                <td style={{ padding: '15px' }}>{l.compOff}</td>
                                <td style={{ padding: '15px' }}>{l.paternityMaternity}</td>
                                <td style={{ padding: '15px', fontWeight: 800, color: '#6366f1' }}>{l.totalTaken}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaveBalanceReport;
