import React from 'react';
import { TravelData } from '../../types/travel';

interface Props {
    data: TravelData;
}

const TravelSettlementHub: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#0c4a6e', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-hand-holding-usd" style={{ color: '#0ea5e9', marginRight: '10px' }}></i>
                Finance Settlement & Reimbursement Queue
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Travel Request</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Advance Paid</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Final Claims</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Reimbursement</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.requests.filter(r => r.status === 'Approved').map(req => {
                            const advance = req.advanceAmount || 0;
                            const totalClaimed = 8500; // Mocked
                            const balance = totalClaimed - advance;
                            return (
                                <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{req.id}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{req.toLocation} Trip</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>{req.employeeName}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>₹{advance}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>₹{totalClaimed}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <div style={{ fontWeight: 'bold', color: balance >= 0 ? '#10b981' : '#ef4444' }}>
                                            ₹{Math.abs(balance)} {balance >= 0 ? '(Pay)' : '(Recov)'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold',
                                            background: '#fef9c3', color: '#854d0e'
                                        }}>In Verification</span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button style={{ padding: '6px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>Settle F&F</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>PAYABLE TOTAL</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>₹ 1,45,000</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>RECOVERABLE BALANCES</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#be123c' }}>₹ 12,500</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>OPEN ADVANCES</div>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0ea5e9' }}>₹ 2,10,000</div>
                </div>
            </div>
        </div>
    );
};

export default TravelSettlementHub;
