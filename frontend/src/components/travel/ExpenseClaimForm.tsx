import React from 'react';
import { ExpenseClaim, TravelRequest } from '../../types/travel';

interface Props {
    claims: ExpenseClaim[];
    requests: TravelRequest[];
}

const ExpenseClaimForm: React.FC<Props> = ({ claims, requests }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#0c4a6e', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-file-invoice-dollar" style={{ color: '#10b981', marginRight: '10px' }}></i>
                Post-Travel Expense Reimbursement
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '25px' }}>
                {/* Active Requests to claim for */}
                <div style={{ background: '#f0fdf4', padding: '25px', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#31664e', marginBottom: '8px' }}>Employee ID</label>
                            <input placeholder="Ex: EMP001" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #b7e4c7' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#31664e', marginBottom: '8px' }}>Employee Name</label>
                            <input placeholder="Full Name" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #b7e4c7' }} />
                        </div>
                    </div>
                    <h5 style={{ margin: '0 0 15px 0', color: '#166534' }}>Select Approved Travel Request</h5>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #b7e4c7', background: 'white', marginBottom: '20px' }}>
                        {requests.filter(r => r.status === 'Approved').map(r => (
                            <option key={r.id}>{r.id} | {r.fromLocation} to {r.toLocation}</option>
                        ))}
                    </select>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#31664e', marginBottom: '8px' }}>Expense Category</label>
                            <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #b7e4c7' }}>
                                <option>Tickets (Flight/Train)</option>
                                <option>Hotel/Accommodation</option>
                                <option>Food & Meals</option>
                                <option>Fuel/Conveyance</option>
                                <option>Others</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#31664e', marginBottom: '8px' }}>Amount Claimed (₹)</label>
                            <input type="number" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #b7e4c7' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#31664e', marginBottom: '8px' }}>Upload Bill / Receipt</label>
                            <input type="file" style={{ width: '100%', padding: '10px', background: 'white', borderRadius: '10px', border: '1px dashed #b7e4c7' }} />
                        </div>
                        <button style={{ gridColumn: 'span 2', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>Add Expense Line</button>
                    </div>
                </div>

                {/* Claim Summary */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '25px' }}>
                    <h5 style={{ margin: '0 0 15px 0', color: '#475569' }}>Claim Overview & Audit Trail</h5>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Amount</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Receipt</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {claims.map((c, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px' }}>{c.category}</td>
                                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>₹{c.amountClaimed}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {c.billsUploaded ? <i className="fas fa-file-pdf" style={{ color: '#ef4444' }}></i> : '-'}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>{c.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '2px solid #f1f5f9', paddingTop: '15px' }}>
                        <span style={{ fontSize: '14px', color: '#64748b', marginRight: '15px' }}>Total Claimed:</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#10b981' }}>₹ 8,500</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseClaimForm;
