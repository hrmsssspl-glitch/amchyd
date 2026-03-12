import React, { useState, useEffect } from 'react';
import { Branch, UnitType, State } from '../../types/organization';
import axios from 'axios';

interface BranchMasterProps {
    data: Branch[];
    updateData: (data: Branch[]) => void;
}

const unitTypes: UnitType[] = ['Head Office', 'Regional Office', 'Zonal Office', 'Branch Office', 'Satellite Office', 'Service & Spare Outlets'];

const BranchMaster: React.FC<BranchMasterProps> = ({ data, updateData }) => {
    const [showForm, setShowForm] = useState(false);
    const [newBranch, setNewBranch] = useState<Partial<Branch>>({
        status: 'Active',
        unitType: 'Branch Office',
        state: ''
    });

    // Pagination & Search State
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [states, setStates] = useState<State[]>([]);
    const [availableBranches, setAvailableBranches] = useState<any[]>([]);
    const itemsPerPage = 10;

    // Auth Check
    const userJson = localStorage.getItem('hrms_auth');
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'admin';

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
                const [stateRes, branchRes] = await Promise.all([
                    axios.get('/api/hrms/organization/states', config),
                    axios.get('/api/hrms/organization/branches', config)
                ]);
                setStates(stateRes.data);
                setAvailableBranches(branchRes.data);
            } catch (err) {
                console.error('Failed to fetch metadata', err);
            }
        };
        fetchMetadata();
    }, [currentUser?.token]);

    // Filter Logic
    const filteredData = data.filter(branch =>
        branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.branchCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.state && branch.state.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const generateBranchCode = (city: string) => {
        if (!city) return '';
        const prefix = city.substring(0, 3).toUpperCase();
        const num = Math.floor(100 + Math.random() * 900);
        return `BR-${prefix}-${num}`;
    };

    const handleStateChange = (state: string) => {
        setNewBranch({ ...newBranch, state, branchName: '', branchCode: '' });
    };

    const handleBranchNameChange = (branchName: string) => {
        const code = generateBranchCode(branchName);
        setNewBranch({ ...newBranch, branchName, branchCode: code });
    };

    const handleSave = () => {
        if (newBranch.branchName && newBranch.branchCode && newBranch.state) {
            if (isEditing && newBranch.id) {
                // Update existing
                const updated = data.map(b => b.id === newBranch.id ? newBranch as Branch : b);
                updateData(updated);
            } else {
                // Add new
                updateData([...data, { ...newBranch, id: Date.now().toString() } as Branch]);
            }

            setShowForm(false);
            setIsEditing(false);
            setNewBranch({
                status: 'Active',
                unitType: 'Branch Office',
                state: ''
            });
        }
    };

    const handleEdit = (branch: Branch) => {
        setNewBranch(branch);
        setIsEditing(true);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setNewBranch({
            status: 'Active',
            unitType: 'Branch Office',
            state: ''
        });
        setShowForm(!showForm);
    };

    const branchesList = availableBranches
        .filter((b: any) => b.state === newBranch.state)
        .map((b: any) => b.branchName);

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            {/* Controls Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', fontWeight: 700 }}>
                        <i className="fas fa-map-marked-alt" style={{ color: '#6366f1', marginRight: '12px' }}></i>
                        Branch / Location Master
                    </h3>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Manage company units and geographical locations</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search branches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 15px 10px 35px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '14px',
                                outline: 'none',
                                width: '250px'
                            }}
                        />
                        <i className="fas fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    </div>
                    <button
                        onClick={resetForm}
                        style={{
                            padding: '10px 20px',
                            background: showForm ? '#f1f5f9' : '#6366f1',
                            color: showForm ? '#475569' : 'white',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <i className={showForm ? 'fas fa-times' : 'fas fa-plus'}></i>
                        {showForm ? 'Cancel' : 'Add New Branch'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0', animation: 'fadeIn 0.3s' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>State</label>
                            <select
                                className="form-control"
                                value={newBranch.state}
                                onChange={e => handleStateChange(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                            >
                                <option value="">Select State</option>
                                {states.map((s: State) => <option key={s._id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Branch / Location</label>
                            <select
                                className="form-control"
                                value={newBranch.branchName}
                                disabled={!newBranch.state}
                                onChange={e => handleBranchNameChange(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                            >
                                <option value="">Select Branch</option>
                                {branchesList.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Branch Code (Auto)</label>
                            <input
                                placeholder="Auto-generated"
                                className="form-control"
                                value={newBranch.branchCode}
                                readOnly
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f1f5f9', cursor: 'not-allowed' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Branch Type</label>
                            <select
                                className="form-control"
                                value={newBranch.unitType}
                                onChange={e => setNewBranch({ ...newBranch, unitType: e.target.value as UnitType })}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                            >
                                {unitTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>GST Number</label>
                            <input placeholder="Enter GSTIN" className="form-control" onChange={e => setNewBranch({ ...newBranch, gstNumber: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Contact Person</label>
                            <input placeholder="Full Name" className="form-control" onChange={e => setNewBranch({ ...newBranch, contactPerson: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Contact Number</label>
                            <input placeholder="Phone" className="form-control" onChange={e => setNewBranch({ ...newBranch, contactNumber: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
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
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 10px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                                {isEditing ? 'Update Branch' : 'Save Branch'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', color: '#64748b' }}>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Branch Name</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Code</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Location</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Office Type</th>
                            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Contact</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? paginatedData.map((branch, idx) => (
                            <tr key={branch.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fcfdfe' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{branch.branchName}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', color: '#4f46e5' }}>{branch.branchCode}</code>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ color: '#475569' }}>{branch.state}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{branch.gstNumber || 'No GST'}</div>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        background: branch.unitType.includes('Office') ? '#eff6ff' : '#f0fdf4',
                                        color: branch.unitType.includes('Office') ? '#1d4ed8' : '#15803d'
                                    }}>{branch.unitType}</span>
                                </td>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: '500' }}>{branch.contactPerson}</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}><i className="fas fa-phone-alt" style={{ fontSize: '10px' }}></i> {branch.contactNumber}</div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        background: branch.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                                        color: branch.status === 'Active' ? '#10b981' : '#ef4444'
                                    }}>
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                                        {branch.status}
                                    </div>
                                </td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    {canEdit ? (
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                title="Edit Branch"
                                                onClick={() => handleEdit(branch)}
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
                                                title="Delete Branch"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this branch?')) {
                                                        updateData(data.filter(b => b.id !== branch.id));
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
                        )) : (
                            <tr>
                                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                                    <i className="fas fa-folder-open" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
                                    No branches found. Add your first location to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {filteredData.length > 0 && (
                <div style={{ padding: '20px', background: 'white', borderRadius: '0 0 12px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-1px' }}>
                    <div style={{ color: '#64748b', fontSize: '14px' }}>
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} branches
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
        </div>
    );
};

export default BranchMaster;
