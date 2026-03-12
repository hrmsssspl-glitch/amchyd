import React, { useState } from 'react';
import { Candidate } from '../../types/recruitment';

interface Props {
    candidates: Candidate[];
    setCandidates: (c: Candidate[]) => void;
}

const CandidatePipeline: React.FC<Props> = ({ candidates, setCandidates }) => {
    const [showForm, setShowForm] = useState(false);
    const [newCand, setNewCand] = useState<Partial<Candidate>>({ status: 'New', source: 'Portal' });

    const handleAdd = () => {
        if (newCand.name && newCand.email) {
            setCandidates([{ ...newCand, id: `C${Date.now()}` } as Candidate, ...candidates]);
            setShowForm(false);
            setNewCand({ status: 'New', source: 'Portal' });
        }
    };

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Talent Sourcing & Candidate Pipeline</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {showForm ? 'Cancel' : '+ Source New Candidate'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        <input placeholder="Full Name" onChange={e => setNewCand({ ...newCand, name: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Email Address" onChange={e => setNewCand({ ...newCand, email: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Phone" onChange={e => setNewCand({ ...newCand, phone: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input type="number" placeholder="Total Experience" onChange={e => setNewCand({ ...newCand, experience: parseFloat(e.target.value) })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Present Company" onChange={e => setNewCand({ ...newCand, currentCompany: e.target.value })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <input placeholder="Current CTC" type="number" onChange={e => setNewCand({ ...newCand, currentCTC: parseInt(e.target.value) })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        <select onChange={e => setNewCand({ ...newCand, source: e.target.value as any })} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                            <option value="Portal">Naukri / LinkedIn</option>
                            <option value="Referral">Internal Referral</option>
                            <option value="Consultant">Consultancy</option>
                            <option value="Ex-Emp">Ex-Employee</option>
                        </select>
                        <button onClick={handleAdd} style={{ background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Register Profile</button>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Candidate Name</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Exp (Years)</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Job Code</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Source</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Present CTC</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Resume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c, idx) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.email}</div>
                                </td>
                                <td style={{ padding: '15px' }}>{c.experience} / {c.relevantExperience || 0}</td>
                                <td style={{ padding: '15px' }}>{c.jobCode}</td>
                                <td style={{ padding: '15px' }}>{c.source}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>₹{c.currentCTC?.toLocaleString() || '-'}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                        background: c.status === 'Selected' ? '#dcfce7' : '#f1f5f9',
                                        color: c.status === 'Selected' ? '#166534' : '#475569'
                                    }}>{c.status}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button style={{ color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}><i className="fas fa-file-pdf"></i> View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CandidatePipeline;
