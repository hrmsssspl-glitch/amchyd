import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { menuItems, modules } from '../data/dashboardData';
import { getUserPermissions, saveUserPermission, getPermissionsByUserId } from '../utils/permissionService';
import { UserPermission } from '../types/permissions';

interface UserPermissionManagerProps {
    currentUser: User;
    allUsers: User[];
}

const UserPermissionManager: React.FC<UserPermissionManagerProps> = ({ currentUser, allUsers }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
    const [selectedModules, setSelectedModules] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
    const [viewMode, setViewMode] = useState<'assign' | 'view'>('assign');

    const filteredUsers = allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);

        // Load existing permissions for this user
        const existingPermission = getPermissionsByUserId(user.username);
        if (existingPermission) {
            setSelectedMenus(existingPermission.menuIds);
            setSelectedModules(existingPermission.moduleIds);
        } else {
            // Default to empty (will use role-based permissions)
            setSelectedMenus([]);
            setSelectedModules([]);
        }
    };

    const toggleMenu = (menuId: number) => {
        setSelectedMenus(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const toggleModule = (moduleId: number) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const selectAllMenus = () => {
        setSelectedMenus(menuItems.map(m => m.id));
    };

    const clearAllMenus = () => {
        setSelectedMenus([]);
    };

    const selectAllModules = () => {
        setSelectedModules(modules.map(m => m.id));
    };

    const clearAllModules = () => {
        setSelectedModules([]);
    };

    const handleSave = () => {
        if (!selectedUser) return;

        setSaveStatus('saving');

        const permission: UserPermission = {
            userId: selectedUser.username,
            menuIds: selectedMenus,
            moduleIds: selectedModules
        };

        saveUserPermission(permission);

        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const allUserPermissions = getUserPermissions();

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', margin: '0' }}>
                {/* Header */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
                                <i className="fas fa-user-lock" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                User-Level Permission Management
                            </h2>
                            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                                Assign custom menu and module access to individual users based on their Login ID
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setViewMode('assign')}
                                style={{
                                    padding: '10px 20px',
                                    background: viewMode === 'assign' ? '#5d5fef' : '#f1f5f9',
                                    color: viewMode === 'assign' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-user-edit" style={{ marginRight: '8px' }}></i>
                                Assign Permissions
                            </button>
                            <button
                                onClick={() => setViewMode('view')}
                                style={{
                                    padding: '10px 20px',
                                    background: viewMode === 'view' ? '#5d5fef' : '#f1f5f9',
                                    color: viewMode === 'view' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                                View All Permissions
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'assign' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '25px' }}>
                        {/* User List */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                            <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                Select User
                            </h3>
                            <input
                                type="text"
                                placeholder="Search by Login ID or Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    border: '1.5px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    marginBottom: '15px'
                                }}
                            />
                            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {filteredUsers.map(user => {
                                    const hasCustomPermissions = getPermissionsByUserId(user.username) !== null;
                                    return (
                                        <div
                                            key={user.username}
                                            onClick={() => handleUserSelect(user)}
                                            style={{
                                                padding: '12px',
                                                background: selectedUser?.username === user.username ? '#eff6ff' : '#f8fafc',
                                                border: selectedUser?.username === user.username ? '2px solid #5d5fef' : '1px solid #e2e8f0',
                                                borderRadius: '8px',
                                                marginBottom: '10px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{user.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#5d5fef', fontWeight: '600' }}>{user.username}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                        Role: {user.role.replace('_', ' ').toUpperCase()}
                                                    </div>
                                                </div>
                                                {hasCustomPermissions && (
                                                    <i className="fas fa-check-circle" style={{ color: '#10b981', fontSize: '16px' }} title="Has custom permissions"></i>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Permission Assignment */}
                        {selectedUser ? (
                            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                                            Permissions for: {selectedUser.name}
                                        </h3>
                                        <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '13px' }}>
                                            Login ID: <strong>{selectedUser.username}</strong> | Role: <strong>{selectedUser.role}</strong>
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={saveStatus === 'saving'}
                                        style={{
                                            padding: '12px 24px',
                                            background: saveStatus === 'success' ? '#10b981' : '#5d5fef',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <i className={`fas ${saveStatus === 'success' ? 'fa-check' : 'fa-save'}`}></i>
                                        {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Permissions'}
                                    </button>
                                </div>

                                {/* Menu Permissions */}
                                <div style={{ marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                            <i className="fas fa-bars" style={{ marginRight: '8px', color: '#5d5fef' }}></i>
                                            Sidebar Menu Access ({selectedMenus.length} selected)
                                        </h4>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={selectAllMenus}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#f1f5f9',
                                                    color: '#475569',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={clearAllMenus}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                        {menuItems.map(menu => (
                                            <div
                                                key={menu.id}
                                                onClick={() => toggleMenu(menu.id)}
                                                style={{
                                                    padding: '12px',
                                                    background: selectedMenus.includes(menu.id) ? '#eff6ff' : '#f8fafc',
                                                    border: selectedMenus.includes(menu.id) ? '2px solid #5d5fef' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: selectedMenus.includes(menu.id) ? '#5d5fef' : '#e2e8f0',
                                                    color: selectedMenus.includes(menu.id) ? 'white' : '#64748b',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px'
                                                }}>
                                                    <i className={`fas ${menu.icon}`}></i>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{menu.name}</div>
                                                </div>
                                                {selectedMenus.includes(menu.id) && (
                                                    <i className="fas fa-check-circle" style={{ color: '#5d5fef', fontSize: '16px' }}></i>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Module Permissions */}
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                            <i className="fas fa-th-large" style={{ marginRight: '8px', color: '#5d5fef' }}></i>
                                            Dashboard Module Access ({selectedModules.length} selected)
                                        </h4>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={selectAllModules}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#f1f5f9',
                                                    color: '#475569',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Select All
                                            </button>
                                            <button
                                                onClick={clearAllModules}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#fee2e2',
                                                    color: '#dc2626',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Clear All
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                        {modules.map(module => (
                                            <div
                                                key={module.id}
                                                onClick={() => toggleModule(module.id)}
                                                style={{
                                                    padding: '12px',
                                                    background: selectedModules.includes(module.id) ? '#eff6ff' : '#f8fafc',
                                                    border: selectedModules.includes(module.id) ? '2px solid #5d5fef' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    background: selectedModules.includes(module.id) ? '#5d5fef' : '#e2e8f0',
                                                    color: selectedModules.includes(module.id) ? 'white' : '#64748b',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '14px'
                                                }}>
                                                    <i className={`fas ${module.icon}`}></i>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{module.title}</div>
                                                </div>
                                                {selectedModules.includes(module.id) && (
                                                    <i className="fas fa-check-circle" style={{ color: '#5d5fef', fontSize: '16px' }}></i>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: 'white', borderRadius: '12px', padding: '60px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                                <i className="fas fa-user-circle" style={{ fontSize: '60px', color: '#e2e8f0', marginBottom: '20px' }}></i>
                                <h3 style={{ color: '#64748b', fontWeight: '600' }}>Select a user to assign permissions</h3>
                                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Choose a user from the list on the left to customize their menu and module access</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* View All Permissions */
                    <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Login ID</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>User Name</th>
                                    <th style={{ padding: '15px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Role</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Menus Assigned</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Modules Assigned</th>
                                    <th style={{ padding: '15px', textAlign: 'center', color: '#64748b', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allUserPermissions.map((perm, idx) => {
                                    const user = allUsers.find(u => u.username === perm.userId);
                                    if (!user) return null;
                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? 'white' : '#fcfcfc' }}>
                                            <td style={{ padding: '15px', fontWeight: '600', color: '#5d5fef' }}>{perm.userId}</td>
                                            <td style={{ padding: '15px', fontWeight: '500' }}>{user.name}</td>
                                            <td style={{ padding: '15px', color: '#64748b' }}>{user.role}</td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <span style={{ padding: '4px 12px', background: '#dbeafe', color: '#1e40af', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                    {perm.menuIds.length} menus
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <span style={{ padding: '4px 12px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
                                                    {perm.moduleIds.length} modules
                                                </span>
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => {
                                                        handleUserSelect(user);
                                                        setViewMode('assign');
                                                    }}
                                                    style={{
                                                        padding: '6px 12px',
                                                        background: '#f1f5f9',
                                                        color: '#475569',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    <i className="fas fa-edit"></i> Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {allUserPermissions.length === 0 && (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                                <i className="fas fa-inbox" style={{ fontSize: '40px', marginBottom: '15px', color: '#e2e8f0' }}></i>
                                <p>No custom user permissions assigned yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Info Panel */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginTop: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '14px', fontWeight: '600' }}>
                        <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#5d5fef' }}></i>
                        How User-Level Permissions Work
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', fontSize: '13px', color: '#64748b' }}>
                        <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '8px', borderLeft: '3px solid #5d5fef' }}>
                            <strong style={{ color: '#1e40af' }}>Priority:</strong> User-specific permissions override role-based permissions
                        </div>
                        <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '8px', borderLeft: '3px solid #f59e0b' }}>
                            <strong style={{ color: '#92400e' }}>Flexibility:</strong> Assign any menu/module to any user regardless of role
                        </div>
                        <div style={{ padding: '12px', background: '#d1fae5', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                            <strong style={{ color: '#065f46' }}>Fallback:</strong> Users without custom permissions use their role defaults
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPermissionManager;
