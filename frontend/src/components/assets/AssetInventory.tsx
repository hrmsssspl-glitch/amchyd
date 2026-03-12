import React, { useState } from 'react';
import { Asset } from '../../types/assets';

interface Props {
    data: Asset[];
    onUpdate: (inv: Asset[]) => void;
}

const AssetInventory: React.FC<Props> = ({ data, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Company Asset Master Registry</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {showForm ? 'Cancel' : '+ Register New Asset'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Asset Type</label>
                            <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                                <option>Laptop</option>
                                <option>Mobile</option>
                                <option>PC</option>
                                <option>SIM</option>
                                <option>ID Card</option>
                                <option>Others</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Model Name</label>
                            <input placeholder="e.g. Dell Latitude 5420" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Asset Code (Unique)</label>
                            <input placeholder="e.g. SSS-LP-101" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Purchase Value</label>
                            <input type="number" placeholder="₹" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Purchase Date</label>
                            <input type="date" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button style={{ width: '100%', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>Save Asset</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', color: '#475569' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Asset ID / Code</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Type & Model</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Value</th>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Vendor</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((asset, idx) => (
                            <tr key={asset.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{asset.id}</div>
                                    <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: '600' }}>{asset.code}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '600' }}>{asset.type}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{asset.model}</div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>₹{asset.value.toLocaleString()}</td>
                                <td style={{ padding: '15px' }}>{asset.vendorName}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold',
                                        background: asset.status === 'Available' ? '#dcfce7' : '#fee2e2',
                                        color: asset.status === 'Available' ? '#166534' : '#991b1b'
                                    }}>{asset.status}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssetInventory;
