import React, { useState } from 'react';
import { CompanyInfo } from '../../types/organization';

interface CompanyDetailsProps {
    data: CompanyInfo;
    updateData: (data: Partial<CompanyInfo>) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ data, updateData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [originalData, setOriginalData] = useState<CompanyInfo | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        updateData({ [name]: value });
    };

    const handleEdit = () => {
        setOriginalData(data); // Backup current data
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/organization/company', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const savedData = await res.json();
                updateData(savedData); // Sync with backend response
                setIsEditing(false);
                alert('Company details saved successfully!');
            } else {
                const errText = await res.text();
                console.error('Save failed:', errText);
                alert('Failed to save company details. Please check console for details.');
            }
        } catch (error) {
            console.error('Error saving company details:', error);
            alert('An error occurred while saving.');
        }
    };

    const handleCancel = () => {
        if (originalData) {
            updateData(originalData); // Revert to backup
        }
        setIsEditing(false);
    };

    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-building" style={{ color: '#4f46e5' }}></i>
                    Company Information (Organization Master)
                </h3>
                <div>
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            style={{ padding: '8px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            <i className="fas fa-edit"></i> Edit
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={handleCancel}
                                style={{ padding: '8px 20px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                style={{ padding: '8px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <i className="fas fa-save"></i> Save
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        value={data.companyName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Company Code</label>
                    <input
                        type="text"
                        name="companyCode"
                        value={data.companyCode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>CIN / GST Number</label>
                    <input
                        type="text"
                        name="cinGst"
                        value={data.cinGst}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Establishment Year</label>
                    <input
                        type="text"
                        name="establishmentYear"
                        value={data.establishmentYear}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Industry Type</label>
                    <select
                        name="industryType"
                        value={data.industryType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    >
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Services">Services</option>
                        <option value="Retail">Retail</option>
                        <option value="Technology">Technology</option>
                        <option value="Construction">Construction</option>
                        <option value="Consulting">Consulting</option>
                    </select>
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>PAN Number</label>
                    <input
                        type="text"
                        name="panNumber"
                        value={data.panNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Contact Email</label>
                    <input
                        type="email"
                        name="contactEmail"
                        value={data.contactEmail}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Contact Phone</label>
                    <input
                        type="text"
                        name="contactPhone"
                        value={data.contactPhone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Website URL</label>
                    <input
                        type="text"
                        name="websiteUrl"
                        value={data.websiteUrl}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Registered Address</label>
                    <textarea
                        name="registeredAddress"
                        value={data.registeredAddress}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        rows={2}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#444', marginBottom: '8px' }}>Corporate Address</label>
                    <textarea
                        name="corporateAddress"
                        value={data.corporateAddress}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="form-control"
                        rows={2}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: isEditing ? 'white' : '#f8fafc' }}
                    />
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '60px', height: '60px', background: '#e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    {data.logoUrl ? <img src={data.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <i className="fas fa-image fa-2x"></i>}
                </div>
                <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}>Company Logo / Brand</h4>
                    <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>Click to upload company logo for reports and headers.</p>
                </div>
                {isEditing && (
                    <button className="btn btn-secondary" style={{ marginLeft: 'auto', fontSize: '12px' }}>Upload Logo</button>
                    // Note: Actual upload logic would require a separate handler or file input.
                )}
            </div>
        </div>
    );
};

export default CompanyDetails;
