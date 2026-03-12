import React from 'react';
import { AssetsData } from '../../types/assets';

interface Props {
    data: AssetsData;
}

const AssetConditionTracker: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-microscope" style={{ color: '#f59e0b', marginRight: '10px' }}></i>
                Asset Health & Condition Monitoring
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {data.allocations.map(alc => (
                    <div key={alc.id} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{alc.assetCode}</div>
                            <span style={{ padding: '4px 10px', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>{alc.conditionAtIssue}</span>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>Assigned To:</div>
                            <div style={{ fontSize: '14px', fontWeight: '700' }}>{alc.employeeName} ({alc.employeeId})</div>
                        </div>

                        <div style={{ background: 'white', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>LAST INSPECTION</span>
                                <span style={{ fontSize: '11px', fontWeight: 'bold' }}>2024-01-20</span>
                            </div>
                            <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '85%', height: '100%', background: '#10b981' }}></div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                                <span style={{ fontSize: '10px', color: '#64748b' }}>Health Score: Good</span>
                                <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>85%</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <button style={{ flex: 1, padding: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Register Damage</button>
                            <button style={{ padding: '8px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}><i className="fas fa-plus"></i> Audit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssetConditionTracker;
