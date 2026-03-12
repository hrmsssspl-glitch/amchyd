import React from 'react';
import { StatutoryPayment } from '../../types/compliance';

interface Props {
    payments: StatutoryPayment[];
}

const StatutoryPayments: React.FC<Props> = ({ payments }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '20px' }}>Professional Tax (PT) & Bonus Tracking</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>PT Deducted</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Bonus Eligible</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Bonus Amount</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Month</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p) => (
                            <tr key={p.employeeId} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.employeeName}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 600, color: '#475569' }}>₹{p.ptDeducted.toLocaleString()}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ color: p.bonusEligible ? '#166534' : '#94a3b8' }}>
                                        <i className={`fas ${p.bonusEligible ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ marginRight: '5px' }}></i>
                                        {p.bonusEligible ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 700, color: '#1e293b' }}>₹{p.bonusPayable.toLocaleString()}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        background: p.bonusStatus === 'Paid' ? '#ecfdf5' : '#fff1f2',
                                        color: p.bonusStatus === 'Paid' ? '#059669' : '#e11d48'
                                    }}>{p.bonusStatus}</span>
                                </td>
                                <td style={{ padding: '15px', color: '#64748b' }}>{p.returnMonth}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StatutoryPayments;
