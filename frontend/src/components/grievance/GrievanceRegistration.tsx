import React, { useState } from 'react';
import { Grievance, GrievanceCategory, ConfidentialityLevel } from '../../types/grievance';

interface Props {
    grievances: Grievance[];
    onAddGrievance: (newGrievance: Grievance) => void;
}

const GrievanceRegistration: React.FC<Props> = ({ grievances, onAddGrievance }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        empId: '',
        category: 'Work' as GrievanceCategory,
        description: '',
        date: new Date().toISOString().split('T')[0],
        confidentiality: 'Normal' as ConfidentialityLevel
    });

    const mockEmployees = [
        { id: 'EMP001', name: 'John Doe', dept: 'Operations' },
        { id: 'EMP045', name: 'Sarah Smith', dept: 'Sales' },
        { id: 'EMP089', name: 'Mike Johnson', dept: 'IT' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employee = mockEmployees.find(emp => emp.id === formData.empId);

        if (!employee) {
            alert('Invalid Employee ID. Use EMP001, EMP045, or EMP089 for demo.');
            return;
        }

        const newGrievance: Grievance = {
            id: `GR-2024-${String(grievances.length + 1).padStart(3, '0')}`,
            employeeId: employee.id,
            employeeName: employee.name,
            department: employee.dept,
            category: formData.category,
            description: formData.description,
            date: formData.date,
            confidentiality: formData.confidentiality,
            status: 'Open'
        };

        onAddGrievance(newGrievance);
        setShowForm(false);
        setFormData({
            empId: '',
            category: 'Work',
            description: '',
            date: new Date().toISOString().split('T')[0],
            confidentiality: 'Normal'
        });
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#164e63', fontSize: '20px' }}>Grievance Registration</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ padding: '10px 20px', background: '#06b6d4', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> New Grievance
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#ecfeff', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #cffafe', animation: 'slideDown 0.3s ease' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#0891b2' }}>Register New Complaint</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0e7490' }}>Employee ID *</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. EMP001"
                                value={formData.empId}
                                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #a5f3fc', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0e7490' }}>Grievance Category *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as GrievanceCategory })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #a5f3fc', fontSize: '14px' }}
                            >
                                <option value="Work">Work Related</option>
                                <option value="Pay">Pay & Compensation</option>
                                <option value="Behavior">Behavioral Issue</option>
                                <option value="Policy">Policy Related</option>
                                <option value="Harassment">Harassment</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0e7490' }}>Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #a5f3fc', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0e7490' }}>Confidentiality</label>
                            <select
                                value={formData.confidentiality}
                                onChange={(e) => setFormData({ ...formData, confidentiality: e.target.value as ConfidentialityLevel })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #a5f3fc', fontSize: '14px' }}
                            >
                                <option value="Normal">Normal</option>
                                <option value="High">High (Restricted)</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 700, color: '#0e7490' }}>Detailed Issue *</label>
                        <textarea
                            required
                            placeholder="Describe the concern in detail..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #a5f3fc', fontSize: '14px', minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 25px', borderRadius: '8px', border: '1px solid #a5f3fc', background: 'white', color: '#0891b2', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#06b6d4', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Submit Grievance</button>
                    </div>
                </form>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ecfeff' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Grievance ID</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Category</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Date</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Confidentiality</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grievances.map((g) => (
                            <tr key={g.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px', fontWeight: 700, color: '#06b6d4' }}>{g.id}</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#164e63' }}>{g.employeeName}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{g.employeeId}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '15px', background: '#f1f5f9', fontSize: '12px', color: '#475569' }}>{g.category}</span>
                                </td>
                                <td style={{ padding: '15px', color: '#475569' }}>{g.date}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ fontSize: '12px', color: g.confidentiality === 'High' ? '#ef4444' : '#64748b' }}>
                                        <i className={`fas ${g.confidentiality === 'High' ? 'fa-lock' : 'fa-lock-open'}`} style={{ marginRight: '5px' }}></i>
                                        {g.confidentiality}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>{g.status}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#06b6d4', cursor: 'pointer' }}><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GrievanceRegistration;
