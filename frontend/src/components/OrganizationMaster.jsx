import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Download, Upload, Loader, FileSpreadsheet, FileText, X, RefreshCw } from 'lucide-react';

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

    const defaultFormData = {
        companyName: '', cinGstNumber: '', establishmentYear: '', industryType: '',
        panNumber: '', registeredAddress: '', corporateAddress: '', contactEmail: '',
        contactPhone: '', websiteUrl: '', state: '', branch: ''
    };

    const [formData, setFormData] = useState(defaultFormData);

    const stateBranchData = {
        'Andhra Pradesh': [
            'Vijayawada', 'Autonagar', 'Bhimavaram', 'Chimakaruthy', 'Gajwaka', 'Guntur',
            'Kakinada', 'Rajahmundry', 'Srikakulam', 'Tekkali', 'Vishakapatnam', 'Vijayanagaram',
            'Kadapa', 'Kurnool', 'Ananthapur', 'Tirupathi', 'Chittor', 'Nellore', 'Kothagudem'
        ],
        'Telangana': [
            'Hyderabad', 'Karimnagar', 'Khammam', 'Nalgonda', 'Nizamabad', 'Warangal',
            'Mahaboobnagar', 'Ramagundam', 'Uppal', 'Balanagar', 'Hyderguda', 'Katedan',
            'Suryapet', 'Peddamberpet', 'Jadcherla', 'Shamshabad'
        ]
    };

    const isAdmin = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Super Admin');

    useEffect(() => {
        fetchOrgs();
    }, [page, searchTerm, filterState]);

    const fetchOrgs = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
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
            const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
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
                const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
                await axios.delete(`/api/organizations/${id}`, config);
                fetchOrgs();
            } catch (error) {
                alert('Error deleting organization');
            }
        }
    };

    const handleEdit = (org) => {
        setEditingOrg(org);
        setFormData(org);
        setShowForm(true);
    };

    const handleExport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` },
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
                    Authorization: `Bearer ${currentUser.token}`,
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
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ margin: 0 }}>Organization Master</h2>
                <div className="flex gap-2">
                    {isAdmin && (
                        <>
                            <button className="btn-primary" onClick={() => { setEditingOrg(null); setFormData(defaultFormData); setShowForm(!showForm); }}>
                                <Plus size={18} style={{ marginRight: '8px' }} /> {showForm ? 'Close Form' : 'New Organization'}
                            </button>
                            <label className="btn-secondary flex items-center gap-2" style={{ cursor: 'pointer', margin: 0 }}>
                                <Upload size={18} /> Bulk Import
                                <input type="file" accept=".xlsx, .xls" onChange={handleImport} style={{ display: 'none' }} />
                            </label>
                        </>
                    )}
                    <button className="btn-secondary flex items-center gap-2" onClick={handleExport}>
                        <FileSpreadsheet size={18} /> Export Excel
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-item">
                    <label>Search Organization</label>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="filter-item">
                    <label>Filter by State</label>
                    <select
                        value={filterState}
                        onChange={(e) => { setFilterState(e.target.value); setPage(1); }}
                    >
                        <option value="">All States</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Telangana">Telangana</option>
                    </select>
                </div>
                <button className="btn-reset" onClick={resetFilters}>
                    <RefreshCw size={18} /> Reset Filters
                </button>
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
                                        <td><strong>{o.companyName || 'N/A'}</strong><br /><small>{o.cinGstNumber}</small></td>
                                        <td>{o.industryType}</td>
                                        <td>{o.branch}, {o.state}</td>
                                        <td>{o.contactPhone}<br /><small>{o.contactEmail}</small></td>
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
                                    <select value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value, branch: '' })}>
                                        <option value="">Select State</option>
                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                        <option value="Telangana">Telangana</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Branch</label>
                                    <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} disabled={!formData.state}>
                                        <option value="">Select Branch</option>
                                        {(stateBranchData[formData.state] || []).map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
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
