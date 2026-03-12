import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { BRANCHES } from '../data/branches';
import BulkUserImport from '../components/BulkUserImport';
import { BulkUserData } from '../utils/bulkUserImport';

import { userStorage } from '../utils/userStorage';

interface UserManagementProps {
    currentUser: User;
}

interface NewUser {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    employeeId?: string;
    state?: string;
    branch?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser }) => {
    const [users, setUsers] = useState<User[]>(() => {
        userStorage.initialize();
        return userStorage.getUsers();
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [showBulkImport, setShowBulkImport] = useState(false);
    const [showPasswordEdit, setShowPasswordEdit] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [newUser, setNewUser] = useState<NewUser>({
        username: '',
        password: '',
        name: '',
        role: 'employee',
        employeeId: '',
        state: '',
        branch: ''
    });



    const [filterRole, setFilterRole] = useState<string>('');
    const [filterState, setFilterState] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [originalUsername, setOriginalUsername] = useState('');
    const itemsPerPage = 10;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filterRole, filterState, searchTerm]);

    const getRoleLabel = (role: UserRole): string => {
        const labels: Record<UserRole, string> = {
            superadmin: 'Super Admin',
            admin: 'Admin',
            hr_manager: 'HR Operations Manager',
            employee: 'Employee'
        };
        return labels[role];
    };

    const getRoleBadgeColor = (role: UserRole): string => {
        const colors: Record<UserRole, string> = {
            superadmin: '#dc2626',
            admin: '#f59e0b',
            hr_manager: '#3b82f6',
            employee: '#6b7280'
        };
        return colors[role];
    };

    const canCreateRole = (role: UserRole): boolean => {
        if (currentUser.role === 'superadmin') return true;
        if (currentUser.role === 'admin') {
            return ['hr_manager', 'employee'].includes(role);
        }
        if (currentUser.role === 'hr_manager') {
            return ['employee'].includes(role);
        }
        return false;
    };

    const availableRoles: UserRole[] = currentUser.role === 'superadmin'
        ? ['superadmin', 'admin', 'hr_manager', 'employee']
        : currentUser.role === 'admin'
            ? ['hr_manager', 'employee']
            : currentUser.role === 'hr_manager'
                ? ['employee']
                : [];

    const states = Array.from(new Set(BRANCHES.map(b => b.state)));
    const branches = BRANCHES.filter(b => newUser.state === '' || b.state === newUser.state).map(b => b.branchName);

    const resetForm = () => {
        setNewUser({
            username: '',
            password: '',
            name: '',
            role: 'employee',
            employeeId: '',
            state: '',
            branch: ''
        });
        setIsEditing(false);
        setOriginalUsername('');
        setShowAddForm(false);
    };

    const handleSaveUser = () => {
        if (!newUser.username || !newUser.password || !newUser.name) {
            alert('Please fill all required fields');
            return;
        }

        const userData: User = {
            username: newUser.username,
            role: newUser.role,
            name: newUser.name,
            password: newUser.password,
            ...(newUser.employeeId && { employeeId: newUser.employeeId }),
            ...(newUser.state && { state: newUser.state }),
            ...(newUser.branch && { branch: newUser.branch })
        };

        if (isEditing) {
            const updatedUsers = users.map(u => u.username === originalUsername ? userData : u);
            setUsers(updatedUsers);
            userStorage.saveUsers(updatedUsers);
            alert('User updated successfully');
        } else {
            if (users.some(u => u.username === newUser.username)) {
                alert('Username already exists');
                return;
            }
            const updatedUsers = [...users, userData];
            setUsers(updatedUsers);
            userStorage.saveUsers(updatedUsers);
            alert('User created successfully');
        }
        resetForm();
    };

    const handleEditUser = (user: User) => {
        setNewUser({
            username: user.username,
            password: user.password || '',
            name: user.name,
            role: user.role,
            employeeId: user.employeeId || '',
            state: user.state || '',
            branch: user.branch || ''
        });
        setOriginalUsername(user.username);
        setIsEditing(true);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteUser = (username: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const updatedUsers = users.filter(u => u.username !== username);
            setUsers(updatedUsers);
            userStorage.saveUsers(updatedUsers);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = filterRole === '' || user.role === filterRole;
        const matchesState = filterState === '' || user.state === filterState;
        const matchesSearch = searchTerm === '' ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesRole && matchesState && matchesSearch;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const requiresGeography = (role: UserRole): boolean => {
        return ['employee'].includes(role);
    };

    const handleBulkImport = (importedUsers: BulkUserData[]) => {
        const newUsers: User[] = importedUsers.map(user => ({
            username: user.username,
            name: user.name,
            role: user.role,
            password: user.password, // Include password for superadmin visibility
            employeeId: user.employeeId,
            state: user.state,
            branch: user.branch
        }));

        const updatedUsers = [...users, ...newUsers];
        setUsers(updatedUsers); // Removed duplicate setUsers call
        userStorage.saveUsers(updatedUsers);
        setShowBulkImport(false);
    };

    const handleEditPassword = (user: User) => {
        setEditingUser(user);
        setNewPassword(user.password || '');
        setShowPasswordEdit(true);
    };

    const handleSavePassword = () => {
        if (!editingUser || !newPassword.trim()) {
            alert('Please enter a valid password');
            return;
        }

        const updatedUsers = users.map(u =>
            u.username === editingUser.username
                ? { ...u, password: newPassword }
                : u
        );
        setUsers(updatedUsers);
        userStorage.saveUsers(updatedUsers);

        setShowPasswordEdit(false);
        setEditingUser(null);
        setNewPassword('');
        alert('Password updated successfully!');
    };

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', margin: '0' }}>
                {/* Header */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
                                <i className="fas fa-users-cog" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                User Management
                            </h2>
                            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                                Manage system users, roles, and permissions with geographical scoping
                            </p>
                        </div>
                        {(currentUser.role === 'superadmin' || currentUser.role === 'admin' || currentUser.role === 'hr_manager') && (
                            <div style={{ display: 'flex', gap: '10px' }}>

                                <button
                                    onClick={() => setShowBulkImport(true)}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className="fas fa-file-upload"></i>
                                    Bulk Import
                                </button>
                                <button
                                    onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#5d5fef',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <i className={`fas ${showAddForm ? 'fa-times' : 'fa-user-plus'}`}></i>
                                    {showAddForm ? 'Cancel' : 'Add New User'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Add User Form */}
                {showAddForm && (
                    <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                            {isEditing ? 'Edit User Details' : 'Create New User'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    User ID / Username <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    placeholder="e.g., EMP001 or admin.name"
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', background: isEditing ? '#f1f5f9' : 'white' }}
                                    disabled={isEditing}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    placeholder="Enter full name"
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Password <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Enter password"
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Role <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole, state: '', branch: '' })}
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    {availableRoles.map(role => (
                                        <option key={role} value={role}>{getRoleLabel(role)}</option>
                                    ))}
                                </select>
                            </div>
                            {newUser.role === 'employee' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                        Employee ID
                                    </label>
                                    <input
                                        type="text"
                                        value={newUser.employeeId}
                                        onChange={(e) => setNewUser({ ...newUser, employeeId: e.target.value })}
                                        placeholder="e.g., EMP001"
                                        style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                                    />
                                </div>
                            )}
                            {requiresGeography(newUser.role) && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                            State <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <select
                                            value={newUser.state}
                                            onChange={(e) => setNewUser({ ...newUser, state: e.target.value, branch: '' })}
                                            style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                        >
                                            <option value="">Select State</option>
                                            {states.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    {newUser.role === 'employee' && (
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                                Branch / Location <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <select
                                                value={newUser.branch}
                                                onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                                                style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                                disabled={!newUser.state}
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={resetForm}
                                style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveUser}
                                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                                {isEditing ? 'Update User' : 'Create User'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                Search User
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID, Name..."
                                style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                Filter by Role
                            </label>
                            <select
                                value={filterRole}
                                onChange={(e) => setFilterRole(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                            >
                                <option value="">All Roles</option>
                                {(['superadmin', 'admin', 'hr_manager', 'employee'] as UserRole[]).map(role => (
                                    <option key={role} value={role}>{getRoleLabel(role)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                Filter by State
                            </label>
                            <select
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                            >
                                <option value="">All States</option>
                                {states.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button
                                onClick={() => { setFilterRole(''); setFilterState(''); setSearchTerm(''); }}
                                style={{ width: '100%', padding: '10px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                <i className="fas fa-redo" style={{ marginRight: '8px' }}></i>
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>User ID</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Name</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Role</th>
                                {currentUser.role === 'superadmin' && (
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>
                                        <i className="fas fa-key" style={{ marginRight: '6px', color: '#dc2626' }}></i>
                                        Password
                                    </th>
                                )}
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>State</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Branch</th>
                                <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Employee ID</th>
                                <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((user, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                    <td style={{ padding: '15px', fontWeight: '600', color: '#5d5fef' }}>{user.username}</td>
                                    <td style={{ padding: '15px', fontWeight: '500' }}>{user.name}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            background: `${getRoleBadgeColor(user.role)}20`,
                                            color: getRoleBadgeColor(user.role)
                                        }}>
                                            {getRoleLabel(user.role)}
                                        </span>
                                    </td>
                                    {currentUser.role === 'superadmin' && (
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <code style={{
                                                    padding: '4px 8px',
                                                    background: '#fef2f2',
                                                    color: '#dc2626',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    fontFamily: 'monospace',
                                                    fontWeight: '600',
                                                    border: '1px solid #fecaca'
                                                }}>
                                                    {user.password || '••••••'}
                                                </code>
                                                {user.password && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(user.password || '');
                                                                alert('Password copied to clipboard!');
                                                            }}
                                                            style={{
                                                                padding: '4px 8px',
                                                                background: '#dbeafe',
                                                                color: '#1e40af',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '11px'
                                                            }}
                                                            title="Copy password"
                                                        >
                                                            <i className="fas fa-copy"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditPassword(user)}
                                                            style={{
                                                                padding: '4px 8px',
                                                                background: '#fef3c7',
                                                                color: '#92400e',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '11px'
                                                            }}
                                                            title="Edit password"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                    <td style={{ padding: '15px', color: '#64748b' }}>{user.state || '-'}</td>
                                    <td style={{ padding: '15px', color: '#64748b' }}>{user.branch || '-'}</td>
                                    <td style={{ padding: '15px', color: '#64748b' }}>{user.employeeId || '-'}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        {(currentUser.role === 'superadmin' || currentUser.role === 'admin') ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                <button
                                                    title="Edit User"
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
                                                    onClick={() => handleEditUser(user)}
                                                >
                                                    <i className="fas fa-edit" style={{ fontSize: '14px' }}></i>
                                                </button>
                                                <button
                                                    title="Delete User"
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
                                                    onClick={() => handleDeleteUser(user.username)}
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
                    {filteredUsers.length === 0 && (
                        <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                            <i className="fas fa-users" style={{ fontSize: '40px', marginBottom: '15px', color: '#e2e8f0' }}></i>
                            <p>No users found matching your filters.</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                    <div style={{ padding: '20px', background: 'white', borderRadius: '0 0 12px 12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '-10px', marginBottom: '25px' }}>
                        <div style={{ color: '#64748b', fontSize: '14px' }}>
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
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

                {/* Role Hierarchy Info */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginTop: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                        <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#5d5fef' }}></i>
                        Role Hierarchy & Permissions
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', fontSize: '13px', color: '#64748b' }}>
                        <div style={{ padding: '12px', background: '#fef2f2', borderRadius: '8px', borderLeft: '3px solid #dc2626' }}>
                            <strong style={{ color: '#dc2626' }}>Super Admin:</strong> Full system control, can create all roles
                        </div>
                        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                            <strong style={{ color: '#f59e0b' }}>Admin:</strong> Can create HR Managers and employees
                        </div>
                        <div style={{ padding: '12px', background: '#dbeafe', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                            <strong style={{ color: '#3b82f6' }}>HR Operations Manager:</strong> Can enroll employees, manage all HR operations
                        </div>
                        <div style={{ padding: '12px', background: '#f3f4f6', borderRadius: '8px', borderLeft: '3px solid #6b7280' }}>
                            <strong style={{ color: '#6b7280' }}>Employee:</strong> Login with Employee ID (e.g., EMP001), custom menu access via User-Level Permissions
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Import Modal */}
            {showBulkImport && (
                <BulkUserImport
                    currentUser={currentUser}
                    onImportComplete={handleBulkImport}
                    onClose={() => setShowBulkImport(false)}
                />
            )}

            {/* Password Edit Modal */}
            {showPasswordEdit && editingUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                    }}>
                        {/* Header */}
                        <div style={{
                            padding: '25px',
                            borderBottom: '2px solid #e2e8f0',
                            background: '#f8fafc'
                        }}>
                            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>
                                <i className="fas fa-key" style={{ marginRight: '12px', color: '#dc2626' }}></i>
                                Edit Password
                            </h2>
                            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                                Change password for <strong>{editingUser.name}</strong> ({editingUser.username})
                            </p>
                        </div>

                        {/* Content */}
                        <div style={{ padding: '25px' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '14px', fontWeight: '600' }}>
                                    <i className="fas fa-lock" style={{ marginRight: '6px' }}></i>
                                    New Password
                                </label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1.5px solid #e2e8f0',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontFamily: 'monospace'
                                    }}
                                    autoFocus
                                />
                                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                                    <i className="fas fa-info-circle" style={{ marginRight: '4px' }}></i>
                                    Current password: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{editingUser.password}</code>
                                </p>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => {
                                        setShowPasswordEdit(false);
                                        setEditingUser(null);
                                        setNewPassword('');
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f1f5f9',
                                        color: '#475569',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSavePassword}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                                    Save Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Components */}
        </div>
    );
};

export default UserManagement;
