import React, { useState } from 'react';
import { ShowCauseNotice, DisciplinaryCase } from '../../types/disciplinary';

interface Props {
    notices: ShowCauseNotice[];
    cases: DisciplinaryCase[];
    onAddNotice: (newNotice: ShowCauseNotice) => void;
}

const ShowCauseNoticeDesk: React.FC<Props> = ({ notices, cases, onAddNotice }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        caseId: '',
        dueDate: '',
        hrRemarks: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const relatedCase = cases.find(c => c.id === formData.caseId);
        if (!relatedCase) {
            alert('Invalid Case ID. Please select a valid Case ID from the list.');
            return;
        }

        const newNotice: ShowCauseNotice = {
            noticeNo: `SCN-${String(notices.length + 1).padStart(3, '0')}`,
            caseId: formData.caseId,
            issueDate: new Date().toISOString().split('T')[0],
            responseDueDate: formData.dueDate,
            responseStatus: 'Pending',
            hrRemarks: formData.hrRemarks
        };

        onAddNotice(newNotice);
        setShowForm(false);
        setFormData({ caseId: '', dueDate: '', hrRemarks: '' });
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Show Cause Notice Management</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ padding: '10px 20px', background: '#eab308', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <i className="fas fa-paper-plane" style={{ marginRight: '8px' }}></i> Issue New Notice
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#fefce8', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #fef08a', animation: 'slideDown 0.3s ease' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#854d0e' }}>Draft Show Cause Notice</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#854d0e' }}>Select Case Tracking ID *</label>
                            <select
                                required
                                value={formData.caseId}
                                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '14px' }}
                            >
                                <option value="">-- Select Active Case --</option>
                                {cases.filter(c => c.status !== 'Closed').map(c => (
                                    <option key={c.id} value={c.id}>{c.id} - {c.employeeName} ({c.employeeId})</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#854d0e' }}>Response Due Date *</label>
                            <input
                                required
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#854d0e' }}>HR Remarks / Instructions</label>
                        <textarea
                            placeholder="Specific instructions for the employee regarding the response..."
                            value={formData.hrRemarks}
                            onChange={(e) => setFormData({ ...formData, hrRemarks: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #fde047', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 25px', borderRadius: '8px', border: '1px solid #fde047', background: 'white', color: '#854d0e', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#eab308', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(234, 179, 8, 0.2)' }}>Dispatch Notice</button>
                    </div>
                </form>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Notice No</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Case Tracking</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Issue Date</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Due Date</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Response</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...notices].reverse().map((n) => {
                            const relatedCase = cases.find(c => c.id === n.caseId);
                            return (
                                <tr key={n.noticeNo} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '15px', fontWeight: 700, color: '#eab308' }}>{n.noticeNo}</td>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{n.caseId}</div>
                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{relatedCase?.employeeName || 'N/A'} ({relatedCase?.employeeId})</div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#475569' }}>{n.issueDate}</td>
                                    <td style={{ padding: '15px', color: '#e11d48', fontWeight: 700 }}>{n.responseDueDate}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: 800,
                                            background: n.responseStatus === 'Submitted' ? '#f0fdf4' : '#fff1f2',
                                            color: n.responseStatus === 'Submitted' ? '#16a34a' : '#e11d48',
                                            textTransform: 'uppercase'
                                        }}>
                                            {n.responseStatus}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px' }}>
                                        <button style={{ border: 'none', background: 'none', color: '#6366f1', cursor: 'pointer' }} title="View Details">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '10px' }} title="Print Notice">
                                            <i className="fas fa-print"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShowCauseNoticeDesk;
