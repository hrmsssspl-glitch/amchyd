import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Container,
  Alert
} from '@mui/material';
import { Module, MenuItem, UserRole, RolePermissions } from '../types';
import { modules, menuItems, defaultRolePermissions } from '../data/dashboardData';

interface RoleManagerProps {
  onPermissionsChange: (permissions: RolePermissions) => void;
  currentPermissions: RolePermissions;
}

const RoleManager: React.FC<RoleManagerProps> = ({ onPermissionsChange, currentPermissions }) => {
  const [permissions, setPermissions] = useState<RolePermissions>(currentPermissions);
  const [activeTab, setActiveTab] = useState<UserRole>('admin');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const roles: { id: UserRole; label: string; icon: string; color: string }[] = [
    { id: 'superadmin', label: 'Super Admin', icon: 'fa-crown', color: '#dc2626' },
    { id: 'admin', label: 'Admin', icon: 'fa-user-shield', color: '#f59e0b' },
    { id: 'hr_manager', label: 'HR Manager', icon: 'fa-users', color: '#3b82f6' },
    { id: 'employee', label: 'Employee', icon: 'fa-user', color: '#64748b' },
  ];

  const toggleModulePermission = (role: UserRole, moduleId: number) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      const currentModules = newPermissions[role]?.moduleIds || [];

      let newModuleIds;
      if (currentModules.includes(moduleId)) {
        newModuleIds = currentModules.filter(id => id !== moduleId);
      } else {
        newModuleIds = [...currentModules, moduleId];
      }

      newPermissions[role] = {
        ...newPermissions[role],
        moduleIds: newModuleIds
      };

      return newPermissions;
    });
  };

  const toggleMenuPermission = (role: UserRole, menuId: number) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      const currentMenus = newPermissions[role]?.menuIds || [];

      let newMenuIds;
      if (currentMenus.includes(menuId)) {
        newMenuIds = currentMenus.filter(id => id !== menuId);
      } else {
        newMenuIds = [...currentMenus, menuId];
      }

      newPermissions[role] = {
        ...newPermissions[role],
        menuIds: newMenuIds
      };

      return newPermissions;
    });
  };

  const resetToDefault = (role: UserRole) => {
    if (window.confirm(`Are you sure you want to reset ${role.toUpperCase()} permissions to default?`)) {
      setPermissions(prev => ({
        ...prev,
        [role]: defaultRolePermissions[role]
      }));
    }
  };

  const savePermissions = () => {
    // Save to localStorage
    localStorage.setItem('hrms_permissions', JSON.stringify(permissions));
    onPermissionsChange(permissions);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  // useEffect removed to prevent automatic reload loop via onPermissionsChange


  const activeRoleConfig = roles.find(r => r.id === activeTab);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 0, borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Box sx={{ p: 4, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="700" color="#1e293b" gutterBottom>
                Role-Based Access Control
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configure module and menu access levels for each user role
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<i className="fas fa-save" />}
                onClick={savePermissions}
                sx={{ borderRadius: 2, px: 4, py: 1.5, textTransform: 'none', fontWeight: 600 }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
          {saveStatus === 'success' && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Permissions saved successfully! Changes apply immediately.
            </Alert>
          )}
        </Box>

        <Grid container>
          {/* Sidebar */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ borderRight: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="overline" color="text.secondary" fontWeight="700" sx={{ px: 2 }}>
                Select Role
              </Typography>
              <List sx={{ mt: 1 }}>
                {roles.map((role) => (
                  <ListItemButton
                    key={role.id}
                    selected={activeTab === role.id}
                    onClick={() => setActiveTab(role.id)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&.Mui-selected': {
                        bgcolor: 'white',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0',
                        '&:hover': { bgcolor: 'white' }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: `${role.color}20`,
                          color: role.color,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className={`fas ${role.icon}`} style={{ fontSize: '14px' }}></i>
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={role.label}
                      primaryTypographyProps={{
                        fontWeight: activeTab === role.id ? 700 : 500,
                        color: activeTab === role.id ? '#1e293b' : '#64748b'
                      }}
                    />
                    {activeTab === role.id && (
                      <i className="fas fa-chevron-right" style={{ color: '#cbd5e1', fontSize: '12px' }}></i>
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Content Area */}
          <Grid size={{ xs: 12, md: 9 }} sx={{ bgcolor: 'white' }}>
            <Box sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: `${activeRoleConfig?.color}20`,
                      color: activeRoleConfig?.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}
                  >
                    <i className={`fas ${activeRoleConfig?.icon}`}></i>
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="700" color="#1e293b">
                      {activeRoleConfig?.label} Permissions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage what {activeRoleConfig?.label}s can satisfy
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<i className="fas fa-undo" />}
                  onClick={() => resetToDefault(activeTab)}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                  Reset to Default
                </Button>
              </Box>

              <Grid container spacing={4}>
                {/* Module Access */}
                <Grid size={12}>
                  <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className="fas fa-th-large" style={{ color: '#64748b', fontSize: '18px' }}></i>
                    Module Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Enable which main dashboard modules are visible
                  </Typography>

                  <Grid container spacing={2}>
                    {modules.map(module => {
                      const isChecked = permissions[activeTab]?.moduleIds?.includes(module.id) || false;
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.id}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              border: isChecked ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                              bgcolor: isChecked ? '#eff6ff' : 'white',
                              borderRadius: 3,
                              transition: 'all 0.2s',
                              cursor: 'pointer',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                              }
                            }}
                            onClick={() => toggleModulePermission(activeTab, module.id)}
                          >
                            <Box display="flex" justifyContent="space-between" alignItems="start">
                              <Box display="flex" gap={2} alignItems="center">
                                <Box
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    bgcolor: isChecked ? 'white' : '#f1f5f9',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: isChecked ? '#3b82f6' : '#64748b'
                                  }}
                                >
                                  <i className={`fas ${module.icon}`}></i>
                                </Box>
                                <Typography fontWeight={isChecked ? 700 : 500} color={isChecked ? '#1e293b' : '#64748b'}>
                                  {module.title}
                                </Typography>
                              </Box>
                              <Switch
                                checked={isChecked}
                                size="small"
                                inputProps={{ 'aria-label': module.title }}
                              />
                            </Box>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>

                <Grid size={12}><Divider /></Grid>

                {/* Menu Access */}
                <Grid size={12}>
                  <Typography variant="h6" fontWeight="600" color="#1e293b" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className="fas fa-bars" style={{ color: '#64748b', fontSize: '18px' }}></i>
                    Sidebar Menu Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Control sidebar navigation links
                  </Typography>

                  <Grid container spacing={2}>
                    {menuItems.slice(1).map(menu => {
                      const isChecked = permissions[activeTab]?.menuIds?.includes(menu.id) || false;
                      return (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={menu.id}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={isChecked}
                                onChange={() => toggleMenuPermission(activeTab, menu.id)}
                              />
                            }
                            label={
                              <Box display="flex" alignItems="center" gap={1.5}>
                                <i className={`fas ${menu.icon}`} style={{ width: 20, textAlign: 'center', color: '#64748b' }}></i>
                                <Typography variant="body2" fontWeight={500}>{menu.name}</Typography>
                              </Box>
                            }
                            sx={{
                              width: '100%',
                              m: 0,
                              p: 1.5,
                              border: '1px solid #e2e8f0',
                              borderRadius: 2,
                              bgcolor: isChecked ? '#f8fafc' : 'white',
                              '&:hover': { bgcolor: '#f8fafc' }
                            }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default RoleManager;