import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Loader, X, MapPin, Building2, Save, RefreshCw } from 'lucide-react';

const AdminTools = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('states');
    const [states, setStates] = useState([]);
    const [branches, setBranches] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [stateForm, setStateForm] = useState({ name: '', code: '', status: 'Active' });
    const [branchForm, setBranchForm] = useState({
        branchName: '',
        branchCode: '',
        state: '',
        unitType: 'Branch Office',
        status: 'Active'
    });
    const [metadataForm, setMetadataForm] = useState({ name: '', code: '', description: '', status: 'Active' });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            if (activeTab === 'states') {
                const { data } = await axios.get('/api/hrms/organization/states', config);
                setStates(data);
            } else if (activeTab === 'branches') {
                const { data: stateData } = await axios.get('/api/hrms/organization/states', config);
                setStates(stateData);
                const { data: branchData } = await axios.get('/api/hrms/organization/branches', config);
                setBranches(branchData);
            } else {
                // Handle generic metadata
                const { data } = await axios.get(`/api/hrms/metadata?type=${activeTab}`, config);
                setMetadata(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    const handleStateSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            if (editingItem) {
                await axios.put(`/api/hrms/organization/states/${editingItem._id}`, stateForm, config);
            } else {
                await axios.post('/api/hrms/organization/states', stateForm, config);
            }
            setShowForm(false);
            setEditingItem(null);
            setStateForm({ name: '', code: '', status: 'Active' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.msg || 'Error saving state');
        }
    };

    const handleBranchSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            if (editingItem) {
                await axios.put(`/api/hrms/organization/branches/${editingItem._id}`, branchForm, config);
            } else {
                await axios.post('/api/hrms/organization/branches', branchForm, config);
            }
            setShowForm(false);
            setEditingItem(null);
            setBranchForm({ branchName: '', branchCode: '', state: '', unitType: 'Branch Office', status: 'Active' });
            fetchData();
        } catch (error) {
            alert('Error saving branch');
        }
    };

    const handleMetadataSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
            const payload = { ...metadataForm, type: activeTab };
            if (editingItem) {
                await axios.put(`/api/hrms/metadata/${editingItem._id}`, payload, config);
            } else {
                await axios.post('/api/hrms/metadata', payload, config);
            }
            setShowForm(false);
            setEditingItem(null);
            setMetadataForm({ name: '', code: '', description: '', status: 'Active' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving metadata');
        }
    };

    const handleDelete = async (id, type) => {
        const itemType = ['states', 'branches'].includes(type) ? type.slice(0, -1) : type;
        if (window.confirm(`Delete this ${itemType}?`)) {
            try {
                const config = { headers: { Authorization: `Bearer ${currentUser?.token}` } };
                if (['states', 'branches'].includes(type)) {
                    await axios.delete(`/api/organization/${type}/${id}`, config);
                } else {
                    await axios.delete(`/api/hrms/metadata/${id}`, config);
                }
                fetchData();
            } catch (error) {
                alert('Error deleting item');
            }
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'states') {
            setStateForm({ name: item.name, code: item.code, status: item.status });
        } else if (activeTab === 'branches') {
            setBranchForm({
                branchName: item.branchName,
                branchCode: item.branchCode,
                state: item.state,
                unitType: item.unitType,
                status: item.status
            });
        } else {
            setMetadataForm({
                name: item.name,
                code: item.code,
                description: item.description || '',
                status: item.status
            });
        }
        setShowForm(true);
    };

    const metadataTypes = [
        { id: 'states', label: 'States', icon: <MapPin size={18} /> },
        { id: 'branches', label: 'Branches', icon: <Building2 size={18} /> },
        { id: 'designation', label: 'Designations', icon: <Building2 size={18} /> },
        { id: 'role', label: 'Emp Roles', icon: <Building2 size={18} /> },
        { id: 'assetType', label: 'Asset Types', icon: <Building2 size={18} /> },
        { id: 'application', label: 'Applications', icon: <Building2 size={18} /> },
        { id: 'customerSegment', label: 'Cust Segments', icon: <Building2 size={18} /> },
        { id: 'industrySegment', label: 'Industry Segments', icon: <Building2 size={18} /> },
        { id: 'department', label: 'Departments', icon: <Building2 size={18} /> },
    ];

    return (
        <div className="admin-tools-container">
            <div className="mb-6 overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                    {metadataTypes.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    className="btn-primary flex items-center gap-2"
                    onClick={() => {
                        if (!showForm) {
                            // Reset form when opening
                            if (activeTab === 'states') setStateForm({ name: '', code: '', status: 'Active' });
                            else if (activeTab === 'branches') setBranchForm({ branchName: '', branchCode: '', state: '', unitType: 'Branch Office', status: 'Active' });
                            else setMetadataForm({ name: '', code: '', description: '', status: 'Active' });
                        }
                        setShowForm(!showForm);
                        setEditingItem(null);
                    }}
                >
                    <Plus size={18} /> {showForm ? 'Close Form' : `Add ${metadataTypes.find(t => t.id === activeTab)?.label.slice(0, -1) || 'Item'}`}
                </button>
            </div>

            {showForm && (
                <div className="card mb-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <form onSubmit={
                        activeTab === 'states' ? handleStateSubmit :
                            activeTab === 'branches' ? handleBranchSubmit :
                                handleMetadataSubmit
                    }>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                            {activeTab === 'states' ? (
                                <>
                                    <div className="form-group">
                                        <label>State Name</label>
                                        <input
                                            type="text"
                                            value={stateForm.name}
                                            onChange={e => setStateForm({ ...stateForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State Code (Optional)</label>
                                        <input
                                            type="text"
                                            value={stateForm.code}
                                            onChange={e => setStateForm({ ...stateForm, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={stateForm.status} onChange={e => setStateForm({ ...stateForm, status: e.target.value })}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </>
                            ) : activeTab === 'branches' ? (
                                <>
                                    <div className="form-group">
                                        <label>Branch Name</label>
                                        <input
                                            type="text"
                                            value={branchForm.branchName}
                                            onChange={e => setBranchForm({ ...branchForm, branchName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Branch Code (Optional)</label>
                                        <input
                                            type="text"
                                            value={branchForm.branchCode}
                                            onChange={e => setBranchForm({ ...branchForm, branchCode: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>State</label>
                                        <select
                                            value={branchForm.state}
                                            onChange={e => setBranchForm({ ...branchForm, state: e.target.value })}
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Unit Type</label>
                                        <select value={branchForm.unitType} onChange={e => setBranchForm({ ...branchForm, unitType: e.target.value })}>
                                            <option value="Head Office">Head Office</option>
                                            <option value="Regional Office">Regional Office</option>
                                            <option value="Zonal Office">Zonal Office</option>
                                            <option value="Branch Office">Branch Office</option>
                                            <option value="Satellite Office">Satellite Office</option>
                                            <option value="Service & Spare Outlets">Service & Spare Outlets</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={branchForm.status} onChange={e => setBranchForm({ ...branchForm, status: e.target.value })}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>{metadataTypes.find(t => t.id === activeTab)?.label.slice(0, -1)} Name</label>
                                        <input
                                            type="text"
                                            value={metadataForm.name}
                                            onChange={e => setMetadataForm({ ...metadataForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Code (Optional)</label>
                                        <input
                                            type="text"
                                            value={metadataForm.code}
                                            onChange={e => setMetadataForm({ ...metadataForm, code: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select value={metadataForm.status} onChange={e => setMetadataForm({ ...metadataForm, status: e.target.value })}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 p-4 border-t">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn-primary flex items-center gap-2">
                                <Save size={18} /> {editingItem ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="text-center py-10"><Loader className="animate-spin inline mr-2" /> Loading...</div>
            ) : (
                <div className="table-container shadow-sm border rounded-xl overflow-hidden bg-white">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                {activeTab === 'states' ? (
                                    <>
                                        <th className="p-4 text-left font-semibold text-slate-600">State Name</th>
                                        <th className="p-4 text-left font-semibold text-slate-600">Code</th>
                                    </>
                                ) : activeTab === 'branches' ? (
                                    <>
                                        <th className="p-4 text-left font-semibold text-slate-600">Branch Name</th>
                                        <th className="p-4 text-left font-semibold text-slate-600">Code</th>
                                        <th className="p-4 text-left font-semibold text-slate-600">State</th>
                                        <th className="p-4 text-left font-semibold text-slate-600">Type</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-4 text-left font-semibold text-slate-600">Name</th>
                                        <th className="p-4 text-left font-semibold text-slate-600">Code</th>
                                    </>
                                )}
                                <th className="p-4 text-center font-semibold text-slate-600">Status</th>
                                <th className="p-4 text-center font-semibold text-slate-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === 'states' ? states : activeTab === 'branches' ? branches : metadata).map(item => (
                                <tr key={item._id} className="border-b hover:bg-slate-50 transition-colors">
                                    {activeTab === 'states' ? (
                                        <>
                                            <td className="p-4">{item.name}</td>
                                            <td className="p-4"><code>{item.code}</code></td>
                                        </>
                                    ) : activeTab === 'branches' ? (
                                        <>
                                            <td className="p-4 font-medium">{item.branchName}</td>
                                            <td className="p-4"><code>{item.branchCode}</code></td>
                                            <td className="p-4">{item.state}</td>
                                            <td className="p-4"><small className="bg-slate-100 px-2 py-1 rounded text-slate-600">{item.unitType}</small></td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-4 font-medium">{item.name}</td>
                                            <td className="p-4"><code>{item.code || '-'}</code></td>
                                        </>
                                    )}
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(item._id, activeTab)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(activeTab === 'states' ? states : activeTab === 'branches' ? branches : metadata).length === 0 && (
                                <tr>
                                    <td colSpan={activeTab === 'states' ? 4 : 6} className="p-10 text-center text-slate-400">
                                        No items found. Click add to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <style jsx>{`
                .tab-btn {
                    padding: 0.75rem 1.5rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: #64748b;
                    background: transparent;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                .tab-btn.active {
                    background: #fff;
                    color: #ef4444;
                    border-color: #f1f5f9;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                }
                .form-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 0.5rem;
                }
                .form-group input, .form-group select {
                    width: 100%;
                    height: 42px;
                    padding: 0 1rem;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    outline: none;
                }
                .form-group input:focus, .form-group select:focus {
                    border-color: #ef4444;
                    ring: 2px solid #fee2e2;
                }
            `}</style>
        </div>
    );
};

export default AdminTools;
