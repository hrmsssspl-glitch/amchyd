import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Key, Clock, ChevronDown, X } from 'lucide-react';
import axios from 'axios';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showDropdown, setShowDropdown] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/auth/change-password', {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            }, config);
            alert('Password changed successfully');
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Error changing password');
        }
    };

    return (
        <header className="header sticky-header">
            <div className="header-container flex justify-between items-center text-white">
                <div className="flex items-center gap-6">
                    <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>SSSP AMC MANAGEMENT</h1>
                    <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', padding: '4px 12px', borderRadius: '20px' }}>
                        <Clock size={14} />
                        <span>{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {user && (
                        <div className="profile-dropdown-container">
                            <button
                                className="profile-trigger"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="avatar">{user.employeeName.charAt(0)}</div>
                                <div className="user-info-text text-left">
                                    <span className="name">{user.employeeName}</span>
                                    <span className="role">{user.role}</span>
                                </div>
                                <ChevronDown size={16} />
                            </button>

                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <div className="dropdown-header">
                                        <strong>User Details</strong>
                                        <div className="detail-row"><small>Emp ID:</small> <span>{user.employeeId}</span></div>
                                        <div className="detail-row"><small>Role:</small> <span>{user.role}</span></div>
                                    </div>
                                    <button onClick={() => { setShowPasswordModal(true); setShowDropdown(false); }}>
                                        <Key size={16} /> Change Password
                                    </button>
                                    <button onClick={handleLogout} className="text-red">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 style={{ margin: 0 }}>Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleChangePassword}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

