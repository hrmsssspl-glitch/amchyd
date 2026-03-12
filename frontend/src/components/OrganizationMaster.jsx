import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Download, Upload, Loader, FileSpreadsheet, FileText, X, RefreshCw, Building2, Search } from 'lucide-react';

const OrganizationMaster = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [organizations, setOrganizations] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterState, setFilterState] = useState('');
    const [states, setStates] = useState([]);
    const [allBranches, setAllBranches] = useState([]);

    const defaultFormData = {
        companyName: '', cinGstNumber: '', branchGstNumber: '', establishmentYear: '', industryType: '',
        panNumber: '', registeredAddress: '', corporateAddress: '', contactEmail: '',
        contactPhone: '', contactPerson: '', websiteUrl: '', state: '', branches: []
    };

    const [formData, setFormData] = useState(defaultFormData);

    const isAdmin = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Super Admin');

    useEffect(() => {
        fetchOrgs();
        fetchMetadata();
    }, [page, searchTerm, filterState]);

    const fetchMetadata = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            const { data: stateData } = await axios.get('/api/hrms/organization/states', config);
            const { data: branchData } = await axios.get('/api/hrms/organization/branches', config);
            setStates(stateData);
            setAllBranches(branchData);
        } catch (error) {
            console.error('Error fetching metadata:', error);
        }
    };

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            const { data } = await axios.get(`/api/organizations?pageNumber=${page}&searchTerm=${searchTerm}&state=${filterState}`, config);
            setOrganizations(data.organizations);
            setPages(data.pages);
        } catch (error) {
            alert('Error fetching organizations');
        }
        setLoading(false);
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            if (editingOrg) {
                await axios.put(`/api/organizations/${editingOrg._id}`, formData, config);
            } else {
                await axios.post('/api/organizations', formData, config);
            }
            setShowForm(false);
            setEditingOrg(null);
            setFormData(defaultFormData);
            fetchOrgs();
        } catch (error) {
            alert('Error saving organization');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this organization?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
                await axios.delete(`/api/organizations/${id}`, config);
                fetchOrgs();
            } catch (error) {
                alert('Error deleting organization');
            }
        }
    };

    const handleEdit = (org) => {
        setEditingOrg(org);
        setFormData({
            ...org,
            branches: org.branches || (org.branch ? [org.branch] : [])
        });
        setShowForm(true);
    };

    const handleBranchToggle = (branchName) => {
        const currentBranches = formData.branches || [];
        if (currentBranches.includes(branchName)) {
            setFormData({ ...formData, branches: currentBranches.filter(b => b !== branchName) });
        } else {
            setFormData({ ...formData, branches: [...currentBranches, branchName] });
        }
    };

    const handleExport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser?.token}` },
                responseType: 'blob'
            };
            const response = await axios.get(`/api/organizations/export?searchTerm=${searchTerm}&state=${filterState}`, config);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'organizations_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) { alert('Export failed'); }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterState('');
        setPage(1);
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append('file', file);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser?.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post('/api/organizations/import', form, config);
            alert('Import successful');
            fetchOrgs();
        } catch (error) { alert('Import failed'); }
    };

    return (
        <div className="main-content-inner">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 style={{ margin: 0 }}>Organization Master</h2>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '4px' }}>Administrative registry for corporate entities and branch hierarchy</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && (
                        <>
                            <button className="btn-primary flex items-center gap-2" onClick={() => { setEditingOrg(null); setFormData(defaultFormData); setShowForm(!showForm); }} style={{ padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
                                <Plus size={20} /> {showForm ? 'Close Workspace' : 'Add Organization'}
                            </button>
                            <label className="btn-secondary flex items-center gap-2" style={{ cursor: 'pointer', margin: 0, padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
                                <Upload size={18} /> Bulk Import
                                <input type="file" accept=".xlsx, .xls" onChange={handleImport} style={{ display: 'none' }} />
                            </label>
                        </>
                    )}
                    <button className="btn-secondary flex items-center gap-2" onClick={handleExport} style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
                        <FileSpreadsheet size={18} /> Export Results
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar shadow-sm border border-slate-100 mb-8" style={{ padding: '1.5rem', background: 'white', borderRadius: '20px' }}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="filter-item">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Search Organization</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter company name..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                                style={{ paddingLeft: '2.5rem', height: '48px', borderRadius: '12px' }}
                            />
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        </div>
                    </div>
                    <div className="filter-item">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Regional Filter</label>
                        <select
                            value={filterState}
                            onChange={(e) => { setFilterState(e.target.value); setPage(1); }}
                            style={{ height: '48px', borderRadius: '12px' }}
                        >
                            <option value="">All Regions</option>
                            {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <button className="btn-reset flex items-center justify-center gap-2 w-full" onClick={resetFilters} style={{ height: '48px', borderRadius: '12px', background: '#f8fafc' }}>
                            <RefreshCw size={18} /> Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center mt-4"><Loader className="animate-spin" /></div>
            ) : (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Company Name</th>
                                    <th>Industry</th>
                                    <th>Location</th>
                                    <th>Contact</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {organizations.map(o => (
                                    <tr key={o._id}>
                                        <td>
                                            <strong>{o.companyName || 'N/A'}</strong><br />
                                            <small>CIN/GST: {o.cinGstNumber}</small><br />
                                            <small className="text-gray-500">Branch GST: {o.branchGstNumber || 'N/A'}</small>
                                        </td>
                                        <td>{o.industryType}</td>
                                        <td>{o.branches && o.branches.length > 0 ? o.branches.join(', ') : (o.branch || 'N/A')}<br /><small>{o.state}</small></td>
                                        <td>{o.contactPhone}<br /><small>{o.contactPerson ? `${o.contactPerson} (${o.contactEmail})` : o.contactEmail}</small></td>
                                        {isAdmin && (
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(o)} style={{ background: 'none', color: '#007bff' }}><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(o._id)} style={{ background: 'none', color: '#dc3545' }}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center mt-4 gap-2">
                        {[...Array(pages).keys()].map(x => (
                            <button key={x + 1} onClick={() => setPage(x + 1)} className={page === x + 1 ? 'btn-primary' : 'btn-secondary'} style={{ padding: '0.4rem 0.8rem', minWidth: '40px' }}>
                                {x + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {showForm && (
                <div className="inline-form-card">
                    <div className="inline-form-header">
                        <h3>
                            <Plus size={24} className="text-red" />
                            {editingOrg ? 'Update Organization' : 'Create New Organization'}
                        </h3>
                        <div className="flex gap-2">
                            <button className="btn-secondary" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.2rem' }}>
                                <X size={18} style={{ marginRight: '8px' }} /> Cancel
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleCreateOrUpdate}>
                        {/* Section 1: Company Profile */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Plus size={18} /> Company Profile
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input type="text" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>CIN / GST Number</label>
                                    <input type="text" value={formData.cinGstNumber} onChange={e => setFormData({ ...formData, cinGstNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Establishment Year</label>
                                    <input type="text" value={formData.establishmentYear} onChange={e => setFormData({ ...formData, establishmentYear: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Industry Type</label>
                                    <select value={formData.industryType} onChange={e => setFormData({ ...formData, industryType: e.target.value })}>
                                        <option value="">Select Type</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Service">Service</option>
                                        <option value="Sales & Service">Sales & Service</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>PAN Number</label>
                                    <input type="text" value={formData.panNumber} onChange={e => setFormData({ ...formData, panNumber: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Website URL</label>
                                    <input type="text" value={formData.websiteUrl} onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Location & Branches */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <FileSpreadsheet size={18} /> Location & Regional Details
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>State</label>
                                    <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value, branches: [] })}>
                                        <option value="">Select State</option>
                                        {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="m-0">Assign Branches (multi-select)</label>
                                        <div className="flex gap-2 items-center">
                                            {currentUser.role === 'Super Admin' && (
                                                <div className="flex gap-1">
                                                    <input
                                                        type="text"
                                                        id="customBranchInput"
                                                        placeholder="Add Branch..."
                                                        className="text-xs p-1 h-7 border rounded"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const val = e.target.value.trim();
                                                                if (val && !formData.branches.includes(val)) {
                                                                    setFormData({ ...formData, branches: [...formData.branches, val] });
                                                                    e.target.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const input = document.getElementById('customBranchInput');
                                                            const val = input.value.trim();
                                                            if (val && !formData.branches.includes(val)) {
                                                                setFormData({ ...formData, branches: [...formData.branches, val] });
                                                                input.value = '';
                                                            }
                                                        }}
                                                        className="bg-gray-100 p-1 rounded hover:bg-gray-200"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            )}
                                            {formData.branches?.length > 0 && (
                                                <button type="button" onClick={() => setFormData(prev => ({ ...prev, branches: [] }))}
                                                    style={{ fontSize: '0.72rem', color: '#dc2626', background: 'none', padding: '0 4px', fontWeight: 600 }}>
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.5rem', minHeight: '52px' }}>
                                        {/* Show chips for already selected branches that might be custom */}
                                        {formData.branches.map(b => (
                                            <label key={b}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.3rem 0.65rem', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 600, border: '1.5px solid #c2410c', background: '#fff7ed', color: '#c2410c', transition: 'all 0.15s', userSelect: 'none' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={true}
                                                    onChange={() => handleBranchToggle(b)}
                                                    style={{ display: 'none' }}
                                                />
                                                <Building2 size={12} />
                                                {b}
                                            </label>
                                        ))}

                                        {/* Show suggestion chips from allBranches that are NOT already selected and match the state */}
                                        {allBranches.filter(b => b.state === formData.state && !formData.branches.includes(b.branchName)).map(b => (
                                            <label key={b._id}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', padding: '0.3rem 0.65rem', borderRadius: '1rem', fontSize: '0.82rem', fontWeight: 600, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', transition: 'all 0.15s', userSelect: 'none' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={false}
                                                    onChange={() => handleBranchToggle(b.branchName)}
                                                    style={{ display: 'none' }}
                                                />
                                                <Building2 size={12} />
                                                {b.branchName}
                                            </label>
                                        ))}
                                        {!formData.state && formData.branches.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.85rem', width: '100%', textAlign: 'center', padding: '0.5rem 0' }}>Please select a state to view branches or add manually</div>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Contact Information */}
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Plus size={18} /> Contact & Communication
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>GST Number (For Branch Also)</label>
                                    <input type="text" value={formData.branchGstNumber} onChange={e => setFormData({ ...formData, branchGstNumber: e.target.value })} placeholder="Branch-specific GST" />
                                </div>
                                <div className="form-group">
                                    <label>Contact Person</label>
                                    <input type="text" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Email</label>
                                    <input type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Contact Phone</label>
                                    <input type="text" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Registered Address</label>
                                    <textarea value={formData.registeredAddress} onChange={e => setFormData({ ...formData, registeredAddress: e.target.value })} rows="1" />
                                </div>
                                <div className="form-group">
                                    <label>Corporate Address</label>
                                    <textarea value={formData.corporateAddress} onChange={e => setFormData({ ...formData, corporateAddress: e.target.value })} rows="1" />
                                </div>
                            </div>
                        </div>

                        <div className="inline-form-footer">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ width: '150px' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ width: '220px' }}>{editingOrg ? 'Update Organization' : 'Save Organization'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrganizationMaster;
