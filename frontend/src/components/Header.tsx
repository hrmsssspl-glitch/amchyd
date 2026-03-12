import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onLogout: () => void;
  onToggleRoleManager?: () => void;
  isSuperAdmin: boolean;
  showRoleManager?: boolean;
  title?: string;
  userName: string;
  userRole: string;
  userInitials: string;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  onToggleRoleManager,
  isSuperAdmin,
  showRoleManager,
  title = "HRMS Dashboard",
  userName,
  userRole,
  userInitials
}) => {
  const [time, setTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Click outside handler to close the profile menu
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="page-title">
          <h1>{title}</h1>
          <p className="welcome-text">Welcome back! Here's what's happening today.</p>
        </div>
      </div>

      <div className="header-right">
        <div className="datetime-info">
          <div className="time">{formatTime(time)}</div>
          <div className="date">{formatDate(time)}</div>
        </div>

        <div className="header-actions">
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-count">3</span>
          </button>

          <button className="search-btn">
            <i className="fas fa-search"></i>
          </button>

          {/* Manage Roles Button - Separate as requested */}
          {isSuperAdmin && onToggleRoleManager && (
            <button
              className={`role-manager-toggle ${showRoleManager ? 'active' : ''}`}
              onClick={onToggleRoleManager}
              title="Toggle Role Manager Interface"
            >
              <i className="fas fa-user-shield"></i>
              <span>{showRoleManager ? 'Hide Roles' : 'Manage Roles'}</span>
            </button>
          )}

          {/* Profile Dropdown Section */}
          <div className="profile-wrapper" ref={profileRef}>
            <button
              className={`profile-trigger ${showProfileMenu ? 'active' : ''}`}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="header-avatar">{userInitials}</div>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="pd-header">
                  <div className="pd-email">{userName}</div>
                  <div className="pd-avatar-large">{userInitials}</div>
                  <div className="pd-greeting">Hi, {userName.split(' ')[0]}!</div>
                  <div className="pd-role-badge">{userRole}</div>
                </div>

                <div className="pd-actions">
                  <button className="pd-logout-btn" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Sign out</span>
                  </button>
                </div>

                <div className="pd-footer">
                  <a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;