import React, { useState } from 'react';
import { User } from '../types';
import { getUserDetails } from '../auth/authService';
import UserManagement from './UserManagement';
import UserPermissionManager from '../components/UserPermissionManager';
import PermissionTemplateManager from '../components/PermissionTemplateManager';

const UserManagementWrapper: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'templates'>('users');
    const currentUser = getUserDetails();

    if (!currentUser) {
        return <div>Please log in</div>;
    }

    // Mock users list - in real app, this would come from a database
    const allUsers: User[] = [
        { username: 'superadmin', role: 'superadmin', name: 'Master Super Admin' },
        { username: 'admin', role: 'admin', name: 'Main Admin' },
        { username: 'hr.manager', role: 'hr_manager', name: 'HR Operations Manager' },
        { username: 'EMP001', role: 'employee', name: 'Rajesh Kumar', employeeId: 'EMP001', state: 'Andhra Pradesh', branch: 'Vijayawada (Head Office)' },
        { username: 'EMP002', role: 'employee', name: 'Priya Sharma', employeeId: 'EMP002', state: 'Telangana', branch: 'Hyderabad' },
        { username: 'EMP003', role: 'employee', name: 'Amit Patel', employeeId: 'EMP003', state: 'Andhra Pradesh', branch: 'Visakhapatnam' },
        { username: 'EMP004', role: 'employee', name: 'Suresh Reddy', employeeId: 'EMP004', state: 'Andhra Pradesh', branch: 'Vijayawada (Head Office)' },
        { username: 'EMP005', role: 'employee', name: 'Lakshmi Devi', employeeId: 'EMP005', state: 'Telangana', branch: 'Hyderabad' },
    ];

    return (
        <div style={{ padding: '0', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Tab Navigation */}
            <div style={{ background: 'white', borderBottom: '2px solid #e2e8f0', padding: '0 30px' }}>
                <div style={{ maxWidth: 'none', margin: '0', display: 'flex', gap: '5px' }}>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            padding: '18px 30px',
                            background: 'transparent',
                            color: activeTab === 'users' ? '#5d5fef' : '#64748b',
                            border: 'none',
                            borderBottom: activeTab === 'users' ? '3px solid #5d5fef' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <i className="fas fa-users-cog"></i>
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveTab('permissions')}
                        style={{
                            padding: '18px 30px',
                            background: 'transparent',
                            color: activeTab === 'permissions' ? '#5d5fef' : '#64748b',
                            border: 'none',
                            borderBottom: activeTab === 'permissions' ? '3px solid #5d5fef' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <i className="fas fa-user-lock"></i>
                        User-Level Permissions
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        style={{
                            padding: '18px 30px',
                            background: 'transparent',
                            color: activeTab === 'templates' ? '#5d5fef' : '#64748b',
                            border: 'none',
                            borderBottom: activeTab === 'templates' ? '3px solid #5d5fef' : '3px solid transparent',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <i className="fas fa-layer-group"></i>
                        Permission Templates
                        <span style={{
                            padding: '2px 8px',
                            background: '#10b981',
                            color: 'white',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: '700'
                        }}>
                            BULK
                        </span>
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div style={{ padding: '30px' }}>
                {activeTab === 'users' ? (
                    <UserManagement currentUser={currentUser} />
                ) : activeTab === 'permissions' ? (
                    <UserPermissionManager currentUser={currentUser} allUsers={allUsers} />
                ) : (
                    <PermissionTemplateManager currentUser={currentUser} allUsers={allUsers} />
                )}
            </div>
        </div>
    );
};

export default UserManagementWrapper;
