import React from 'react';
import { AssetsData, AssetAllocation } from '../../types/assets';

interface Props {
    data: AssetsData;
    onUpdate: (alc: AssetAllocation[]) => void;
}

const AssetAllocationForm: React.FC<Props> = ({ data, onUpdate }) => {
    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-handshake" style={{ color: '#f59e0b', marginRight: '10px' }}></i>
                Asset Issuance & Allocation Desk
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                {/* Form Side */}
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Employee Selection</label>
                            <input placeholder="Search Employee ID or Name" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Select Asset Code</label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                {data.inventory.filter(a => a.status === 'Available').map(a => (
                                    <option key={a.id} value={a.code}>{a.code} - {a.type} ({a.model})</option>
                                ))}
                                {data.inventory.filter(a => a.status === 'Available').length === 0 && <option disabled>No Available Assets</option>}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Accessories Issued</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> Charger</label>
                                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> Laptop Bag</label>
                                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> Wireless Mouse</label>
                                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px' }}><input type="checkbox" /> SIM Card</label>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Condition at Issue</label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                <option>New</option>
                                <option>Good</option>
                                <option>Used</option>
                            </select>
                        </div>
                        <button style={{ marginTop: '10px', padding: '12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Allocate Asset</button>
                    </div>
                </div>

                {/* Table Side */}
                <div>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#475569' }}>Recent Allocations</h4>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ background: '#f1f5f9' }}>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Asset Code</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Issue Date</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Ack status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.allocations.map((alc, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{alc.employeeName}</div>
                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{alc.employeeId}</div>
                                        </td>
                                        <td style={{ padding: '12px', color: '#6366f1', fontWeight: 'bold' }}>{alc.assetCode}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{alc.issueDate}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            {alc.acknowledgementSigned ?
                                                <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i> :
                                                <i className="fas fa-clock" style={{ color: '#f59e0b' }}></i>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetAllocationForm;
