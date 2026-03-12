import React from 'react';
import { SafetyIncident } from '../../types/compliance';

interface Props {
    incidents: SafetyIncident[];
}

const SafetyAccidents: React.FC<Props> = ({ incidents }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Accident & Workplace Safety Reports</h3>
                <button style={{ padding: '10px 20px', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i> Report Incident
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {incidents.map((i, idx) => (
                    <div key={idx} style={{ border: '1px solid #fee2e2', borderRadius: '15px', padding: '20px', background: '#fff1f2' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 800, color: '#be123c' }}>INC-{i.date.replace(/-/g, '')}</span>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#be123c', background: 'white', padding: '3px 10px', borderRadius: '30px', border: '1px solid #fecdd3' }}>{i.type} ACCIDENT</span>
                        </div>
                        <h4 style={{ margin: '0 0 10px 0', color: '#1e1b4b' }}>{i.employeeName}</h4>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i> {i.location}<br />
                            <i className="fas fa-user-shield" style={{ marginRight: '6px' }}></i> Reported by: {i.reportingManager}
                        </div>
                        <div style={{ padding: '12px', background: 'white', borderRadius: '10px', color: '#be123c', fontSize: '13px', borderLeft: '4px solid #f43f5e' }}>
                            <strong>Action Taken:</strong> {i.actionTaken}
                        </div>
                        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', color: '#94a3b8' }}>{i.date}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: i.status === 'Closed' ? '#16a34a' : '#f59e0b' }}>{i.status.toUpperCase()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SafetyAccidents;
