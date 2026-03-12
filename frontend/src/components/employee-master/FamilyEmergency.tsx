import React from 'react';
import { FamilyMember, EmergencyContact } from '../../types/employee';

interface Props {
    family: FamilyMember[];
    emergency: EmergencyContact[];
    updateFamily: (data: FamilyMember[]) => void;
    updateEmergency: (data: EmergencyContact[]) => void;
}

const FamilyEmergency: React.FC<Props> = ({ family, emergency, updateFamily, updateEmergency }) => {
    const addFamily = () => {
        if (family.length < 5) {
            updateFamily([...family, { name: '', relationship: '', dob: '', occupation: '' }]);
        }
    };

    const removeFamily = (index: number) => {
        updateFamily(family.filter((_, i) => i !== index));
    };

    const updateFamilyItem = (index: number, field: keyof FamilyMember, value: string) => {
        const newData = [...family];
        newData[index] = { ...newData[index], [field]: value };
        updateFamily(newData);
    };

    const addEmergency = () => {
        if (emergency.length < 2) {
            updateEmergency([...emergency, { name: '', relationship: '', address: '', mobile: '' }]);
        }
    };

    const removeEmergency = (index: number) => {
        updateEmergency(emergency.filter((_, i) => i !== index));
    };

    const updateEmergencyItem = (index: number, field: keyof EmergencyContact, value: string) => {
        const newData = [...emergency];
        newData[index] = { ...newData[index], [field]: value };
        updateEmergency(newData);
    };

    return (
        <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Family Details (Max 5)</h3>
                {family.length < 5 && (
                    <button type="button" className="btn btn-secondary" onClick={addFamily}>
                        <i className="fas fa-plus"></i> Add Family Member
                    </button>
                )}
            </div>

            {family.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', color: '#94a3b8', marginBottom: '30px' }}>
                    No family details added.
                </div>
            )}

            {family.map((item, index) => (
                <div key={index} style={{ marginBottom: '25px', padding: '25px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800' }}>{index + 1}</div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>Family Member</h4>
                        </div>
                        <button type="button" onClick={() => removeFamily(index)} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={item.name} onChange={(e) => updateFamilyItem(index, 'name', e.target.value)} placeholder="Full Name" />
                        </div>
                        <div className="form-group">
                            <label>Relationship</label>
                            <input type="text" value={item.relationship} onChange={(e) => updateFamilyItem(index, 'relationship', e.target.value)} placeholder="e.g. Spouse" />
                        </div>
                        <div className="form-group">
                            <label>DOB</label>
                            <input type="date" value={item.dob} onChange={(e) => updateFamilyItem(index, 'dob', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Occupation</label>
                            <input type="text" value={item.occupation} onChange={(e) => updateFamilyItem(index, 'occupation', e.target.value)} placeholder="Current Status" />
                        </div>
                    </div>
                </div>
            ))}

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0 20px 0' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Emergency Contacts (Max 2)</h3>
                {emergency.length < 2 && (
                    <button type="button" className="btn btn-secondary" onClick={addEmergency}>
                        <i className="fas fa-plus"></i> Add Contact
                    </button>
                )}
            </div>

            {emergency.map((item, index) => (
                <div key={index} style={{ marginBottom: '25px', padding: '25px', background: '#fffafb', border: '1.5px solid #fee2e2', borderRadius: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800' }}>{index + 1}</div>
                            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#b91c1c' }}>Emergency Contact</h4>
                        </div>
                        <button type="button" onClick={() => removeEmergency(index)} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: '#fee2e2', color: '#b91c1c', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }}>
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" value={item.name} onChange={(e) => updateEmergencyItem(index, 'name', e.target.value)} placeholder="Full Name" />
                        </div>
                        <div className="form-group">
                            <label>Relation</label>
                            <input type="text" value={item.relationship} onChange={(e) => updateEmergencyItem(index, 'relationship', e.target.value)} placeholder="e.g. Sister" />
                        </div>
                        <div className="form-group">
                            <label>Mobile</label>
                            <input type="tel" value={item.mobile} onChange={(e) => updateEmergencyItem(index, 'mobile', e.target.value)} placeholder="Emergency No" />
                        </div>
                        <div className="form-group">
                            <label>Location/Address</label>
                            <input type="text" value={item.address} onChange={(e) => updateEmergencyItem(index, 'address', e.target.value)} placeholder="Locality" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FamilyEmergency;
