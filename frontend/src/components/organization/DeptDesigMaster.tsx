import React, { useState } from 'react';
import { Department, Branch } from '../../types/organization';

interface DeptDesigMasterProps {
    deptData: Department[];
    updateDeptData: (data: Department[]) => void;
    branches: Branch[];
}

import { departmentData } from '../../data/organizationData';


const DeptDesigMaster: React.FC<DeptDesigMasterProps> = ({
    deptData, updateDeptData, branches
}) => {
    const [showForm, setShowForm] = useState(false);

    const [newEntry, setNewEntry] = useState<Partial<Department>>({
        status: 'Active',
        state: '',
        branch: '',
        branchCode: '',
        departmentName: '',
        subDepartment: '',
        departmentCode: '',
        gradeLevel: ''
    });

    // Pagination & Search State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const itemsPerPage = 10;

    // Auth Check
    const userJson = localStorage.getItem('hrms_auth');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

    // Filter Logic
    const filteredData = deptData.filter(dept =>
        dept.departmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.subDepartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBranchChange = (branchName: string) => {
        const foundBranch = branches.find(b => b.branchName === branchName);
        setNewEntry({
            ...newEntry,
            branch: branchName,
            branchCode: foundBranch?.branchCode || ''
        });
    };

    const handleSave = () => {
        if (newEntry.departmentName && newEntry.subDepartment && newEntry.branch) {
            if (isEditing && newEntry.id) {
                // Update Logic
                const updated = deptData.map(d => d.id === newEntry.id ? newEntry as Department : d);
                updateDeptData(updated);
            } else {
                // Add Logic
                updateDeptData([...deptData, { ...newEntry, id: Date.now().toString(), location: newEntry.branch } as Department]);
            }

            setShowForm(false);
            setIsEditing(false);
            setNewEntry({
                status: 'Active',
                state: '',
                branch: '',
                branchCode: '',
                departmentName: '',
                subDepartment: '',
                departmentCode: '',
                gradeLevel: ''
            });
        }
    };

    const handleEdit = (dept: Department) => {
        setNewEntry(dept);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setNewEntry({
            status: 'Active',
            state: '',
            branch: '',
            branchCode: '',
            departmentName: '',
            subDepartment: '',
            departmentCode: '',
            gradeLevel: ''
        });
        setShowForm(!showForm);
    };

    const states = Array.from(new Set(branches.map(b => b.state)));
    const filteredBranches = branches.filter(b => b.state === newEntry.state);

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            {/* Header Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>
                    <i className="fas fa-users-cog" style={{ color: '#4f46e5', marginRight: '12px' }}></i>
                    Manage Dept & Designation
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 15px 10px 35px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '14px',
                                outline: 'none',
                                width: '200px'
                            }}
                        />
                        <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    </div>
                    <button
                        onClick={resetForm}
                        style={{
                            padding: '10px 20px',
                            background: showForm ? '#f1f5f9' : '#4f46e5',
                            color: showForm ? '#64748b' : 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700',
                            transition: 'all 0.3s'
                        }}
                    >
                        {showForm ? 'Cancel' : '+ Add New Entry'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #e2e8f0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>State</label>
                            <select
                                className="form-control"
                                value={newEntry.state}
                                onChange={e => setNewEntry({ ...newEntry, state: e.target.value, branch: '', branchCode: '' })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select State</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Branch / Location</label>
                            <select
                                className="form-control"
                                value={newEntry.branch}
                                disabled={!newEntry.state}
                                onChange={e => handleBranchChange(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select Branch</option>
                                {filteredBranches.map(b => <option key={b.id} value={b.branchName}>{b.branchName}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Branch Code (Auto)</label>
                            <input
                                value={newEntry.branchCode}
                                readOnly
                                style={{ width: '100%', padding: '12px', borderRadius: '100px', border: '1px solid #e2e8f0', background: '#f1f5f9', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Department Name</label>
                            <select
                                className="form-control"
                                value={newEntry.departmentName}
                                onChange={e => setNewEntry({ ...newEntry, departmentName: e.target.value, subDepartment: '' })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select Department</option>
                                {Object.keys(departmentData).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Sub Department / Designation</label>
                            <select
                                className="form-control"
                                value={newEntry.subDepartment}
                                disabled={!newEntry.departmentName}
                                onChange={e => setNewEntry({ ...newEntry, subDepartment: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="">Select Sub Dept</option>
                                {newEntry.departmentName && departmentData[newEntry.departmentName].map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Department Code</label>
                            <input
                                placeholder="Enter Dept Code"
                                className="form-control"
                                value={newEntry.departmentCode}
                                onChange={e => setNewEntry({ ...newEntry, departmentCode: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Grade / Level</label>
                            <input
                                placeholder="e.g. L1, L2, M1"
                                className="form-control"
                                value={newEntry.gradeLevel}
                                onChange={e => setNewEntry({ ...newEntry, gradeLevel: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: '12px 35px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                {isEditing ? 'Update Entry' : 'Save Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                        <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Dept / Designation</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Branch Details</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '700' }}>Grade</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '700' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '700' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((dept, idx) => (
                            <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fcfdfe', transition: 'background 0.2s' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{dept.departmentName}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>{dept.subDepartment}</div>
                                    <code style={{ fontSize: '11px', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', color: '#4f46e5', marginTop: '4px', display: 'inline-block' }}>{dept.departmentCode}</code>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '600', color: '#475569' }}>{dept.branch}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{dept.state} ({dept.branchCode})</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '600' }}>{dept.gradeLevel || 'N/A'}</div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        background: dept.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                                        color: dept.status === 'Active' ? '#10b981' : '#ef4444',
                                        fontWeight: '700',
                                        border: `1px solid ${dept.status === 'Active' ? '#dcfce7' : '#fee2e2'}`
                                    }}>{dept.status}</span>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    {canEdit ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                title="Edit Entry"
                                                onClick={() => handleEdit(dept)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#eff6ff',
                                                    color: '#3b82f6',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#dbeafe'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#eff6ff'}
                                            >
                                                <i className="fas fa-edit" style={{ fontSize: '14px' }}></i>
                                            </button>
                                            <button
                                                title="Delete Entry"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this entry?')) {
                                                        updateDeptData(deptData.filter(d => d.id !== dept.id));
                                                    }
                                                }}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: '#fef2f2',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                                            >
                                                <i className="fas fa-trash-alt" style={{ fontSize: '14px' }}></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <span style={{ color: '#cbd5e1', fontSize: '18px' }}>-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {filteredData.length > 0 && (
                <div style={{ padding: '20px', background: 'white', borderRadius: '0 0 12px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-1px' }}>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', background: currentPage === 1 ? '#f1f5f9' : 'white', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: currentPage === 1 ? '#94a3b8' : '#64748b' }}
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    padding: '8px 12px',
                                    border: '1px solid #e2e8f0',
                                    background: currentPage === i + 1 ? '#4f46e5' : 'white',
                                    color: currentPage === i + 1 ? 'white' : '#64748b',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ padding: '8px 12px', border: '1px solid #e2e8f0', background: currentPage === totalPages ? '#f1f5f9' : 'white', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: currentPage === totalPages ? '#94a3b8' : '#64748b' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {deptData.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <i className="fas fa-folder-open" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}></i>
                    No entries found. Click "Add New Entry" to get started.
                </div>
            )}
        </div>
    );
};

export default DeptDesigMaster;
