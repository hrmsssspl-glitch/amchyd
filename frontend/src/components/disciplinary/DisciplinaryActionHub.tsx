import React from 'react';
import { DisciplinaryAction, DisciplinaryCase } from '../../types/disciplinary';

interface Props {
    actions: DisciplinaryAction[];
    cases: DisciplinaryCase[];
}

const DisciplinaryActionHub: React.FC<Props> = ({ actions, cases }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Disciplinary Action Taken</h3>
                <button style={{ padding: '10px 20px', background: '#ec4899', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    <i className="fas fa-gavel" style={{ marginRight: '8px' }}></i> Record Final Action
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Action Type</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Case Tracking</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Effective Dates</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Description</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Approval</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Action Letter</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actions.map((a, idx) => {
                            const relatedCase = cases.find(c => c.id === a.caseId);
                            return (
                                <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '6px 16px',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            background: a.actionType === 'Termination' ? '#fff1f2' : a.actionType === 'Suspension' ? '#fff7ed' : '#f0f9ff',
                                            color: a.actionType === 'Termination' ? '#e11d48' : a.actionType === 'Suspension' ? '#ea580c' : '#0369a1',
                                            border: '1px solid currentColor'
                                        }}>
                                            {a.actionType}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{a.caseId}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{relatedCase?.employeeName || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '15px', fontSize: '13px' }}>
                                        <div style={{ color: '#16a34a', fontWeight: 600 }}>From: {a.effectiveFrom}</div>
                                        {a.effectiveTo && <div style={{ color: '#dc2626', fontWeight: 600 }}>To: {a.effectiveTo}</div>}
                                    </td>
                                    <td style={{ padding: '15px', maxWidth: '300px', fontSize: '13px', color: '#475569' }}>
                                        {a.description}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '15px', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                                            {a.approvalBy}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button style={{ border: 'none', background: '#ec4899', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                                            <i className="fas fa-file-download" style={{ marginRight: '5px' }}></i> Download
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#f1f5f9', borderRadius: '15px', border: '1px dashed #cbd5e1' }}>
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                    <strong>Integration Note:</strong> Final actions recorded here will automatically reflect in <strong>Payroll (Suspension Deduction)</strong> and <strong>Exit Management (Termination Clearance)</strong> modules.
                </div>
            </div>
        </div>
    );
};

export default DisciplinaryActionHub;
