import React from 'react';
import { Qualification } from '../../types/employee';

interface Props {
    data: Qualification[];
    updateData: (data: Qualification[]) => void;
}

const EducationDetails: React.FC<Props> = ({ data, updateData }) => {
    const addQualification = () => {
        if (data.length < 3) {
            updateData([...data, { qualification: '', boardUniversityAddress: '', specialization: '', yearOfPassing: '' }]);
        }
    };

    const removeQualification = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        updateData(newData);
    };

    const updateItem = (index: number, field: keyof Qualification, value: string) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        updateData(newData);
    };

    return (
        <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Education Details (Max 3)</h3>
                {data.length < 3 && (
                    <button type="button" className="btn btn-secondary" onClick={addQualification}>
                        <i className="fas fa-plus"></i> Add Qualification
                    </button>
                )}
            </div>

            {data.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                    <i className="fas fa-graduation-cap" style={{ fontSize: '40px', marginBottom: '15px', color: '#cbd5e1' }}></i>
                    <p style={{ fontWeight: '600' }}>No academic records added yet.</p>
                </div>
            )}

            {data.map((item, index) => (
                <div key={index} style={{ marginBottom: '30px', padding: '30px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>{index + 1}</div>
                            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Academic Level</h4>
                        </div>
                        <button type="button" onClick={() => removeQualification(index)} style={{ padding: '8px 12px', borderRadius: '10px', border: 'none', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                            <i className="fas fa-trash-alt" style={{ marginRight: '6px' }}></i> Remove
                        </button>
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Qualification / Degree</label>
                            <input type="text" value={item.qualification} onChange={(e) => updateItem(index, 'qualification', e.target.value)} placeholder="e.g. B.Tech / SSC" />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Board / University / Institution Details</label>
                            <input type="text" value={item.boardUniversityAddress} onChange={(e) => updateItem(index, 'boardUniversityAddress', e.target.value)} placeholder="Enter Full Institution Details & Location" />
                        </div>
                        <div className="form-group">
                            <label>Specialization</label>
                            <input type="text" value={item.specialization} onChange={(e) => updateItem(index, 'specialization', e.target.value)} placeholder="e.g. Computer Science" />
                        </div>
                        <div className="form-group">
                            <label>Year of Passing</label>
                            <input type="text" value={item.yearOfPassing} onChange={(e) => updateItem(index, 'yearOfPassing', e.target.value)} placeholder="e.g. 2020" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EducationDetails;
