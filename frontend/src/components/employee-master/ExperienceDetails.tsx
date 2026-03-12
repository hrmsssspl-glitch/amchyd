import React from 'react';
import { Experience } from '../../types/employee';

interface Props {
    data: Experience[];
    updateData: (data: Experience[]) => void;
}

const ExperienceDetails: React.FC<Props> = ({ data, updateData }) => {
    const addExperience = () => {
        if (data.length < 5) {
            updateData([...data, {
                employerName: '',
                designation: '',
                periodFrom: '',
                periodTo: '',
                periodTotal: '',
                jobDescription: '',
                salary: '',
                referenceName: '',
                referenceMobile: ''
            }]);
        }
    };

    const removeExperience = (index: number) => {
        const newData = data.filter((_, i) => i !== index);
        updateData(newData);
    };

    const updateItem = (index: number, field: keyof Experience, value: string) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [field]: value };
        updateData(newData);
    };

    return (
        <div className="form-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 className="section-title" style={{ margin: 0 }}>Previous Experience (Max 5)</h3>
                {data.length < 5 && (
                    <button type="button" className="btn btn-secondary" onClick={addExperience}>
                        <i className="fas fa-plus"></i> Add Experience
                    </button>
                )}
            </div>

            {data.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', background: 'white', borderRadius: '24px', border: '2px dashed #e2e8f0', color: '#94a3b8' }}>
                    <i className="fas fa-briefcase" style={{ fontSize: '40px', marginBottom: '15px', color: '#cbd5e1' }}></i>
                    <p style={{ fontWeight: '600' }}>No work history added yet.</p>
                </div>
            )}

            {data.map((item, index) => (
                <div key={index} style={{ marginBottom: '30px', padding: '30px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#4f46e5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800' }}>{index + 1}</div>
                            <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Previous Employment</h4>
                        </div>
                        <button type="button" onClick={() => removeExperience(index)} style={{ padding: '8px 12px', borderRadius: '10px', border: 'none', background: '#fff1f2', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>
                            <i className="fas fa-trash-alt" style={{ marginRight: '6px' }}></i> Remove
                        </button>
                    </div>
                    <div className="form-grid">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Employer Name</label>
                            <input type="text" value={item.employerName} onChange={(e) => updateItem(index, 'employerName', e.target.value)} placeholder="Full Registered Company Name" />
                        </div>
                        <div className="form-group">
                            <label>Designation</label>
                            <input type="text" value={item.designation} onChange={(e) => updateItem(index, 'designation', e.target.value)} placeholder="e.g. Senior Executive" />
                        </div>
                        <div className="form-group">
                            <label>Period From</label>
                            <input type="date" value={item.periodFrom} onChange={(e) => updateItem(index, 'periodFrom', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Period To</label>
                            <input type="date" value={item.periodTo} onChange={(e) => updateItem(index, 'periodTo', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Period Total</label>
                            <input type="text" value={item.periodTotal} onChange={(e) => updateItem(index, 'periodTotal', e.target.value)} placeholder="Computed years/months" />
                        </div>
                        <div className="form-group">
                            <label>Last Drawn Salary</label>
                            <input type="text" value={item.salary} onChange={(e) => updateItem(index, 'salary', e.target.value)} placeholder="Annual CTC" />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Responsibilities</label>
                            <textarea rows={2} value={item.jobDescription} onChange={(e) => updateItem(index, 'jobDescription', e.target.value)} placeholder="Describe key contributions..."></textarea>
                        </div>
                        <div className="form-group">
                            <label>Reference Person</label>
                            <input type="text" value={item.referenceName} onChange={(e) => updateItem(index, 'referenceName', e.target.value)} placeholder="Reporting Manager Name" />
                        </div>
                        <div className="form-group">
                            <label>Reference Contact</label>
                            <input type="tel" value={item.referenceMobile} onChange={(e) => updateItem(index, 'referenceMobile', e.target.value)} placeholder="+91 00000 00000" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExperienceDetails;
