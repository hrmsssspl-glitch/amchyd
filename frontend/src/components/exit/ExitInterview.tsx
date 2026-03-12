import React from 'react';
import { ExitInterviewData, ExitRecord } from '../../types/exit';

interface Props {
    interviews: ExitInterviewData[];
    exits: ExitRecord[];
}

const ExitInterview: React.FC<Props> = ({ interviews, exits }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px' }}>Exit Interview & Feedback</h3>
                <button style={{ padding: '10px 20px', background: '#312e81', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    <i className="fas fa-clipboard-check" style={{ marginRight: '8px' }}></i> Schedule Interview
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {interviews.map((i) => {
                    const relatedExit = exits.find(e => e.id === i.employeeId);
                    return (
                        <div key={i.employeeId} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 800, color: '#312e81' }}>{i.employeeId}</span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: i.rejoiningEligibility === 'Yes' ? '#16a34a' : '#dc2626', background: 'white', padding: '3px 10px', borderRadius: '30px', border: '1px solid currentColor' }}>
                                    Rejoin: {i.rejoiningEligibility}
                                </span>
                            </div>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1e1b4b' }}>{relatedExit?.name}</h4>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                                Interviewed by: <strong>{i.interviewedBy}</strong> on {i.interviewDate}
                            </div>
                            <div style={{ padding: '12px', background: 'white', borderRadius: '10px', color: '#475569', fontSize: '13px', border: '1px dashed #cbd5e1', marginBottom: '15px' }}>
                                <strong>Reason for Leaving:</strong> {i.reasonForLeaving}<br />
                                <strong>Feedback:</strong> {i.feedback}
                            </div>
                            <button style={{ width: '100%', padding: '10px', background: 'white', color: '#312e81', border: '1px solid #312e81', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                View Full Feedback Form
                            </button>
                        </div>
                    );
                })}
            </div>

            {interviews.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-comments-slash" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
                    <p>No exit interviews recorded yet.</p>
                </div>
            )}
        </div>
    );
};

export default ExitInterview;
