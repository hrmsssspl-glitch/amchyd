import React from 'react';
import { ComplianceAudit } from '../../types/compliance';

interface Props {
    audits: ComplianceAudit[];
}

const ComplianceAuditDesk: React.FC<Props> = ({ audits }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '20px' }}>Statutory & Internal Audit Records</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {audits.map((a) => (
                    <div key={a.id} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '25px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <span style={{ padding: '4px 12px', background: '#312e81', color: 'white', borderRadius: '8px', fontSize: '11px', fontWeight: 800, marginRight: '10px' }}>{a.type} AUDIT</span>
                                <span style={{ fontWeight: 800, color: '#1e293b' }}>{a.id}</span>
                            </div>
                            <span style={{
                                padding: '4px 15px',
                                borderRadius: '30px',
                                fontSize: '11px',
                                fontWeight: 800,
                                background: a.status === 'Compliant' ? '#dcfce7' : '#fee2e2',
                                color: a.status === 'Compliant' ? '#166534' : '#991b1b',
                                border: `1px solid ${a.status === 'Compliant' ? '#bbf7d0' : '#fecaca'}`
                            }}>{a.status}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                            <div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>Period: <strong>{a.period}</strong></div>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>Auditor: <strong>{a.auditor}</strong></div>
                            </div>
                            <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>Findings & Corrective Actions</div>
                                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#1e293b' }}>{a.findings}</p>
                                <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
                                    <i className="fas fa-tools" style={{ marginRight: '8px' }}></i> {a.actionTaken}
                                </div>
                            </div>
                        </div>

                        {a.closureDate && (
                            <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '12px', color: '#94a3b8' }}>
                                Compliance closed on: {a.closureDate}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ComplianceAuditDesk;
