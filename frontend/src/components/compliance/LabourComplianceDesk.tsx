import React from 'react';
import { LabourCompliance, ContractorRecord } from '../../types/compliance';

interface Props {
    labour: LabourCompliance[];
    contractors: ContractorRecord[];
}

const LabourComplianceDesk: React.FC<Props> = ({ labour, contractors }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '18px' }}>Internal Labour Compliance Review</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Contract Type</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Checklist</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Docs</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {labour.map((l) => (
                                <tr key={l.employeeId} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600 }}>{l.employeeName}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{l.employeeId} • {l.department}</div>
                                    </td>
                                    <td style={{ padding: '15px' }}>{l.contractType}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                            {l.checklist.map((item, idx) => (
                                                <span key={idx} style={{ padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px', fontSize: '10px' }}>{item}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <i className={`fas ${l.documentSubmitted ? 'fa-check' : 'fa-times'} circle`} style={{ color: l.documentSubmitted ? '#10b981' : '#f43f5e' }}></i>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            background: l.status === 'Compliant' ? '#10b981' : '#f59e0b',
                                            color: 'white'
                                        }}>{l.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '25px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '18px' }}>Contract Labour & Agency Records</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', color: '#64748b' }}>Agency / Contractor</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Emp Count</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Type</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Validity</th>
                                <th style={{ padding: '15px', color: '#64748b' }}>Compliance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractors.map((c, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{c.contractorName}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>Primary: {c.employeeName}</div>
                                    </td>
                                    <td style={{ padding: '15px', fontWeight: 700 }}>{c.employeeCount}</td>
                                    <td style={{ padding: '15px' }}>{c.type}</td>
                                    <td style={{ padding: '15px', fontSize: '12px' }}>
                                        {c.startDate} to {c.endDate}
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 800, color: c.status === 'Compliant' ? '#10b981' : '#f59e0b' }}>
                                            {c.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LabourComplianceDesk;
