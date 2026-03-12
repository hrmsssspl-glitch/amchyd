import React from 'react';
import { TravelPolicy } from '../../types/travel';

interface Props {
    policies: TravelPolicy[];
}

const TravelPolicyMaster: React.FC<Props> = ({ policies }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#0c4a6e', fontSize: '20px' }}>Global Travel Policy & Eligibility</h3>
                <button style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>+ New Policy</button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', color: '#64748b' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Grade / Level</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Travel Type</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Daily Limit</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Hotel Tier</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Allowed Transport</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.grade}</td>
                                <td style={{ padding: '15px' }}>{p.type}</td>
                                <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#0ea5e9' }}>₹{p.limitPerDay}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{p.hotelCategory}</td>
                                <td style={{ padding: '15px' }}>{p.transportMode}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b' }}><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '25px', padding: '20px', background: '#f0f9ff', borderRadius: '15px', border: '1px solid #bae6fd', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <i className="fas fa-info-circle fa-2x" style={{ color: '#0ea5e9' }}></i>
                <div>
                    <h5 style={{ margin: '0 0 5px 0', color: '#0c4a6e' }}>Policy-Driven Validations</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#0369a1' }}>Employee travel requests are automatically validated against these limits. Any variance requires HOD/Finance exception approval.</p>
                </div>
            </div>
        </div>
    );
};

export default TravelPolicyMaster;
