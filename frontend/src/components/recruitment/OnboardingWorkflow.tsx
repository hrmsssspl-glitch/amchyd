import React from 'react';
import { RecruitmentData } from '../../types/recruitment';

interface Props {
    data: RecruitmentData;
    onActivate: (candidateId: string) => void;
}

const OnboardingWorkflow: React.FC<Props> = ({ data, onActivate }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-rocket" style={{ color: '#4f46e5', marginRight: '10px' }}></i>
                Candidate Onboarding & Induction
            </h3>

            {data.checklists.map(checklist => {
                const candidate = data.candidates.find(c => c.id === checklist.candidateId);
                const offer = data.offers.find(o => o.candidateId === checklist.candidateId);

                const items = [
                    { label: 'Offer Letter Accepted', status: checklist.offerAccepted },
                    { label: 'Appointment Letter Issued', status: checklist.appointmentLetterIssued },
                    { label: 'ID Proofs (PAN/Aadhar)', status: checklist.idProofSubmitted },
                    { label: 'Qualification Certificates', status: checklist.qualificationCertificates },
                    { label: 'Experience Certificate', status: checklist.experienceCertificate },
                    { label: '3 Months Pay Slips', status: checklist.paySlips },
                    { label: 'Bank Statement', status: checklist.bankStatement },
                    { label: 'Address Proof', status: checklist.addressProof },
                    { label: 'PF / ESIC Declaration', status: checklist.pfEsiDeclaration },
                    { label: 'HR & Safety Induction', status: checklist.inductionCompleted },
                    { label: 'Uniform & Safety Kit', status: checklist.uniformIssued },
                    { label: 'ID Card & ESIC Card', status: checklist.idCardIssued }
                ];

                const completedCount = items.filter(i => i.status).length;
                const progress = (completedCount / items.length) * 100;

                return (
                    <div key={checklist.candidateId} style={{ border: '1px solid #e2e8f0', borderRadius: '20px', padding: '30px', background: '#f8fafc', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{candidate?.name} <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '400' }}>(Emp ID: {offer?.employeeId})</span></h4>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>Joining Date: <strong>{offer?.expectedDOJ}</strong> | Dept: <strong>{candidate?.jobCode}</strong></div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>ONBOARDING PROGRESS</div>
                                <div style={{ width: '200px', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{ width: `${progress}%`, height: '100%', background: '#10b981', transition: 'width 0.5s ease' }}></div>
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981', marginTop: '5px' }}>{Math.round(progress)}% Complete</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
                            {items.map((item, idx) => (
                                <div key={idx} style={{ background: 'white', padding: '12px 20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: '13px', color: '#475569' }}>{item.label}</span>
                                    {item.status ? (
                                        <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                                    ) : (
                                        <button style={{ padding: '3px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'none', color: '#4f46e5', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Mark Submit</button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <button style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}><i className="fas fa-book"></i> Schedule Induction</button>
                                <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold' }}>Update Training Info</button>
                            </div>
                            {progress === 100 && (
                                <button
                                    onClick={() => onActivate(checklist.candidateId)}
                                    style={{ padding: '12px 30px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)', cursor: 'pointer' }}
                                >
                                    <i className="fas fa-power-off"></i> Activate Employee Master
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default OnboardingWorkflow;
