import React from 'react';
import { GrievanceEnquiry, Grievance } from '../../types/grievance';

interface Props {
    enquiries: GrievanceEnquiry[];
    grievances: Grievance[];
}

const GrievanceEnquiryDesk: React.FC<Props> = ({ enquiries, grievances }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#164e63', fontSize: '20px' }}>Enquiry & Committee Details</h3>
                <button style={{ padding: '10px 20px', background: '#0e7490', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    <i className="fas fa-users" style={{ marginRight: '8px' }}></i> Form Committee
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {enquiries.map((e) => {
                    const relatedGrievance = grievances.find(g => g.id === e.grievanceId);
                    return (
                        <div key={e.grievanceId} style={{ border: '1px solid #cffafe', borderRadius: '15px', padding: '20px', background: '#f0f9ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 800, color: '#06b6d4' }}>{e.grievanceId}</span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0e7490', background: '#e0f2fe', padding: '3px 10px', borderRadius: '30px' }}>{e.type} Enquiry</span>
                            </div>
                            <h4 style={{ margin: '0 0 10px 0', color: '#164e63' }}>{relatedGrievance?.employeeName}</h4>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                                <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i> Started: {e.startDate}
                            </div>
                            <div style={{ background: 'white', padding: '12px', borderRadius: '12px', marginBottom: '15px' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase' }}>Committee Members</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {e.committeeMembers.map((m, idx) => (
                                        <span key={idx} style={{ background: '#f1f5f9', padding: '2px 10px', borderRadius: '8px', fontSize: '12px', color: '#475569' }}>{m}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '12px', background: '#ecfeff', borderRadius: '10px', color: '#0e7490', fontSize: '13px', borderLeft: '4px solid #06b6d4' }}>
                                <strong>Findings:</strong> {e.findings}
                            </div>
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, padding: '8px', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>View MoM</button>
                                <button style={{ flex: 1, padding: '8px', background: 'white', color: '#06b6d4', border: '1px solid #06b6d4', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Upload Report</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GrievanceEnquiryDesk;
