import React from 'react';
import { KRA } from '../../types/pms';

interface Props {
    kras: KRA[];
}

const GoalSetting: React.FC<Props> = ({ kras }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-bullseye" style={{ color: '#6366f1' }}></i>
                Goal Setting & KRA Definition
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
                {kras.map(kra => (
                    <div key={kra.id} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>{kra.name}</div>
                            <span style={{ padding: '4px 10px', background: '#6366f1', color: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{kra.weightage}% Weight</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 15px 0' }}>{kra.description}</p>

                        <div style={{ display: 'flex', gap: '15px', borderTop: '1px dashed #cbd5e1', paddingTop: '15px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Timeline</label>
                                <div style={{ fontSize: '12px', fontWeight: '600' }}>{kra.startDate} - {kra.endDate}</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Status</label>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{kra.approvalStatus}</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button style={{ flex: 1, padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>View KPIs</button>
                            <button style={{ padding: '8px 12px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><i className="fas fa-edit"></i></button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', border: '2px dashed #cbd5e1', borderRadius: '15px', textAlign: 'center', cursor: 'pointer' }}>
                <i className="fas fa-plus-circle fa-2x" style={{ color: '#6366f1', marginBottom: '10px' }}></i>
                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>Add New Goal / KRA</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Define key responsibilities for the current period</div>
            </div>
        </div>
    );
};

export default GoalSetting;
