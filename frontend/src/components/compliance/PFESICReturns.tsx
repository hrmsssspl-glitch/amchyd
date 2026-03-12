import React from 'react';
import { PFESICReturn } from '../../types/compliance';

interface Props {
    returns: PFESICReturn[];
}

const PFESICReturns: React.FC<Props> = ({ returns }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '20px' }}>PF & ESIC Returns Filing</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>PF Details</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>ESIC Details</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Return Month</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.map((r) => (
                            <tr key={r.employeeId} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{r.employeeName}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{r.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.pfNumber}</div>
                                    <div style={{ fontSize: '12px', color: '#166534' }}>Contrib: ₹{r.pfContribution.toLocaleString()}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{r.esicNumber}</div>
                                    <div style={{ fontSize: '12px', color: '#166534' }}>Contrib: ₹{r.esicContribution.toLocaleString()}</div>
                                </td>
                                <td style={{ padding: '15px', color: '#475569' }}>{r.returnMonth}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        background: r.status === 'Submitted' ? '#dcfce7' : '#fff7ed',
                                        color: r.status === 'Submitted' ? '#166534' : '#c2410b'
                                    }}>{r.status}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{ padding: '6px 12px', background: '#334155', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>View Challan</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PFESICReturns;
