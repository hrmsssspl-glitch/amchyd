import React from 'react';
import { AppraisalRecord } from '../../types/pms';

interface Props {
    appraisals: AppraisalRecord[];
}

const AppraisalHub: React.FC<Props> = ({ appraisals }) => {
    const getStageStyle = (stage: string) => {
        switch (stage) {
            case 'Self': return { bg: '#eef2ff', text: '#4338ca' };
            case 'Manager': return { bg: '#fff7ed', text: '#9a3412' };
            case 'HR': return { bg: '#f0fdf4', text: '#166534' };
            default: return { bg: '#f8fafc', text: '#475569' };
        }
    };

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-tasks" style={{ color: '#6366f1' }}></i>
                Appraisal Process Tracking
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Current Stage</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Self Rating</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Manager Rating</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Final Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appraisals.map(app => {
                            const stageStyle = getStageStyle(app.stage);
                            return (
                                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{app.employeeName}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{app.employeeId} | {app.cycleId}</div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '20px', background: stageStyle.bg, color: stageStyle.text, fontWeight: 'bold', fontSize: '11px' }}>
                                            {app.stage} Phase
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>{app.selfRating || '-'}</td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: '#6366f1' }}>{app.managerRating || '-'}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Pending Review</div>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <button style={{ padding: '8px 16px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Evaluate</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1, padding: '20px', background: '#fff9db', borderRadius: '15px', border: '1px solid #fab005' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#856404' }}>Final Rating & Normalization</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#856404' }}>Normalization will be active once 95% of Manager appraisals are completed for the department.</p>
                </div>
                <div style={{ flex: 1, padding: '20px', background: '#e7f5ff', borderRadius: '15px', border: '1px solid #228be6' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#1864ab' }}>Reward Recommendations</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#1864ab' }}>Increment and promotion logic triggers automatically based on the finalized normalized rating.</p>
                </div>
            </div>
        </div>
    );
};

export default AppraisalHub;
