import React from 'react';
import { AssetsData, AssetReturn } from '../../types/assets';

interface Props {
    data: AssetsData;
    onUpdate: (ret: AssetReturn[]) => void;
}

const AssetReturnRecovery: React.FC<Props> = ({ data, onUpdate }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-undo" style={{ color: '#f59e0b', marginRight: '10px' }}></i>
                Asset Return & Exit Clearance Recovery
            </h3>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Employee Details</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Asset Code</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Return Date</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Condition</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Recovery (₹)</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Clearance</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.returns.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No active asset recovery processes</td>
                            </tr>
                        ) : (
                            data.returns.map((ret, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    {/* Data rows would go here */}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '30px', background: '#fffbeb', padding: '25px', borderRadius: '15px', border: '1px solid #fef3c7' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ background: '#f59e0b', color: 'white', padding: '10px', borderRadius: '10px' }}>
                        <i className="fas fa-exclamation-triangle fa-2x"></i>
                    </div>
                    <div>
                        <h4 style={{ margin: '0 0 5px 0', color: '#92400e' }}>Integration with Exit Clearance</h4>
                        <p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: '1.6' }}>
                            Asset returns are a mandatory step in the <strong>Exit Management</strong> workflow. Any damage recovery amounts entered here will be automatically deducted from the employee's <strong>Full & Final (F&F) Settlement</strong> via the Payroll module integration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetReturnRecovery;
