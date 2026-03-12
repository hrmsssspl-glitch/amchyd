import React from 'react';
import { ExitLetters, ExitRecord } from '../../types/exit';

interface Props {
    letters: ExitLetters[];
    exits: ExitRecord[];
}

const ExperienceLetters: React.FC<Props> = ({ letters, exits }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px' }}>Experience & Relieving Letters</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {letters.map((l) => {
                    const relatedExit = exits.find(e => e.id === l.employeeId);
                    return (
                        <div key={l.employeeId} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ margin: '0 0 5px 0', color: '#1e1b4b' }}>{relatedExit?.name}</h4>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{l.employeeId} • {relatedExit?.designation}</span>
                                </div>
                                <i className="fas fa-certificate" style={{ color: '#6366f1', fontSize: '24px', opacity: 0.3 }}></i>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Relieving Letter</span>
                                    <span style={{ color: l.relievingIssued ? '#10b981' : '#94a3b8', fontWeight: 700 }}>
                                        {l.relievingIssued ? <><i className="fas fa-check-circle"></i> Issued</> : 'Pending'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Experience Letter</span>
                                    <span style={{ color: l.experienceIssued ? '#10b981' : '#94a3b8', fontWeight: 700 }}>
                                        {l.experienceIssued ? <><i className="fas fa-check-circle"></i> Issued</> : 'Pending'}
                                    </span>
                                </div>
                                {l.letterDate && (
                                    <div style={{ fontSize: '12px', color: '#94a3b8', paddingTop: '5px', borderTop: '1px solid #f1f5f9' }}>
                                        Issued on: {l.letterDate} | Ref: {l.letterReference}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, padding: '10px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                    <i className="fas fa-file-download" style={{ marginRight: '5px' }}></i> Download Set
                                </button>
                                <button style={{ padding: '10px', background: 'white', color: '#6366f1', border: '1px solid #6366f1', borderRadius: '8px', cursor: 'pointer' }}>
                                    <i className="fas fa-print"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExperienceLetters;
