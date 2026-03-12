import React from 'react';
import { GrievanceResolution, Grievance } from '../../types/grievance';

interface Props {
    resolutions: GrievanceResolution[];
    grievances: Grievance[];
}

const GrievanceResolutionDesk: React.FC<Props> = ({ resolutions, grievances }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#164e63', fontSize: '20px' }}>Resolution & Closure</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {resolutions.map((r, idx) => {
                    const relatedGrievance = grievances.find(g => g.id === r.grievanceId);
                    return (
                        <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: '#f8fafc' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 800, color: '#164e63' }}>{r.grievanceId}</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981' }}>{r.status}</span>
                            </div>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{relatedGrievance?.employeeName}</h4>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                                Closed on: <strong>{r.closureDate}</strong>
                            </div>
                            <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '10px', color: '#166534', fontSize: '13px', borderLeft: '4px solid #10b981', marginBottom: '15px' }}>
                                <strong>Remarks:</strong> {r.remarks}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                <span style={{ color: '#64748b' }}>Employee Acceptance:</span>
                                <span style={{ padding: '2px 8px', borderRadius: '4px', background: r.employeeAcceptance === 'Accepted' ? '#dcfce7' : '#fee2e2', color: r.employeeAcceptance === 'Accepted' ? '#166534' : '#991b1b', fontWeight: 700 }}>{r.employeeAcceptance}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {resolutions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    <i className="fas fa-archive" style={{ fontSize: '40px', marginBottom: '10px' }}></i>
                    <p>No resolved grievances available for display.</p>
                </div>
            )}
        </div>
    );
};

export default GrievanceResolutionDesk;
