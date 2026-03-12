import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItem, UserRole, RolePermissions } from '../types';

interface SidebarProps {
  menuItems: MenuItem[];
  userRole: UserRole;
  permissions: RolePermissions;
  userName: string;
  userInitials: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  userRole,
  permissions,
  userName,
  userInitials
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'superadmin': return '#ff0000'; // Red
      case 'admin': return '#ffd700'; // Gold
      case 'hr_manager': return '#2196f3'; // Blue
      case 'employee': return '#9e9e9e'; // Gray
      default: return '#9e9e9e'; // Gray
    }
  };

  const isItemActive = (path: string) => {
    return location.pathname === path;
  };

  // Map menu item names to paths if path is not provided in data
  const getPath = (name: string) => {
    switch (name) {
      case 'Dashboard': return '/dashboard';
      case 'User Management': return '/users';
      case 'Organization Master': return '/organization';
      case 'Employee Master': return '/employees';
      case 'Payroll & Compensation': return '/payroll';
      case 'Attendance Management': return '/attendance';
      case 'Leave Management': return '/leave';
      case 'Recruitment & Onboarding': return '/recruitment';
      case 'Performance Management': return '/performance';
      case 'Training & Development': return '/training';
      case 'Assets Management': return '/assets';
      case 'Travel & Expense': return '/travel';
      case 'Disciplinary Management': return '/disciplinary';
      case 'Grievance Management': return '/grievance';
      case 'Separation - Exit Management': return '/exit';
      case 'HR Compliance & Statutory Reports': return '/compliance';
      case 'HR Reports & Dashboards': return '/reports';
      case 'Event Management': return '/events';
      case 'Tender Menu': return '/tender';
      default: return '/';
    }
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-users-cog"></i>
          </div>
          <h1>SSSPL-HRMS</h1>
        </div>
        <div className="sidebar-toggle">
          <i className="fas fa-bars"></i>
        </div>
      </div>

      {/* Menu Section */}
      <div className="menu-section">
        <div className="menu-title">
          <i className="fas fa-th-large"></i>
          <span>MENU</span>
        </div>

        <div className="menu-items" style={{ paddingBottom: '50px', overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
          {menuItems.map((item) => {
            const path = getPath(item.name);
            const active = isItemActive(path);
            return (
              <div
                key={item.id}
                className={`menu-item ${active ? 'active' : ''}`}
                onClick={() => navigate(path)}
              >
                <div className="menu-item-left">
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </div>
                {item.name === 'Recruitment & Onboarding' && (
                  <span className="menu-badge">+</span>
                )}
              </div>
            );
          })}
        </div>
      </div>



    </div>

  );
};

export default Sidebar;
