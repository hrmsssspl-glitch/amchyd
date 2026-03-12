// RBACConfigPage.tsx
import { useState } from 'react';
import './RBACConfigPage.css';

// Define types
type Role = 'ADMIN' | 'HR' | 'MANAGER' | 'EMPLOYEE';
type Module = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type RolePermissions = {
  [key in Role]: {
    canReset: boolean;
    moduleAccess: {
      [moduleId: string]: boolean;
    };
  };
};

// Module data
const modules: Module[] = [
  { id: 'user_management', name: 'User Management', description: 'Manage user accounts and access rights', category: 'Core' },
  { id: 'organization_master', name: 'Organization Master', description: 'Configure organizational structure', category: 'Configuration' },
  { id: 'employee_master', name: 'Employee Master', description: 'Manage employee records and data', category: 'Employee Data' },
  { id: 'payroll_compensation', name: 'Payroll & Compensation', description: 'Process payroll and manage compensation', category: 'Finance' },
  { id: 'attendance_management', name: 'Attendance Management', description: 'Track and manage employee attendance', category: 'Operations' },
  { id: 'leave_management', name: 'Leave Management', description: 'Handle leave requests and approvals', category: 'Operations' },
  { id: 'disciplinary_management', name: 'Disciplinary Management', description: 'Manage disciplinary actions and records', category: 'HR' },
  { id: 'grievance_management', name: 'Grievance Management', description: 'Process employee grievances', category: 'HR' },
  { id: 'separation_exit', name: 'Separation - Exit Management', description: 'Manage employee separations and exits', category: 'HR' },
  { id: 'hr_compliance', name: 'HR Compliance & Statutory Reports', description: 'Generate compliance reports and documentation', category: 'Compliance' },
];

// Role descriptions
const roleDescriptions: Record<Role, string> = {
  ADMIN: 'Full system access with administrative privileges',
  HR: 'Human resources management and employee data access',
  MANAGER: 'Team management and operational oversight',
  EMPLOYEE: 'Basic employee access to personal data and requests'
};

// Initial permissions state
const initialPermissions: RolePermissions = {
  ADMIN: {
    canReset: true,
    moduleAccess: {
      user_management: true,
      organization_master: true,
      employee_master: true,
      payroll_compensation: true,
      attendance_management: true,
      leave_management: true,
      disciplinary_management: true,
      grievance_management: true,
      separation_exit: true,
      hr_compliance: true,
    }
  },
  HR: {
    canReset: false,
    moduleAccess: {
      user_management: false,
      organization_master: false,
      employee_master: true,
      payroll_compensation: true,
      attendance_management: true,
      leave_management: true,
      disciplinary_management: true,
      grievance_management: true,
      separation_exit: true,
      hr_compliance: true,
    }
  },
  MANAGER: {
    canReset: false,
    moduleAccess: {
      user_management: false,
      organization_master: false,
      employee_master: false,
      payroll_compensation: false,
      attendance_management: true,
      leave_management: true,
      disciplinary_management: true,
      grievance_management: false,
      separation_exit: false,
      hr_compliance: false,
    }
  },
  EMPLOYEE: {
    canReset: false,
    moduleAccess: {
      user_management: false,
      organization_master: false,
      employee_master: false,
      payroll_compensation: false,
      attendance_management: false,
      leave_management: true,
      disciplinary_management: false,
      grievance_management: false,
      separation_exit: false,
      hr_compliance: false,
    }
  }
};

const RBACConfigPage = () => {
  const [permissions, setPermissions] = useState<RolePermissions>(initialPermissions);
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filter modules based on search and category
  const filteredModules = modules.filter(module => {
    const matchesSearch = !searchTerm || 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(modules.map(m => m.category)))];

  // Handle module permission toggle
  const handleModuleToggle = (moduleId: string) => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        moduleAccess: {
          ...prev[selectedRole].moduleAccess,
          [moduleId]: !prev[selectedRole].moduleAccess[moduleId]
        }
      }
    }));
  };

  // Handle reset toggle
  const handleResetToggle = () => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        canReset: !prev[selectedRole].canReset
      }
    }));
  };

  // Handle bulk select all/none for current role
  const handleBulkSelect = (selectAll: boolean) => {
    const updatedModuleAccess: Record<string, boolean> = {};
    modules.forEach(module => {
      updatedModuleAccess[module.id] = selectAll;
    });

    setPermissions(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        moduleAccess: updatedModuleAccess
      }
    }));
  };

  // Reset role to default
  const handleResetToDefault = () => {
    setPermissions(prev => ({
      ...prev,
      [selectedRole]: initialPermissions[selectedRole]
    }));
    setShowResetConfirm(false);
  };

  // Save permissions
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Saved permissions:', permissions);
      setIsSaving(false);
      alert(`Permissions for ${selectedRole} saved successfully!`);
    }, 1000);
  };

  // Save all permissions
  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      console.log('All permissions saved:', permissions);
      setIsSaving(false);
      alert('All role permissions saved successfully!');
    }, 1500);
  };

  // Calculate permission stats
  const getPermissionStats = (role: Role) => {
    const rolePerms = permissions[role].moduleAccess;
    const totalModules = modules.length;
    const enabledModules = Object.values(rolePerms).filter(Boolean).length;
    return { totalModules, enabledModules };
  };

  const stats = getPermissionStats(selectedRole);

  return (
    <div className="rbac-container">
      {/* Header */}
      <header className="rbac-header">
        <div className="header-left">
          <h1>🔐 Role-Based Access Control</h1>
          <p className="header-subtitle">Configure module permissions for different user roles</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowResetConfirm(true)}
            disabled={isSaving}
          >
            Reset Selected Role
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Current Role'}
          </button>
          <button 
            className="btn btn-success"
            onClick={handleSaveAll}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save All Roles'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="rbac-content">
        {/* Left Sidebar - Role Selection */}
        <div className="role-sidebar">
          <h3 className="sidebar-title">User Roles</h3>
          <p className="sidebar-subtitle">Select a role to configure permissions</p>
          
          <div className="role-list">
            {(Object.keys(initialPermissions) as Role[]).map(role => {
              const roleStats = getPermissionStats(role);
              return (
                <button
                  key={role}
                  className={`role-item ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className="role-item-header">
                    <span className="role-name">{role}</span>
                    <span className={`role-badge role-${role.toLowerCase()}`}>
                      {role}
                    </span>
                  </div>
                  <p className="role-description">{roleDescriptions[role]}</p>
                  <div className="role-stats">
                    <span className="stat">
                      <strong>{roleStats.enabledModules}</strong> of {roleStats.totalModules} modules
                    </span>
                    <span className="stat-percent">
                      {Math.round((roleStats.enabledModules / roleStats.totalModules) * 100)}% access
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel - Permissions Configuration */}
        <div className="permissions-panel">
          {/* Role Header */}
          <div className="role-header">
            <div className="role-title">
              <h2>Permissions for <span className="role-highlight">{selectedRole}</span></h2>
              <p className="role-description-text">{roleDescriptions[selectedRole]}</p>
            </div>
            <div className="role-actions">
              <div className="bulk-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => handleBulkSelect(true)}
                >
                  Select All
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => handleBulkSelect(false)}
                >
                  Select None
                </button>
              </div>
              <div className="permission-stats">
                <div className="stat-card">
                  <span className="stat-number">{stats.enabledModules}</span>
                  <span className="stat-label">Modules Enabled</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{stats.totalModules - stats.enabledModules}</span>
                  <span className="stat-label">Modules Restricted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Permission */}
          <div className="special-permission-card">
            <div className="permission-info">
              <h4>Reset to Default</h4>
              <p className="permission-description">
                Allow users with this role to reset system configurations to default values
              </p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={permissions[selectedRole].canReset}
                onChange={handleResetToggle}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Module Access Section */}
          <div className="module-access-section">
            <div className="section-header">
              <h3>Module Access Control</h3>
              <p>Select which modules users with the {selectedRole} role can access</p>
            </div>

            {/* Filters */}
            <div className="module-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="🔍 Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </button>
                )}
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Modules Grid */}
            <div className="modules-grid">
              {filteredModules.map(module => (
                <div 
                  key={module.id} 
                  className={`module-card ${permissions[selectedRole].moduleAccess[module.id] ? 'enabled' : 'disabled'}`}
                >
                  <div className="module-card-header">
                    <div className="module-icon">
                      {getModuleIcon(module.category)}
                    </div>
                    <div className="module-info">
                      <h4>{module.name}</h4>
                      <span className="module-category">{module.category}</span>
                    </div>
                    <label className="module-toggle">
                      <input
                        type="checkbox"
                        checked={permissions[selectedRole].moduleAccess[module.id]}
                        onChange={() => handleModuleToggle(module.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <p className="module-description">{module.description}</p>
                  <div className="module-status">
                    <span className={`status-indicator ${permissions[selectedRole].moduleAccess[module.id] ? 'enabled' : 'disabled'}`}>
                      {permissions[selectedRole].moduleAccess[module.id] ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredModules.length === 0 && (
              <div className="no-modules">
                <p>No modules found matching your search criteria.</p>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="permissions-summary">
            <h4>Configuration Summary</h4>
            <div className="summary-content">
              <p>
                The <strong>{selectedRole}</strong> role currently has access to{' '}
                <strong>{stats.enabledModules}</strong> out of <strong>{stats.totalModules}</strong> modules.
              </p>
              <div className="summary-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowResetConfirm(true)}
                >
                  Reset to Default
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner"></span>
                      Saving...
                    </>
                  ) : 'Save Configuration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Reset Permissions</h3>
              <button 
                className="modal-close"
                onClick={() => setShowResetConfirm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">⚠️</div>
              <p>
                Are you sure you want to reset permissions for the{' '}
                <strong>{selectedRole}</strong> role to default settings?
              </p>
              <p className="warning-text">
                This action cannot be undone. All custom permissions will be lost.
              </p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleResetToDefault}
              >
                Reset Permissions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="rbac-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>🛡️ <strong>Security Note:</strong> Permission changes take effect immediately</p>
            <p className="footer-hint">
              Configure access carefully to maintain data security and privacy compliance
            </p>
          </div>
          <div className="footer-right">
            <p>Last Saved: {new Date().toLocaleDateString()}</p>
            <p>Config Version: 2.1.4</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper function for module icons
const getModuleIcon = (category: string) => {
  const icons: Record<string, string> = {
    'Core': '👤',
    'Configuration': '⚙️',
    'Employee Data': '📊',
    'Finance': '💰',
    'Operations': '🏢',
    'HR': '🤝',
    'Compliance': '📋'
  };
  return icons[category] || '📁';
};

export default RBACConfigPage;