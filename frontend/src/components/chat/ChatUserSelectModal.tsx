import React, { useState } from 'react';
import { User, UserRole } from '../../types';

interface ChatUserSelectModalProps {
    users: User[];
    currentUser: User;
    onSelectUser: (user: User) => void;
    onClose: () => void;
}

const ChatUserSelectModal: React.FC<ChatUserSelectModalProps> = ({ users, currentUser, onSelectUser, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

    const filteredUsers = users.filter(user => {
        if (user.username === currentUser.username) return false; // Don't show self
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.employeeId && user.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesRole && matchesSearch;
    });

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'superadmin': return '#dc2626';
            case 'admin': return '#f59e0b';
            case 'hr_manager': return '#3b82f6';
            case 'employee': return '#6b7280';
            default: return '#cbd5e1';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                width: '500px',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>
                        <i className="fas fa-comments" style={{ marginRight: '10px', color: '#5d5fef' }}></i>
                        Start New Chat
                    </h3>
                    <button
                        onClick={onClose}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Filters */}
                <div style={{ padding: '20px', backgroundColor: '#f8fafc' }}>
                    <input
                        type="text"
                        placeholder="Search by name, ID or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            marginBottom: '10px',
                            fontSize: '14px'
                        }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {['all', 'superadmin', 'admin', 'hr_manager', 'employee'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role as any)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid',
                                    borderColor: filterRole === role ? '#5d5fef' : '#e2e8f0',
                                    backgroundColor: filterRole === role ? '#5d5fef' : 'white',
                                    color: filterRole === role ? 'white' : '#64748b',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {role === 'hr_manager' ? 'HR Manager' : role}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                    {filteredUsers.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            No users found matching your search.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {filteredUsers.map(user => (
                                <div
                                    key={user.username}
                                    onClick={() => onSelectUser(user)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        backgroundColor: 'white',
                                        border: '1px solid #f1f5f9',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        gap: '12px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#f8fafc';
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.borderColor = '#f1f5f9';
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: `${getRoleColor(user.role)}20`,
                                        color: getRoleColor(user.role),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{user.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                backgroundColor: `${getRoleColor(user.role)}10`,
                                                color: getRoleColor(user.role),
                                                fontSize: '10px',
                                                fontWeight: '600'
                                            }}>
                                                {user.role}
                                            </span>
                                            <span>•</span>
                                            <span>{user.username}</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#cbd5e1'
                                    }}>
                                        <i className="fas fa-chevron-right"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatUserSelectModal;
