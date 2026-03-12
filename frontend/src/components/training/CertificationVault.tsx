import React from 'react';
import { TrainingCertificate, TrainingProgram } from '../../types/training';

interface Props {
    certificates: TrainingCertificate[];
    programs: TrainingProgram[];
}

const CertificationVault: React.FC<Props> = ({ certificates, programs }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-certificate" style={{ color: '#f59e0b' }}></i>
                Official Certification & Recognitions
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '25px' }}>
                {certificates.map(cert => {
                    const program = programs.find(p => p.id === cert.programId);
                    return (
                        <div key={cert.id} style={{
                            background: 'white',
                            border: '2px solid #e2e8f0',
                            borderRadius: '24px',
                            padding: '30px',
                            position: 'relative',
                            boxShadow: cert.isBestPerformance ? '0 10px 15px -3px rgba(245, 158, 11, 0.2)' : 'none',
                            borderColor: cert.isBestPerformance ? '#fbbf24' : '#e2e8f0'
                        }}>
                            {cert.isBestPerformance && (
                                <div style={{ position: 'absolute', top: '-15px', right: '20px', background: '#fbbf24', color: 'white', padding: '6px 15px', borderRadius: '20px', fontSize: '11px', fontWeight: '900', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                    <i className="fas fa-medal"></i> STAR PERFORMER
                                </div>
                            )}

                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <i className="fas fa-award fa-3x" style={{ color: '#4f46e5', marginBottom: '15px' }}></i>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1e293b' }}>{program?.name}</h4>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>Certificate No: <strong>{cert.certificateNumber}</strong></div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '15px', gap: '15px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>ISSUED DATE</div>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{cert.issuedDate}</div>
                                </div>
                                <div style={{ width: '1px', background: '#f1f5f9' }}></div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>VALID TILL</div>
                                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{cert.validTill || 'Lifetime'}</div>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button style={{ padding: '10px 25px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
                                    <i className="fas fa-download"></i> Download Certificate
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: '#fffbeb', borderRadius: '15px', border: '1px solid #fef3c7', display: 'flex', gap: '15px', alignItems: 'center' }}>
                <i className="fas fa-lightbulb" style={{ color: '#d97706', fontSize: '20px' }}></i>
                <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>Certifications are automatically considered for performance-based promotion eligibility analysis in the PMS module.</p>
            </div>
        </div>
    );
};

export default CertificationVault;
