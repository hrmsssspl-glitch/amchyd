import React, { useState, useEffect } from 'react';
import { LeaveTypeConfig, getLeaveTypes, saveLeaveTypes } from '../../utils/leaveTypeStorage';

const LeaveTypeConfigMaster: React.FC = () => {
    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeConfig[]>(getLeaveTypes());
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<LeaveTypeConfig>>({
        code: '',
        name: '',
        daysAllowed: 0,
        description: '',
        isPaid: true,
        status: 'Active'
    });

    useEffect(() => {
        // Initial load
        setLeaveTypes(getLeaveTypes());
    }, []);

    const handleSave = () => {
        if (!formData.code || !formData.name) {
            alert('Code and Name are required');
            return;
        }

        let updatedTypes: LeaveTypeConfig[];
        if (editingId) {
            updatedTypes = leaveTypes.map(lt =>
                lt.id === editingId ? { ...lt, ...formData } as LeaveTypeConfig : lt
            );
        } else {
            const newType: LeaveTypeConfig = {
                id: Date.now().toString(),
                ...formData
            } as LeaveTypeConfig;
            updatedTypes = [...leaveTypes, newType];
        }

        saveLeaveTypes(updatedTypes);
        setLeaveTypes(updatedTypes);
        resetForm();
    };

    const handleEdit = (lt: LeaveTypeConfig) => {
        setFormData(lt);
        setEditingId(lt.id);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this leave type?')) {
            const updatedTypes = leaveTypes.filter(lt => lt.id !== id);
            saveLeaveTypes(updatedTypes);
            setLeaveTypes(updatedTypes);
        }
    };

    const resetForm = () => {
        setFormData({ code: '', name: '', daysAllowed: 0, description: '', isPaid: true, status: 'Active' });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>
                    <i className="fas fa-calendar-alt" style={{ color: '#4f46e5', marginRight: '12px' }}></i>
                    Leave Types Configuration
                </h3>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    style={{
                        padding: '10px 20px',
                        background: showForm ? '#f1f5f9' : '#4f46e5',
                        color: showForm ? '#64748b' : 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: '700'
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add Leave Type'}
                </button>
            </div>

            {showForm && (
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Leave Code</label>
                            <input
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                placeholder="e.g. CL"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Leave Type Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                placeholder="e.g. Casual Leave"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>No. of Leaves Allowed</label>
                            <input
                                type="number"
                                value={formData.daysAllowed}
                                onChange={e => setFormData({ ...formData, daysAllowed: Number(e.target.value) })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Description</label>
                            <input
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Is Paid Leave?</label>
                            <select
                                value={formData.isPaid ? 'Yes' : 'No'}
                                onChange={e => setFormData({ ...formData, isPaid: e.target.value === 'Yes' })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold' }}>Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: '12px 30px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingId ? 'Update Leave Type' : 'Save New Type'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Leave Code</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Leave Type</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>No. of Leaves</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Applicable For</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Type</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Status</th>
                            <th style={{ padding: '15px', color: '#64748b', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveTypes.map((lt, idx) => (
                            <tr key={lt.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfdfe' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{lt.code}</td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '600' }}>{lt.name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{lt.description}</div>
                                </td>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#ea580c' }}>{lt.daysAllowed} Days</td>
                                <td style={{ padding: '15px' }}>All Employees</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                        background: lt.isPaid ? '#ecfccb' : '#fef9c3',
                                        color: lt.isPaid ? '#4d7c0f' : '#854d0e',
                                        fontWeight: 'bold'
                                    }}>
                                        {lt.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                        background: lt.status === 'Active' ? '#dcfce7' : '#fee2e2',
                                        color: lt.status === 'Active' ? '#15803d' : '#b91c1c',
                                        fontWeight: 'bold'
                                    }}>
                                        {lt.status}
                                    </span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => handleEdit(lt)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4f46e5', marginRight: '10px' }}><i className="fas fa-edit"></i></button>
                                    <button onClick={() => handleDelete(lt.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}><i className="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="form-note" style={{
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#fffbeb',
                border: '1px solid #feebc8',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#92400e'
            }}>
                <i className="fas fa-info-circle"></i>
                Note: Changes to Leave Types will automatically reflect in Attendance, Leave Management, and Payroll modules.
            </div>
        </div>
    );
};

export default LeaveTypeConfigMaster;
