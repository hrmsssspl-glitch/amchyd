import React, { useState } from 'react';
import { ComplianceLicense, LicenseType } from '../../types/compliance';

interface Props {
    licenses: ComplianceLicense[];
    onAddLicense: (newLicense: ComplianceLicense) => void;
}

const LicenseManagement: React.FC<Props> = ({ licenses, onAddLicense }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Labour' as LicenseType,
        number: '',
        validFrom: '',
        validTo: '',
        department: '',
        remarks: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newLicense: ComplianceLicense = {
            id: `LIC-${String(licenses.length + 1).padStart(3, '0')}`,
            type: formData.type,
            number: formData.number,
            validFrom: formData.validFrom,
            validTo: formData.validTo,
            department: formData.department,
            status: 'Active',
            remarks: formData.remarks
        };

        onAddLicense(newLicense);
        setShowForm(false);
        setFormData({
            type: 'Labour',
            number: '',
            validFrom: '',
            validTo: '',
            department: '',
            remarks: ''
        });
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>License & Registration Management</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <i className="fas fa-file-contract" style={{ marginRight: '8px' }}></i> Add New License
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f0fdf4', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #bbf7d0', animation: 'slideDown 0.3s ease' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#166534' }}>Register New License</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>License Type *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as LicenseType })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '14px' }}
                            >
                                <option value="Labour">Labour License</option>
                                <option value="Trade">Trade License</option>
                                <option value="Other">Other Registration</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>License Number *</label>
                            <input
                                required
                                type="text"
                                placeholder="Govt-issued number"
                                value={formData.number}
                                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Department *</label>
                            <input
                                required
                                type="text"
                                placeholder="Applicable department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Valid From *</label>
                            <input
                                required
                                type="date"
                                value={formData.validFrom}
                                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Valid To *</label>
                            <input
                                required
                                type="date"
                                value={formData.validTo}
                                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Remarks / Notes</label>
                        <textarea
                            placeholder="Additional details about the license..."
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #86efac', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 25px', borderRadius: '8px', border: '1px solid #86efac', background: 'white', color: '#166534', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>Register License</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {licenses.map((l) => (
                    <div key={l.id} style={{ border: '1px solid #e2e8f0', borderRadius: '15px', padding: '20px', background: l.status === 'Active' ? '#f0fdf4' : '#fef2f2', transition: 'all 0.3s ease' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 800, color: '#1e293b' }}>{l.id}</span>
                            <span style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                background: l.status === 'Active' ? '#22c55e' : '#ef4444',
                                color: 'white',
                                padding: '3px 10px',
                                borderRadius: '30px'
                            }}>{l.status}</span>
                        </div>
                        <h4 style={{ margin: '0 0 5px 0', color: l.status === 'Active' ? '#166534' : '#991b1b' }}>{l.type} - {l.number}</h4>
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
                            Dept: <strong>{l.department}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#475569' }}>
                            <span><i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i> {l.validFrom}</span>
                            <span style={{ fontWeight: 700 }}><i className="fas fa-history" style={{ marginRight: '5px' }}></i> {l.validTo}</span>
                        </div>
                        {l.remarks && (
                            <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                                {l.remarks}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LicenseManagement;
