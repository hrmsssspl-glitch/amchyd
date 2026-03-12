import React from 'react';
import { FnFData, ExitRecord } from '../../types/exit';

interface Props {
    settlements: FnFData[];
    exits: ExitRecord[];
}

const FnFSettlement: React.FC<Props> = ({ settlements, exits }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px' }}>Full & Final Settlement (F&F)</h3>
                <button style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    <i className="fas fa-calculator" style={{ marginRight: '8px' }}></i> New F&F Calculation
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Salary & Leave</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Gratuity & Bonus</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Deductions</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Net Payable</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Settlement</th>
                        </tr>
                    </thead>
                    <tbody>
                        {settlements.map((s) => {
                            const relatedExit = exits.find(e => e.id === s.employeeId);
                            return (
                                <tr key={s.employeeId} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{relatedExit?.name}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.employeeId}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontSize: '13px', color: '#475569' }}>Salary: ₹{s.salaryTillLastDay.toLocaleString()}</div>
                                        <div style={{ fontSize: '13px', color: '#475569' }}>Leave: ₹{s.leaveEncashment.toLocaleString()}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontSize: '13px', color: '#475569' }}>Gratuity: ₹{s.gratuity.toLocaleString()}</div>
                                        <div style={{ fontSize: '13px', color: '#475569' }}>Bonus: ₹{s.bonusIncentives.toLocaleString()}</div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#dc2626', fontWeight: 600 }}>- ₹{s.deductions.toLocaleString()}</td>
                                    <td style={{ padding: '15px', color: '#166534', fontWeight: 800, fontSize: '15px' }}>₹{s.netPayable.toLocaleString()}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            background: s.status === 'Completed' ? '#dcfce7' : '#fff7ed',
                                            color: s.status === 'Completed' ? '#166534' : '#c2410b'
                                        }}>{s.status}</span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button style={{ padding: '6px 12px', background: s.status === 'Completed' ? '#f1f5f9' : '#10b981', color: s.status === 'Completed' ? '#94a3b8' : 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                            {s.status === 'Completed' ? 'View Slip' : 'Disburse'}
                                        </button>
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

export default FnFSettlement;
