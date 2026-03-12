import React from 'react';
import { RecruitmentData } from '../../types/recruitment';

interface Props {
    data: RecruitmentData;
}

const OfferStation: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-handshake" style={{ color: '#4f46e5', marginRight: '10px' }}></i>
                Offer Release & Acceptance Tracking
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Candidate Details</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Offered Salary</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Hike %</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Expected DOJ</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Offer Letter</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.offers.map((offer, idx) => {
                            const candidate = data.candidates.find(c => c.id === offer.candidateId);
                            return (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{candidate?.name}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Job Code: {candidate?.jobCode}</div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#4f46e5' }}>₹{offer.offeredSalary.toLocaleString()}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{ padding: '4px 8px', background: '#dcfce7', color: '#166534', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>+{offer.hikePercentage}%</span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{offer.expectedDOJ}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                            background: offer.status === 'Accepted' ? '#dcfce7' : '#fef9c3',
                                            color: offer.status === 'Accepted' ? '#166534' : '#854d0e'
                                        }}>{offer.status}</span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button className="btn btn-sm" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 12px' }}>
                                            <i className="fas fa-print"></i> Print Letter
                                        </button>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button style={{ padding: '8px 15px', background: '#10b981', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '12px' }}>Convert to Employee</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#eef2ff', borderRadius: '12px', border: '1px solid #c7d2fe', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <div style={{ width: '50px', height: '50px', background: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <i className="fas fa-info fa-lg"></i>
                </div>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#1e3a8a' }}>Pre-Joining Formalities</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#3730a3' }}>Candidates with "Accepted" status are automatically moved to the Onboarding Desk. Converting to employee will auto-generate the Employee ID and sync with Employee Master.</p>
                </div>
            </div>
        </div>
    );
};

export default OfferStation;
