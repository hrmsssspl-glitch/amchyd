import React from 'react';
import { TrainingCompletion, TrainingProgram } from '../../types/training';

interface Props {
    completions: TrainingCompletion[];
    programs: TrainingProgram[];
}

const AssessmentTracker: React.FC<Props> = ({ completions, programs }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-clipboard-check" style={{ color: '#4f46e5' }}></i>
                Attendance, Completion & Exam Results
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Program</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Attendance</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Exam Result</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Score</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Evaluated By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {completions.map((c, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.employeeId}</td>
                                <td style={{ padding: '15px' }}>{programs.find(p => p.id === c.programId)?.name}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{ color: c.attendanceStatus === 'Attended' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                        {c.attendanceStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{c.completionStatus}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '900',
                                        background: c.examResult === 'Pass' ? '#dcfce7' : '#fee2e2',
                                        color: c.examResult === 'Pass' ? '#166534' : '#991b1b',
                                        border: '1px solid'
                                    }}>{c.examResult}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>{c.score || '-'}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{c.evaluatedBy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', background: '#f8fafc', padding: '25px', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
                <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#1e293b' }}>Batch Processing Results</h4>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                        <i className="fas fa-upload" style={{ marginRight: '8px' }}></i> Upload Attendance Sheet
                    </button>
                    <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                        <i className="fas fa-file-signature" style={{ marginRight: '8px' }}></i> Bulk Exam Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssessmentTracker;
