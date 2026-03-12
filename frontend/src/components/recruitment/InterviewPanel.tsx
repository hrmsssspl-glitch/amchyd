import React from 'react';
import { RecruitmentData } from '../../types/recruitment';

interface Props {
    data: RecruitmentData;
}

const InterviewPanel: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-id-card-clip" style={{ color: '#4f46e5', marginRight: '10px' }}></i>
                Interview & Selection Workspace
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' }}>
                {data.interviews.map(iv => {
                    const candidate = data.candidates.find(c => c.id === iv.candidateId);
                    return (
                        <div key={iv.candidateId} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: '#f8fafc', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                <span style={{ padding: '6px 12px', background: '#4f46e5', color: 'white', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{iv.status}</span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1e293b' }}>{candidate?.name}</h4>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Applying for: <strong>{candidate?.jobCode}</strong></div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Interview Date</label>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{iv.interviewDate}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Current Selection</label>
                                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>{iv.selectionStatus}</div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Interview Panel</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {iv.panel.map(p => <span key={p} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '4px 10px', borderRadius: '6px', fontSize: '12px' }}>{p}</span>)}
                                </div>
                            </div>

                            <div style={{ background: 'white', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #4f46e5' }}>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>Panel Comments</label>
                                <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: '#475569' }}>"{iv.remarks}"</p>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, padding: '10px', background: '#4f46e5', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px' }}>Issue Offer</button>
                                <button style={{ padding: '10px 15px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px' }}><i className="fas fa-edit"></i></button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InterviewPanel;
