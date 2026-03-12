import React from 'react';
import { CumminsTraining } from '../../types/training';

interface Props {
    data: CumminsTraining[];
}

const CumminsTrainingSync: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '8px 12px', background: '#e11d48', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>Cummins</div>
                    External Training Synchronization
                </h3>
                <button style={{ padding: '10px 20px', background: '#e11d48', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <i className="fas fa-sync-alt" style={{ marginRight: '8px' }}></i> Fetch Latest Sync
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Employee ID</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Cummins Promo ID</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Category</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Nomination Date</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Certification</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((c, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.employeeId}</td>
                                <td style={{ padding: '15px', color: '#e11d48', fontWeight: 'bold' }}>{c.cumminsId}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{c.category}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>{c.nominationDate}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                        background: c.completionStatus === 'Completed' ? '#dcfce7' : '#fef9c3',
                                        color: c.completionStatus === 'Completed' ? '#166534' : '#854d0e'
                                    }}>{c.completionStatus}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    {c.certificationUploaded ? (
                                        <i className="fas fa-file-pdf fa-lg" style={{ color: '#ef4444', cursor: 'pointer' }}></i>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pending Scan</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', padding: '25px', border: '1px solid #e2e8f0', borderRadius: '20px', background: '#fff1f2' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#be123c' }}>Product & Technical Competency</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#e11d48' }}>
                    Sync Cummins external training records to ensure operational readiness for technical deployments and product support roles.
                    These certifications are mandatory for Field Service Engineers.
                </p>
            </div>
        </div>
    );
};

export default CumminsTrainingSync;
