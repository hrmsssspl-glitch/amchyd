import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    User, 
    LogOut, 
    Settings, 
    Bell, 
    HelpCircle, 
    Moon, 
    Clock, 
    X,
    CheckCircle,
    AlertCircle,
    Info
} from 'lucide-react';
import axios from 'axios';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const isLoginPage = location.pathname === '/' || location.pathname === '/login';
    const showSearchAndProfile = user && !isLoginPage;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        const handleClickOutside = (event) => {
            if (showProfileDropdown && !event.target.closest('.profile-dropdown-trigger')) {
                setShowProfileDropdown(false);
            }
            if (showNotifDropdown && !event.target.closest('.notif-dropdown-trigger')) {
                setShowNotifDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            clearInterval(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown, showNotifDropdown]);

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

    const notifications = [
        {
            id: 1,
            title: "AMC Visit Overdue",
            desc: "Asset ASSET-204 visit scheduled for yesterday is still pending.",
            time: "10m ago",
            icon: <AlertCircle size={16} className="text-red-500" />,
            bg: "rgba(239, 68, 68, 0.1)",
            unread: true
        },
        {
            id: 2,
            title: "Contract Expiring",
            desc: "5 Assets have contracts expiring this month. Please review renewals.",
            time: "1h ago",
            icon: <Clock size={16} className="text-orange-500" />,
            bg: "rgba(249, 115, 22, 0.1)",
            unread: true
        },
        {
            id: 3,
            title: "New Followup Remark",
            desc: "Rajeev Sinha added a remark: 'Customer requested PO copy' for Asset ASSET-112.",
            time: "3h ago",
            icon: <Info size={16} className="text-purple-500" />,
            bg: "rgba(124, 77, 255, 0.1)",
            unread: false
        }
    ];

    return (
        <header className="header">
            <div className="header-container flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                        SSSPL <span style={{ color: '#7c4dff' }}>AMC</span>
                    </h1>
                    <div className="flex items-center gap-2" style={{ color: '#64748b', fontSize: '0.85rem', background: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', fontWeight: 500 }}>
                        <Clock size={14} />
                        <span>{currentTime.toLocaleDateString()} | {currentTime.toLocaleTimeString()}</span>
                    </div>
                </div>

                {showSearchAndProfile && (
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                            <Moon size={20} />
                        </button>

                        <div className="relative notif-dropdown-trigger">
                            <button 
                                className={`p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors relative ${showNotifDropdown ? 'bg-slate-50' : ''}`}
                                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                            >
                                <Bell size={20} />
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">2</span>
                            </button>

                            {showNotifDropdown && (
                                <div className="dropdown-menu-refined notif-dropdown">
                                    <div className="notif-header">
                                        <h4>Notifications</h4>
                                        <span className="mark-read">Mark all read</span>
                                    </div>
                                    <div className="notif-list">
                                        {notifications.map(notif => (
                                            <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                                                <div className="notif-icon-circle" style={{ background: notif.bg }}>
                                                    {notif.icon}
                                                </div>
                                                <div className="notif-content">
                                                    <div className="notif-title">{notif.title}</div>
                                                    <div className="notif-desc">{notif.desc}</div>
                                                    <div className="notif-time">{notif.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="view-all-notif">View all notifications</div>
                                </div>
                            )}
                        </div>

                        <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                            <HelpCircle size={20} />
                        </button>

                        <div className="relative profile-dropdown-trigger ml-2">
                            <button
                                className={`flex items-center gap-2 p-1 pr-3 hover:bg-slate-50 rounded-full transition-colors ${showProfileDropdown ? 'bg-slate-50' : ''}`}
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            >
                                <div className="avatar" style={{ background: '#7c4dff', color: 'white', width: '36px', height: '36px', fontSize: '0.9rem' }}>
                                    {user.employeeName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                </div>
                            </button>

                            {showProfileDropdown && (
                                <div className="dropdown-menu-refined">
                                    <div className="dropdown-user-header">
                                        <div className="user-name-text">{user.employeeName}</div>
                                        <div className="user-email-text">{user.email || 'chairman@ssspl.in'}</div>
                                        <div className="user-role-badge">{user.role}</div>
                                    </div>
                                    <div className="dropdown-items-list">
                                        <button className="dropdown-item-btn" onClick={() => setShowProfileDropdown(false)}>
                                            <User size={18} /> My Profile
                                        </button>
                                        <button className="dropdown-item-btn" onClick={() => { setShowPasswordModal(true); setShowProfileDropdown(false); }}>
                                            <Settings size={18} /> Settings
                                        </button>
                                        <button onClick={handleLogout} className="dropdown-item-btn signout">
                                            <LogOut size={18} /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showPasswordModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '400px' }}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 style={{ margin: 0, color: '#0f172a' }}>Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={20} /></button>
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
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" className="btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ background: '#7c4dff', boxShadow: 'none' }}>Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;

