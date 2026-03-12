import React from 'react';
import { TravelRequest } from '../../types/travel';

interface Props {
    requests: TravelRequest[];
}

const TravelRequestForm: React.FC<Props> = ({ requests }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#0c4a6e', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-paper-plane" style={{ color: '#0ea5e9', marginRight: '10px' }}></i>
                Submit Business Travel Request
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                {/* Request Form */}
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Employee ID</label>
                            <input placeholder="Ex: EMP001" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Employee Name</label>
                            <input placeholder="Full Name" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Purpose of Travel</label>
                            <input placeholder="Short description of business objective" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>From Location</label>
                            <input placeholder="Source City" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>To Location</label>
                            <input placeholder="Destination City" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Departure Date</label>
                            <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Return Date</label>
                            <input type="date" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Advance Amount (₹)</label>
                            <input type="number" placeholder="Enter if needed" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button style={{ width: '100%', padding: '14px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Submit for Approval</button>
                        </div>
                    </div>
                </div>

                {/* Status Tracking */}
                <div>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#475569' }}>My Active Requests</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {requests.map(req => (
                            <div key={req.id} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '18px', background: 'white' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#6366f1' }}>{req.id}</span>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold',
                                        background: req.status === 'Approved' ? '#dcfce7' : '#fef9c3',
                                        color: req.status === 'Approved' ? '#166534' : '#854d0e'
                                    }}>{req.status}</span>
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{req.fromLocation} → {req.toLocation}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '5px' }}>{req.fromDate} to {req.toDate}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '10px' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>Estimated: <strong>₹{req.expectedExpense}</strong></span>
                                    <button style={{ border: 'none', background: 'none', color: '#0ea5e9', fontSize: '11px', fontWeight: 'bold' }}>View Details</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelRequestForm;
