import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, MessageSquareQuote, X, Calendar, User, Phone, Mail, CheckCircle } from 'lucide-react';

const InactiveFollowupStatus = () => {
    const { user } = useContext(AuthContext);
    const [assets, setAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;
    const [showFollowupModal, setShowFollowupModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [empLookupStatus, setEmpLookupStatus] = useState('');  // '', 'found', 'notfound'
    const [searchFilters, setSearchFilters] = useState({
        assetNumber: '', branch: '', customerName: ''
    });

    const [followupForm, setFollowupForm] = useState({
        employeeId: '',
        employeeName: '',
        empContactNumber: '',
        followUpDate: new Date().toISOString().split('T')[0],
        customerContactedName: '',
        customerContactNumber: '',
        customerContactEmail: '',
        remarks: '',
        poStatus: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const lookupTimeout = useRef(null);

    // Fetch inactive assets
    const fetchAssets = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const queryParams = new URLSearchParams({
                status: 'Inactive',
                pageSize: 1000,
                keyword: searchTerm,
                ...searchFilters
            }).toString();
            const response = await axios.get(`/api/assets?${queryParams}`, config);
            const inactiveAssets = response.data.assets || [];
            setAssets(inactiveAssets);
            setFilteredAssets(inactiveAssets);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all employees for auto-fill lookup
    const fetchEmployees = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('/api/employees?pageSize=1000', config);
            setEmployees(res.data.employees || []);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    useEffect(() => {
        fetchAssets();
        fetchEmployees();
    }, [searchTerm, searchFilters]);

    useEffect(() => {
        const filtered = assets.filter(asset => {
            const assetNo = String(asset.assetNumber || '').toLowerCase();
            const customer = String(asset.customerName || '').toLowerCase();
            const search = searchTerm.toLowerCase();
            return assetNo.includes(search) || customer.includes(search);
        });
        setFilteredAssets(filtered);
        setPage(1);
    }, [searchTerm, assets]);

    const pages = Math.ceil(filteredAssets.length / limit);
    const currentAssets = filteredAssets.slice((page - 1) * limit, page * limit);

    const handleOpenFollowup = (asset) => {
        setSelectedAsset(asset);
        setEmpLookupStatus('');
        setSuccessMsg('');
        setFollowupForm({
            employeeId: '',
            employeeName: '',
            empContactNumber: '',
            followUpDate: new Date().toISOString().split('T')[0],
            customerContactedName: asset.contactPerson || '',
            customerContactNumber: asset.contactNumber || '',
            customerContactEmail: asset.mailId || '',
            remarks: '',
            poStatus: ''
        });
        setShowFollowupModal(true);
    };

    const handleCloseFollowup = () => {
        setShowFollowupModal(false);
        setSelectedAsset(null);
        setEmpLookupStatus('');
        setSuccessMsg('');
    };

    // Auto-fill employee name and contact from the employees list
    const handleEmpIdChange = (e) => {
        const val = e.target.value;
        setFollowupForm(prev => ({ ...prev, employeeId: val, employeeName: '', empContactNumber: '' }));
        setEmpLookupStatus('');

        // Debounced lookup
        if (lookupTimeout.current) clearTimeout(lookupTimeout.current);
        lookupTimeout.current = setTimeout(() => {
            if (!val.trim()) return;
            const match = employees.find(
                emp => emp.employeeId?.toLowerCase() === val.trim().toLowerCase()
            );
            if (match) {
                setFollowupForm(prev => ({
                    ...prev,
                    employeeName: match.employeeName || '',
                    empContactNumber: match.contactNumber || ''
                }));
                setEmpLookupStatus('found');
            } else {
                setEmpLookupStatus('notfound');
            }
        }, 400);
    };

    const handleFormChange = (e) => {
        setFollowupForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const submitFollowup = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMsg('');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const response = await axios.post(`/api/assets/${selectedAsset._id}/followups`, followupForm, config);
            setSelectedAsset(response.data);
            setAssets(prev => prev.map(a => a._id === response.data._id ? response.data : a));
            setSuccessMsg('Follow-up record saved successfully!');
            // Only reset remarks and date for the next entry, keep employee info
            setFollowupForm(prev => ({
                ...prev,
                followUpDate: new Date().toISOString().split('T')[0],
                customerContactedName: selectedAsset.contactPerson || '',
                customerContactNumber: selectedAsset.contactNumber || '',
                customerContactEmail: selectedAsset.mailId || '',
                remarks: ''
            }));
        } catch (error) {
            console.error('Error submitting followup:', error);
            alert('Failed to submit follow-up.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="asset-master p-6 bg-gray-50 min-h-screen">
            <div className="table-container-fu">
                {/* Table Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', borderRadius: '24px 24px 0 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', background: '#fff7ed', color: '#c2410c', borderRadius: '0.5rem' }}>
                            <MessageSquareQuote size={22} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>AMC Followup Status</h2>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Track follow-ups for inactive AMC assets</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', border: `1px solid ${showAdvancedSearch ? '#fed7aa' : '#e2e8f0'}`, background: showAdvancedSearch ? '#fff7ed' : 'white', color: showAdvancedSearch ? '#c2410c' : '#64748b', borderRadius: '0.75rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                            <Filter size={16} />{showAdvancedSearch ? 'Hide Filters' : 'Filters'}
                        </button>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search asset or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '2.25rem', paddingRight: '1rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.85rem', outline: 'none', width: '220px', background: '#f8fafc' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                {showAdvancedSearch && (
                    <div style={{ padding: '1.25rem 1.5rem', background: '#fffbf5', borderBottom: '1px solid #fed7aa' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                            {[{ label: 'Asset No', key: 'assetNumber', ph: 'e.g. 2547...' }, { label: 'Customer Name', key: 'customerName', ph: 'Customer name...' }].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{f.label}</label>
                                    <input type="text" placeholder={f.ph} value={searchFilters[f.key]} onChange={(e) => setSearchFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #fed7aa', borderRadius: '0.5rem', fontSize: '0.85rem', outline: 'none', background: 'white', boxSizing: 'border-box' }} />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Branch</label>
                                <select value={searchFilters.branch} onChange={(e) => setSearchFilters(prev => ({ ...prev, branch: e.target.value }))}
                                    style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #fed7aa', borderRadius: '0.5rem', fontSize: '0.85rem', outline: 'none', background: 'white' }}>
                                    <option value="">All Branches</option>
                                    {['BALANAGAR', 'HI-Tech City', 'KARIMNAGAR', 'KATEDAN', 'NARAYANGUDA', 'NIZAMABAD', 'SURYAPET', 'UPPAL', 'WARANGAL'].map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setSearchFilters({ assetNumber: '', branch: '', customerName: '' })}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'white', border: '1px solid #fed7aa', color: '#c2410c', padding: '0.35rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                                <X size={13} /> Reset
                            </button>
                        </div>
                    </div>
                )}

                {/* Table */}
                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-block', width: '2rem', height: '2rem', border: '3px solid #fed7aa', borderBottomColor: '#c2410c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                        <p style={{ color: '#94a3b8', marginTop: '1rem', fontWeight: 500 }}>Loading inactive assets...</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                            <thead>
                                <tr>
                                    {['Asset No', 'Customer Name', 'Branch', 'Start Date', 'End Date', 'Follow-ups', 'Action'].map(h => (
                                        <th key={h} style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {currentAssets.map((asset) => (
                                    <tr key={asset._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{asset.assetNumber}</td>
                                        <td style={{ padding: '12px 16px', color: '#334155', fontSize: '0.9rem', minWidth: '200px' }}>{asset.customerName}</td>
                                        <td style={{ padding: '12px 16px', color: '#334155', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{asset.branch}</td>
                                        <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{asset.contractStartDate ? new Date(asset.contractStartDate).toLocaleDateString('en-IN') : '-'}</td>
                                        <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{asset.contractEndDate ? new Date(asset.contractEndDate).toLocaleDateString('en-IN') : '-'}</td>
                                        <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                                            <span style={{ background: (asset.inactiveFollowups?.length || 0) > 0 ? '#fef3c7' : '#f1f5f9', color: (asset.inactiveFollowups?.length || 0) > 0 ? '#d97706' : '#94a3b8', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                {asset.inactiveFollowups?.length || 0} Follow-up{(asset.inactiveFollowups?.length || 0) !== 1 ? 's' : ''}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <button onClick={() => handleOpenFollowup(asset)}
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.875rem', background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                                                <MessageSquareQuote size={14} /> Follow Up
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {currentAssets.length === 0 && (
                                    <tr><td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>No inactive assets found matching your criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {pages > 1 && (
                    <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', fontSize: '0.85rem' }}>
                        <div className="text-gray-600">Showing page {page} of {pages > 0 ? pages : 1} entries</div>
                        <div className="pagination-controls">
                            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
                            <button className="active">{page}</button>
                            <button disabled={page === pages || pages === 0} onClick={() => setPage(p => Math.min(pages, p + 1))}>Next</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Follow Up Modal */}
            {showFollowupModal && selectedAsset && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', overflowY: 'auto', padding: '2rem 1rem' }}
                    onClick={handleCloseFollowup}>
                    <div style={{ background: 'white', borderRadius: '1.25rem', width: '100%', maxWidth: '1050px', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'row', overflow: 'hidden', minHeight: '600px' }}
                        onClick={e => e.stopPropagation()}>

                        {/* LEFT PANE — Form */}
                        <div style={{ width: '42%', background: '#fffbf5', borderRight: '1px solid #fed7aa', display: 'flex', flexDirection: 'column' }}>
                            {/* Form Header */}
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #fed7aa', background: 'white' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem' }}>Add New Follow-up</h3>
                                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.5rem', padding: '0.625rem 0.875rem' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#92400e', margin: 0, fontWeight: 600 }}>
                                        Asset: <span style={{ color: '#c2410c' }}>{selectedAsset.assetNumber}</span>
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#b45309', margin: '0.2rem 0 0', lineHeight: '1.4' }}>
                                        {selectedAsset.customerName} &nbsp;|&nbsp; {selectedAsset.branch}
                                    </p>
                                </div>
                            </div>

                            {/* Form Body */}
                            <div style={{ padding: '1.25rem', flex: 1, overflowY: 'auto' }}>
                                {successMsg && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                                        <CheckCircle size={16} /> {successMsg}
                                    </div>
                                )}
                                <form onSubmit={submitFollowup}>
                                    {/* Employee ID with auto-fill */}
                                    <div style={{ marginBottom: '0.875rem' }}>
                                        <label style={labelStyle}>Employee ID *</label>
                                        <input
                                            type="text"
                                            name="employeeId"
                                            value={followupForm.employeeId}
                                            onChange={handleEmpIdChange}
                                            placeholder="Enter Employee ID..."
                                            style={{ ...inputStyle, borderColor: empLookupStatus === 'found' ? '#bbf7d0' : empLookupStatus === 'notfound' ? '#fecaca' : '#e2e8f0' }}
                                            required
                                        />
                                        {empLookupStatus === 'found' && <p style={{ fontSize: '0.7rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>✓ Employee found — Name & Contact auto-filled</p>}
                                        {empLookupStatus === 'notfound' && <p style={{ fontSize: '0.7rem', color: '#dc2626', marginTop: '0.25rem', fontWeight: 600 }}>⚠ Employee ID not found in database</p>}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                                        <div>
                                            <label style={labelStyle}>Employee Name *</label>
                                            <input type="text" name="employeeName" value={followupForm.employeeName} onChange={handleFormChange} style={{ ...inputStyle, background: empLookupStatus === 'found' ? '#f0fdf4' : 'white' }} required />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Emp Contact Number</label>
                                            <input type="text" name="empContactNumber" value={followupForm.empContactNumber} onChange={handleFormChange} style={{ ...inputStyle, background: empLookupStatus === 'found' ? '#f0fdf4' : 'white' }} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '0.875rem' }}>
                                        <label style={labelStyle}>Follow-up Date *</label>
                                        <input type="date" name="followUpDate" value={followupForm.followUpDate} onChange={handleFormChange} style={inputStyle} required />
                                    </div>

                                    <hr style={{ border: 'none', borderTop: '1px solid #fed7aa', margin: '1rem 0' }} />

                                    <div style={{ marginBottom: '0.875rem' }}>
                                        <label style={labelStyle}>Customer Contacted Name *</label>
                                        <input type="text" name="customerContactedName" value={followupForm.customerContactedName} onChange={handleFormChange} style={inputStyle} required />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.875rem' }}>
                                        <div>
                                            <label style={labelStyle}>Customer Contact Number</label>
                                            <input type="text" name="customerContactNumber" value={followupForm.customerContactNumber} onChange={handleFormChange} style={inputStyle} />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Customer Email ID</label>
                                            <input type="email" name="customerContactEmail" value={followupForm.customerContactEmail} onChange={handleFormChange} style={inputStyle} />
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={labelStyle}>Remarks / Discussion Points *</label>
                                        <textarea name="remarks" value={followupForm.remarks} onChange={handleFormChange} rows="4"
                                            style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }} required />
                                    </div>

                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={labelStyle}>PO Status</label>
                                        <select name="poStatus" value={followupForm.poStatus} onChange={handleFormChange} style={inputStyle}>
                                            <option value="">-- Select PO Status --</option>
                                            <option value="PO Received">PO Received</option>
                                            <option value="Not Received">Not Received</option>
                                            <option value="Pending">Pending</option>
                                        </select>
                                    </div>

                                    <button type="submit" disabled={submitting}
                                        style={{ width: '100%', background: submitting ? '#fed7aa' : '#ea580c', color: 'white', fontWeight: 700, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '48px' }}>
                                        {submitting ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div> : 'Save Follow-up Record'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* RIGHT PANE — History */}
                        <div style={{ width: '58%', display: 'flex', flexDirection: 'column', background: 'white', position: 'relative' }}>
                            <button onClick={handleCloseFollowup}
                                style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
                                <X size={18} />
                            </button>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingRight: '4rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.25rem' }}>Follow-up History</h3>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                                    {(selectedAsset.inactiveFollowups || []).length} interaction{(selectedAsset.inactiveFollowups || []).length !== 1 ? 's' : ''} recorded for this asset
                                </p>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                                {!selectedAsset.inactiveFollowups || selectedAsset.inactiveFollowups.length === 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
                                        <MessageSquareQuote size={52} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                        <p style={{ color: '#94a3b8' }}>No follow-up history yet.</p>
                                        <p style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>Save a record using the form on the left.</p>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {[...selectedAsset.inactiveFollowups].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((fu, idx) => (
                                            <div key={idx} style={{ border: '1px solid #f1f5f9', borderRadius: '0.875rem', padding: '1rem', background: '#fafafa', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Calendar size={14} style={{ color: '#f97316' }} />
                                                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>
                                                            {fu.followUpDate ? new Date(fu.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                        </span>
                                                    </div>
                                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Logged: {fu.createdAt ? new Date(fu.createdAt).toLocaleDateString('en-IN') : '-'}</span>
                                                </div>
                                                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#92400e', fontStyle: 'italic', lineHeight: 1.6 }}>
                                                    "{fu.remarks}"
                                                </div>
                                                {fu.poStatus && (
                                                    <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', fontWeight: 700, color: fu.poStatus === 'PO Received' ? '#16a34a' : '#ea580c' }}>
                                                        PO Status: {fu.poStatus}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.8rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                                                        <User size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                                        <span>By: <strong>{fu.employeeName}</strong> ({fu.employeeId}){fu.empContactNumber ? ` • ${fu.empContactNumber}` : ''}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}>
                                                        <Phone size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                                        <span>Contacted: <strong>{fu.customerContactedName || '-'}</strong>{fu.customerContactNumber ? ` • ${fu.customerContactNumber}` : ''}</span>
                                                    </div>
                                                    {fu.customerContactEmail && (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                                                            <Mail size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                                            <span style={{ wordBreak: 'break-all' }}>{fu.customerContactEmail}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .table-container-fu {
                    background: white;
                    border-radius: 24px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.04);
                    border: 1px solid #f1f5f9;
                    overflow: hidden;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '0.3rem'
};

const inputStyle = {
    width: '100%',
    padding: '0.55rem 0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    background: 'white',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
};

export default InactiveFollowupStatus;
