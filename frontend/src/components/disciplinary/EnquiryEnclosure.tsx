import React, { useState } from 'react';
import { EnquiryDetails, DisciplinaryCase } from '../../types/disciplinary';

interface Props {
    enquiries: EnquiryDetails[];
    cases: DisciplinaryCase[];
    onAddEnquiry: (newEnquiry: EnquiryDetails) => void;
}

const EnquiryEnclosure: React.FC<Props> = ({ enquiries, cases, onAddEnquiry }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        caseId: '',
        type: 'Domestic' as 'Domestic' | 'Internal',
        committeeMembers: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        findings: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const relatedCase = cases.find(c => c.id === formData.caseId);
        if (!relatedCase) {
            alert('Please select a valid Case ID.');
            return;
        }

        const newEnquiry: EnquiryDetails = {
            caseId: formData.caseId,
            type: formData.type,
            committeeMembers: formData.committeeMembers.split(',').map(m => m.trim()).filter(m => m !== ''),
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
            findings: formData.findings
        };

        onAddEnquiry(newEnquiry);
        setShowForm(false);
        setFormData({
            caseId: '',
            type: 'Domestic',
            committeeMembers: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            findings: ''
        });
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Enquiry & Committee Details</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ padding: '10px 20px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <i className="fas fa-users" style={{ marginRight: '8px' }}></i> Form Committee
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f5f3ff', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #ddd6fe', animation: 'slideDown 0.3s ease' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#5b21b6' }}>Form Enquiry Committee</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#5b21b6' }}>Select Case Track ID *</label>
                            <select
                                required
                                value={formData.caseId}
                                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #c4b5fd', fontSize: '14px' }}
                            >
                                <option value="">-- Active Cases --</option>
                                {cases.filter(c => c.status !== 'Closed').map(c => (
                                    <option key={c.id} value={c.id}>{c.id} - {c.employeeName}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#5b21b6' }}>Enquiry Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Domestic' | 'Internal' })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #c4b5fd', fontSize: '14px' }}
                            >
                                <option value="Domestic">Domestic Enquiry</option>
                                <option value="Internal">Internal Enquiry</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#5b21b6' }}>Start Date *</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #c4b5fd', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#5b21b6' }}>Est. End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #c4b5fd', fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#5b21b6' }}>Committee Members (Comma separated names) *</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Rahul Sharma, Priya Verma, Adv. Malhotra"
                            value={formData.committeeMembers}
                            onChange={(e) => setFormData({ ...formData, committeeMembers: e.target.value })}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #c4b5fd', fontSize: '14px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#5b21b6' }}>Initial Findings / Terms of Reference</label>
                        <textarea
                            placeholder="Brief description of the enquiry scope..."
                            value={formData.findings}
                            onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #c4b5fd', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 25px', borderRadius: '8px', border: '1px solid #c4b5fd', background: 'white', color: '#5b21b6', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#8b5cf6', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(139, 92, 246, 0.2)' }}>Establish Committee</button>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {[...enquiries].reverse().map((e) => {
                    const relatedCase = cases.find(c => c.id === e.caseId);
                    return (
                        <div key={e.caseId} style={{ border: '1px solid #f1f5f9', borderRadius: '15px', padding: '20px', background: '#f8fafc', transition: 'all 0.3s ease' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: 800, color: '#8b5cf6', fontSize: '15px' }}>{e.caseId}</span>
                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', background: '#ede9fe', padding: '3px 10px', borderRadius: '30px', textTransform: 'uppercase' }}>{e.type} Enquiry</span>
                            </div>
                            <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{relatedCase?.employeeName || 'Unknown Employee'}</h4>
                            <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px', display: 'flex', gap: '15px' }}>
                                <span><i className="fas fa-calendar-check" style={{ marginRight: '6px', color: '#8b5cf6' }}></i> Starts: {e.startDate}</span>
                                {e.endDate && <span><i className="fas fa-flag-checkered" style={{ marginRight: '6px', color: '#ec4899' }}></i> Est. End: {e.endDate}</span>}
                            </div>
                            <div style={{ background: 'white', padding: '12px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Committee Members</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {e.committeeMembers.map((m, idx) => (
                                        <span key={idx} style={{ background: '#f8fafc', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', color: '#475569', border: '1px solid #e2e8f0', fontWeight: 500 }}>{m}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={{ padding: '12px', background: '#f5f3ff', borderRadius: '10px', color: '#5b21b6', fontSize: '13px', borderLeft: '4px solid #8b5cf6', marginBottom: '15px' }}>
                                <strong>Findings / Scope:</strong><br />
                                <span style={{ opacity: 0.8 }}>{e.findings || 'Waiting for primary investigation report...'}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button style={{ flex: 1, padding: '10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <i className="fas fa-file-signature"></i> MoM
                                </button>
                                <button style={{ flex: 1, padding: '10px', background: 'white', color: '#8b5cf6', border: '1px solid #8b5cf6', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <i className="fas fa-upload"></i> Final Report
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EnquiryEnclosure;
