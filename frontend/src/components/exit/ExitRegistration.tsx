import React, { useState } from 'react';
import { ExitRecord, ExitType } from '../../types/exit';

interface Props {
    exits: ExitRecord[];
    onAddExit: (newExit: ExitRecord) => void;
}

const ExitRegistration: React.FC<Props> = ({ exits, onAddExit }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        empId: '',
        resDate: new Date().toISOString().split('T')[0],
        lastDay: '',
        type: 'Voluntary' as ExitType,
        notice: 30
    });

    const mockEmployees = [
        { id: 'EMP001', name: 'John Doe', dept: 'Operations', des: 'Sr. Associate' },
        { id: 'EMP045', name: 'Sarah Smith', dept: 'Sales', des: 'Manager' },
        { id: 'EMP089', name: 'Mike Johnson', dept: 'IT', des: 'Developer' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employee = mockEmployees.find(emp => emp.id === formData.empId);

        if (!employee) {
            alert('Invalid Employee ID. Use EMP001, EMP045, or EMP089 for demo.');
            return;
        }

        const newExit: ExitRecord = {
            id: employee.id,
            name: employee.name,
            department: employee.dept,
            designation: employee.des,
            employmentType: 'Permanent',
            resignationDate: formData.resDate,
            lastWorkingDay: formData.lastDay,
            noticePeriod: formData.notice,
            exitType: formData.type,
            status: 'In Process'
        };

        onAddExit(newExit);
        setShowForm(false);
        setFormData({
            empId: '',
            resDate: new Date().toISOString().split('T')[0],
            lastDay: '',
            type: 'Voluntary',
            notice: 30
        });
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px' }}>Employee Exit Master</h3>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        style={{ padding: '10px 20px', background: '#f43f5e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <i className="fas fa-plus" style={{ marginRight: '8px' }}></i> New Resignation
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#fff1f2', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #fecdd3', animation: 'slideDown 0.3s ease' }}>
                    <h4 style={{ margin: '0 0 20px 0', color: '#be123c' }}>Process Resignation</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#9f1239' }}>Employee ID *</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. EMP001"
                                value={formData.empId}
                                onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#9f1239' }}>Resignation Date</label>
                            <input
                                type="date"
                                value={formData.resDate}
                                onChange={(e) => setFormData({ ...formData, resDate: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#9f1239' }}>Last Working Day *</label>
                            <input
                                required
                                type="date"
                                value={formData.lastDay}
                                onChange={(e) => setFormData({ ...formData, lastDay: e.target.value })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '13px', fontWeight: 700, color: '#9f1239' }}>Exit Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExitType })}
                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fda4af', fontSize: '14px' }}
                            >
                                <option value="Voluntary">Voluntary</option>
                                <option value="Involuntary">Involuntary</option>
                                <option value="Retrenchment">Retrenchment</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 25px', borderRadius: '8px', border: '1px solid #fda4af', background: 'white', color: '#be123c', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button type="submit" style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#f43f5e', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Initiate Exit</button>
                    </div>
                </form>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #fff1f2' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Department</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Last Day</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Notice Per.</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Exit Type</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exits.map((e) => (
                            <tr key={e.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{e.name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{e.id}</div>
                                </td>
                                <td style={{ padding: '15px', color: '#475569' }}>{e.department}</td>
                                <td style={{ padding: '15px', color: '#e11d48', fontWeight: 600 }}>{e.lastWorkingDay}</td>
                                <td style={{ padding: '15px', color: '#475569' }}>{e.noticePeriod} Days</td>
                                <td style={{ padding: '15px', color: '#475569' }}>{e.exitType}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '8px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        background: e.status === 'Closed' ? '#f0fdf4' : '#fff1f2',
                                        color: e.status === 'Closed' ? '#166534' : '#be123c',
                                        textTransform: 'uppercase'
                                    }}>{e.status}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{ border: 'none', background: 'none', color: '#f43f5e', cursor: 'pointer' }}><i className="fas fa-edit"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExitRegistration;
