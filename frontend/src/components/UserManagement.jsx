import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Download, Upload, Loader, X, RefreshCw } from 'lucide-react';

const UserManagement = () => {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showPasswordInForm, setShowPasswordInForm] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        employeeId: '',
        employeeName: '',
        password: '',
        role: 'Service Engineer'
    });

    const roles = [
        'Super Admin', 'Admin', 'HR Head', 'Branch Manager', 'Service Manager',
        'Advisor', 'AMC Coordinator', 'Service Engineer', 'Accounts Manager',
        'Accounts executive', 'Coordinator', 'SPC', 'Ashwasan Coordinator',
        'NEPI Coordinator', 'Leads Coordinator', 'HR Executive', 'Operations Head',
        'Sales Execitive', 'Sales Manager'
    ];

    const isAdmin = currentUser && (currentUser.role === 'Admin' || currentUser.role === 'Super Admin');

    useEffect(() => {
        fetchUsers();
    }, [page, searchTerm, filterRole]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            };
            const { data } = await axios.get(`/api/users?pageNumber=${page}&searchTerm=${searchTerm}&role=${filterRole}`, config);
            setUsers(data.users);
            setPages(data.pages);
        } catch (error) {
            alert(error.response?.data?.message || 'Error fetching users');
        }
        setLoading(false);
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            };

            if (editingUser) {
                await axios.put(`/api/users/${editingUser._id}`, formData, config);
            } else {
                await axios.post('/api/users', formData, config);
            }

            setShowForm(false);
            setEditingUser(null);
            setFormData({ employeeId: '', employeeName: '', password: '', role: 'Service Engineer' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${currentUser.token}` }
                };
                await axios.delete(`/api/users/${id}`, config);
                fetchUsers();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting user');
            }
        }
    };

    const handleEdit = (userToEdit) => {
        setEditingUser(userToEdit);
        setFormData({
            employeeId: userToEdit.employeeId,
            employeeName: userToEdit.employeeName,
            password: '',
            role: userToEdit.role
        });
        setShowForm(true);
    };

    const handleExport = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${currentUser.token}` },
                responseType: 'blob'
            };
            const response = await axios.get(`/api/users/export?searchTerm=${searchTerm}&role=${filterRole}`, config);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error exporting users');
        }
    };

    const handleImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post('/api/users/import', formData, config);
            alert('Import successful');
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || 'Error importing users');
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterRole('');
        setPage(1);
    };

    return (
        <div className="main-content-inner">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 style={{ margin: 0 }}>User Management</h2>
                <div className="flex gap-2">
                    {isAdmin && (
                        <>
                            <button className="btn-primary" onClick={() => { setEditingUser(null); setFormData({ employeeId: '', employeeName: '', password: '', role: 'Service Engineer' }); setShowForm(!showForm); }}>
                                <Plus size={18} style={{ marginRight: '8px' }} /> {showForm ? 'Close Form' : 'Add User'}
                            </button>
                            <label className="btn-secondary flex items-center gap-2" style={{ cursor: 'pointer', margin: 0 }}>
                                <Upload size={18} /> Bulk Import
                                <input type="file" accept=".xlsx, .xls" onChange={handleImport} style={{ display: 'none' }} />
                            </label>
                        </>
                    )}
                    <button className="btn-secondary flex items-center gap-2" onClick={handleExport}>
                        <Download size={18} /> Export List
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="filter-item">
                    <label>Search User</label>
                    <input
                        type="text"
                        placeholder="Search by ID, Name..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="filter-item">
                    <label>Filter by Role</label>
                    <select
                        value={filterRole}
                        onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
                    >
                        <option value="">All Roles</option>
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <button className="btn-reset" onClick={resetFilters}>
                    <RefreshCw size={18} /> Reset Filters
                </button>
            </div>

            {/* Form Section (Inline) */}
            {showForm && (
                <div className="inline-form-card">
                    <div className="inline-form-header">
                        <h3>
                            <Plus size={24} className="text-red" />
                            {editingUser ? 'Edit User Credentials' : 'Create New User Account'}
                        </h3>
                        <div className="flex gap-2">
                            <button className="btn-secondary" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.2rem' }}>
                                <X size={18} style={{ marginRight: '8px' }} /> Cancel
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleCreateOrUpdate}>
                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Plus size={18} /> Account Identity
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Employee ID*</label>
                                    <input
                                        type="text"
                                        value={formData.employeeId}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        required
                                        placeholder="e.g. EMP001"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Employee Name*</label>
                                    <input
                                        type="text"
                                        value={formData.employeeName}
                                        onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                                        required
                                        placeholder="Enter full name"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="inline-form-section">
                            <div className="inline-form-section-title">
                                <Loader size={18} /> Security & Permissions
                            </div>
                            <div className="inline-form-grid">
                                <div className="form-group">
                                    <label>Password {(['Super Admin', 'Admin'].includes(formData.role)) ? '*' : '(Optional)'}</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPasswordInForm ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required={['Super Admin', 'Admin'].includes(formData.role) && !editingUser}
                                            placeholder={editingUser ? 'Keep blank to stay same' : 'Enter password'}
                                            style={{ paddingRight: '4.5rem' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordInForm(!showPasswordInForm)}
                                            style={{
                                                position: 'absolute',
                                                right: '10px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                color: 'var(--primary-red)',
                                                fontSize: '0.75rem',
                                                fontWeight: '700'
                                            }}
                                        >
                                            {showPasswordInForm ? 'HIDE' : 'SHOW'}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="inline-form-footer">
                            <button type="button" className="btn-secondary" onClick={() => setShowForm(false)} style={{ width: '150px' }}>Cancel</button>
                            <button type="submit" className="btn-primary" style={{ width: '220px' }}>
                                {editingUser ? 'Update User Account' : 'Create User Account'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table Section */}
            {loading ? (
                <div className="text-center mt-4"><Loader className="animate-spin" /></div>
            ) : (
                <>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Role</th>
                                    <th>Password Status</th>
                                    {isAdmin && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td><strong>{u.employeeId}</strong></td>
                                        <td>{u.employeeName}</td>
                                        <td><span className={`badge ${['Admin', 'Super Admin'].includes(u.role) ? 'badge-admin' : 'badge-user'}`}>{u.role}</span></td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <small style={{ color: '#888' }}>(Hashed)</small>
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEdit(u)} style={{ background: 'none', color: '#007bff' }}><Edit size={18} /></button>
                                                    <button onClick={() => handleDelete(u._id)} style={{ background: 'none', color: '#dc3545' }}><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center mt-4 gap-2">
                        {[...Array(pages).keys()].map(x => (
                            <button
                                key={x + 1}
                                onClick={() => setPage(x + 1)}
                                className={page === x + 1 ? 'btn-primary' : 'btn-secondary'}
                                style={{ padding: '0.4rem 0.8rem', minWidth: '40px' }}
                            >
                                {x + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default UserManagement;
