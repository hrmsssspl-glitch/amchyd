import React, { useState } from 'react';
import { DisciplinaryCase, DisciplinarySeverity } from '../../types/disciplinary';

interface Props {
    cases: DisciplinaryCase[];
    onAddCase: (newCase: DisciplinaryCase) => void;
}

const CaseRegistration: React.FC<Props> = ({ cases, onAddCase }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        empId: '',
        severity: 'Minor' as DisciplinarySeverity,
        source: 'Manager',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Mock employee database for lookup
    const mockEmployees = [
        { id: 'EMP001', name: 'John Doe', dept: 'Operations' },
        { id: 'EMP045', name: 'Sarah Smith', dept: 'Sales' },
        { id: 'EMP089', name: 'Mike Johnson', dept: 'IT' },
        { id: 'EMP101', name: 'Robert Wilson', dept: 'Finance' },
        { id: 'EMP102', name: 'Emma Davis', dept: 'Marcom' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employee = mockEmployees.find(emp => emp.id === formData.empId);

        if (!employee) {
            alert('Invalid Employee ID. Please enter a valid ID (e.g., EMP001, EMP101).');
            return;
        }

        const newCase: DisciplinaryCase = {
            id: `DC-2024-${String(cases.length + 1).padStart(3, '0')}`,
            employeeId: employee.id,
            employeeName: employee.name,
            department: employee.dept,
            complaintSource: formData.source,
            description: formData.description,
            complaintDate: formData.date,
            severity: formData.severity,
            status: 'Open'
        };

        onAddCase(newCase);
        setShowForm(false);
        setFormData({
            empId: '',
            severity: 'Minor',
            source: 'Manager',
            description: '',
            date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Complaint / Case Registration</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ padding: '10px 20px', background: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> New Case
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #e2e8f0', animation: 'slideDown 0.3s ease' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#0f172a' }}>Register New Incident</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Employee ID *</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. EMP001"
                                value={formData.empId}
                                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Complaint Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Severity Level</label>
                            <select
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value as DisciplinarySeverity })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                            >
                                <option value="Minor">Minor</option>
                                <option value="Major">Major</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Source</label>
                            <select
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                            >
                                <option value="Manager">Manager</option>
                                <option value="HR">HR</option>
                                <option value="Internal">Internal Audit</option>
                                <option value="External">Client / External</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Detailed Description *</label>
                        <textarea
                            required
                            placeholder="Provide full context of the incident..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 25px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#f97316', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px rgba(249, 115, 22, 0.2)' }}>Register Case</button>
                    </div>
                </form>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Case ID</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Severity</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Department</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map((c) => (
                            <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                                <td style={{ padding: '15px', fontWeight: 700, color: '#f97316' }}>{c.id}</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.employeeName}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px', color: '#475569' }}>{c.complaintDate}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: c.severity === 'Critical' ? '#fff1f2' : c.severity === 'Major' ? '#fff7ed' : '#f0fdf4',
                                        color: c.severity === 'Critical' ? '#e11d48' : c.severity === 'Major' ? '#ea580c' : '#16a34a'
                                    }}>
                                        {c.severity}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', color: '#475569' }}>{c.department}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        textTransform: 'uppercase'
                                    }}>
                                        {c.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#6366f1', cursor: 'pointer', marginRight: '10px' }} title="Edit">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }} title="Documents">
                                        <i className="fas fa-file-upload"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CaseRegistration;
