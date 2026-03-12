import React from 'react';
import { MedicalDetails, LanguageSkills } from '../../types/employee';

interface Props {
    medical: MedicalDetails;
    languages: LanguageSkills;
    updateMedical: (data: Partial<MedicalDetails>) => void;
    updateLanguages: (data: Partial<LanguageSkills>) => void;
}

const MedicalLanguages: React.FC<Props> = ({ medical, languages, updateMedical, updateLanguages }) => {
    return (
        <div className="form-section">
            <h3 className="section-title">Medical Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Allergic</label>
                    <input type="text" value={medical.allergic} onChange={(e) => updateMedical({ allergic: e.target.value })} placeholder="Dust/Pollen/None" />
                </div>
                <div className="form-group">
                    <label>Blood Pressure</label>
                    <input type="text" value={medical.bloodPressure} onChange={(e) => updateMedical({ bloodPressure: e.target.value })} placeholder="Low/Normal/High" />
                </div>
                <div className="form-group">
                    <label>Sugar</label>
                    <input type="text" value={medical.sugar} onChange={(e) => updateMedical({ sugar: e.target.value })} placeholder="Normal/Diabetic" />
                </div>
                <div className="form-group">
                    <label>Eye Sight</label>
                    <input type="text" value={medical.eyeSight} onChange={(e) => updateMedical({ eyeSight: e.target.value })} placeholder="Normal/Power/Specs" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Any Major Illness</label>
                    <textarea rows={2} value={medical.majorIllness} onChange={(e) => updateMedical({ majorIllness: e.target.value })} placeholder="Describe if any..."></textarea>
                </div>
            </div>

            <h3 className="section-title" style={{ marginTop: '30px' }}>Languages Known</h3>
            <div style={{ background: 'white', padding: '25px', borderRadius: '20px', display: 'flex', gap: '50px', border: '1.5px solid #f1f5f9', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={languages.telugu} onChange={(e) => updateLanguages({ telugu: e.target.checked })} />
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Telugu</span>
                </label>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={languages.english} onChange={(e) => updateLanguages({ english: e.target.checked })} />
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>English</span>
                </label>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="checkbox" checked={languages.hindi} onChange={(e) => updateLanguages({ hindi: e.target.checked })} />
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>Hindi</span>
                </label>
            </div>
            <p className="form-note" style={{ marginTop: '10px' }}>Tick the languages the employee can speak/read/write.</p>
        </div>
    );
};

export default MedicalLanguages;
