import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { PermissionTemplate, BulkAssignmentCriteria } from '../types/permissions';
import { menuItems, modules } from '../data/dashboardData';
import {
    getPermissionTemplates,
    savePermissionTemplate,
    deletePermissionTemplate,
    bulkAssignPermissions,
    createDefaultTemplates
} from '../utils/templateService';

interface PermissionTemplateManagerProps {
    currentUser: User;
    allUsers: User[];
}

const PermissionTemplateManager: React.FC<PermissionTemplateManagerProps> = ({ currentUser, allUsers }) => {
    const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<PermissionTemplate | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'bulk'>('list');
    const [newTemplate, setNewTemplate] = useState<Partial<PermissionTemplate>>({
        name: '',
        description: '',
        menuIds: [],
        moduleIds: []
    });

    // Bulk assignment state
    const [bulkCriteria, setBulkCriteria] = useState<Partial<BulkAssignmentCriteria>>({
        templateId: '',
        assignmentType: 'branch'
    });
    const [bulkResult, setBulkResult] = useState<string>('');
    const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);

    useEffect(() => {
        createDefaultTemplates(currentUser.username);
        loadTemplates();
    }, [currentUser.username]);

    const loadTemplates = () => {
        setTemplates(getPermissionTemplates());
    };

    const handleSaveTemplate = () => {
        if (!newTemplate.name || !newTemplate.description) {
            alert('Please fill in template name and description');
            return;
        }

        const template: PermissionTemplate = {
            id: selectedTemplate ? selectedTemplate.id : `template_${Date.now()}`,
            name: newTemplate.name!,
            description: newTemplate.description!,
            menuIds: newTemplate.menuIds || [],
            moduleIds: newTemplate.moduleIds || [],
            createdBy: selectedTemplate ? selectedTemplate.createdBy : currentUser.username,
            createdDate: selectedTemplate ? selectedTemplate.createdDate : new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        savePermissionTemplate(template);
        loadTemplates();
        setViewMode('list');
        setNewTemplate({ name: '', description: '', menuIds: [], moduleIds: [] });
        setSelectedTemplate(null);
    };

    const handleEditTemplate = (template: PermissionTemplate) => {
        setSelectedTemplate(template);
        setNewTemplate({
            name: template.name,
            description: template.description,
            menuIds: template.menuIds,
            moduleIds: template.moduleIds
        });
        setViewMode('create');
    };

    const handleDeleteTemplate = (templateId: string) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            deletePermissionTemplate(templateId);
            loadTemplates();
        }
    };

    const toggleMenu = (menuId: number) => {
        const current = newTemplate.menuIds || [];
        setNewTemplate({
            ...newTemplate,
            menuIds: current.includes(menuId)
                ? current.filter(id => id !== menuId)
                : [...current, menuId]
        });
    };

    const toggleModule = (moduleId: number) => {
        const current = newTemplate.moduleIds || [];
        setNewTemplate({
            ...newTemplate,
            moduleIds: current.includes(moduleId)
                ? current.filter(id => id !== moduleId)
                : [...current, moduleId]
        });
    };

    const handleBulkAssign = () => {
        if (!bulkCriteria.templateId) {
            alert('Please select a template');
            return;
        }

        if (bulkCriteria.assignmentType === 'employeeIds' && selectedEmployeeIds.length === 0) {
            alert('Please select at least one employee');
            return;
        }

        const criteria: BulkAssignmentCriteria = {
            templateId: bulkCriteria.templateId!,
            assignmentType: bulkCriteria.assignmentType!,
            department: bulkCriteria.department,
            designation: bulkCriteria.designation,
            branch: bulkCriteria.branch,
            state: bulkCriteria.state,
            employeeIds: bulkCriteria.assignmentType === 'employeeIds' ? selectedEmployeeIds : undefined
        };

        const result = bulkAssignPermissions(criteria, allUsers);
        setBulkResult(`✅ ${result.message}\n\nAssigned to ${result.assignedCount} employee(s):\n${result.assignedEmployees.join(', ')}`);

        // Clear selection after successful assignment
        if (result.success) {
            setSelectedEmployeeIds([]);
        }
    };

    const employees = allUsers.filter(u => u.role === 'employee');
    const states = Array.from(new Set(employees.map(e => e.state).filter(Boolean)));
    const branches = Array.from(new Set(employees.map(e => e.branch).filter(Boolean)));

    const toggleEmployeeSelection = (employeeId: string) => {
        setSelectedEmployeeIds(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    const selectAllEmployees = () => {
        setSelectedEmployeeIds(employees.map(e => e.username));
    };

    const clearEmployeeSelection = () => {
        setSelectedEmployeeIds([]);
    };

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: 'none', margin: '0' }}>
                {/* Header */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px', fontWeight: '700' }}>
                                <i className="fas fa-layer-group" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                Permission Templates & Bulk Assignment
                            </h2>
                            <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                                Create templates and assign permissions to multiple employees at once
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{
                                    padding: '10px 20px',
                                    background: viewMode === 'list' ? '#5d5fef' : '#f1f5f9',
                                    color: viewMode === 'list' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-list" style={{ marginRight: '8px' }}></i>
                                Templates
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedTemplate(null);
                                    setNewTemplate({ name: '', description: '', menuIds: [], moduleIds: [] });
                                    setViewMode('create');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    background: viewMode === 'create' ? '#5d5fef' : '#f1f5f9',
                                    color: viewMode === 'create' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                                Create Template
                            </button>
                            <button
                                onClick={() => setViewMode('bulk')}
                                style={{
                                    padding: '10px 20px',
                                    background: viewMode === 'bulk' ? '#5d5fef' : '#f1f5f9',
                                    color: viewMode === 'bulk' ? 'white' : '#64748b',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}
                            >
                                <i className="fas fa-users-cog" style={{ marginRight: '8px' }}></i>
                                Bulk Assign
                            </button>
                        </div>
                    </div>
                </div>

                {/* Template List */}
                {viewMode === 'list' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {templates.map(template => (
                            <div key={template.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', marginBottom: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                                            {template.name}
                                        </h3>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>{template.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEditTemplate(template)}
                                        style={{
                                            padding: '6px 10px',
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '12px',
                                            marginRight: '8px'
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteTemplate(template.id)}
                                        style={{
                                            padding: '6px 10px',
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                    <div style={{ padding: '8px 12px', background: '#dbeafe', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#1e40af' }}>
                                        <i className="fas fa-bars" style={{ marginRight: '6px' }}></i>
                                        {template.menuIds.length} Menus
                                    </div>
                                    <div style={{ padding: '8px 12px', background: '#d1fae5', borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#065f46' }}>
                                        <i className="fas fa-th-large" style={{ marginRight: '6px' }}></i>
                                        {template.moduleIds.length} Modules
                                    </div>
                                </div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '10px' }}>
                                    Created by: {template.createdBy}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Template */}
                {viewMode === 'create' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>
                            {selectedTemplate ? 'Edit Permission Template' : 'Create New Permission Template'}
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '25px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Template Name *
                                </label>
                                <input
                                    type="text"
                                    value={newTemplate.name}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                                    placeholder="e.g., Payroll Officer"
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Description *
                                </label>
                                <input
                                    type="text"
                                    value={newTemplate.description}
                                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                                    placeholder="Brief description of this template"
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                Select Menus ({newTemplate.menuIds?.length || 0} selected)
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {menuItems.map(menu => (
                                    <div
                                        key={menu.id}
                                        onClick={() => toggleMenu(menu.id)}
                                        style={{
                                            padding: '12px',
                                            background: newTemplate.menuIds?.includes(menu.id) ? '#eff6ff' : '#f8fafc',
                                            border: newTemplate.menuIds?.includes(menu.id) ? '2px solid #5d5fef' : '1px solid #e2e8f0',
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
                                            background: newTemplate.menuIds?.includes(menu.id) ? '#5d5fef' : '#e2e8f0',
                                            color: newTemplate.menuIds?.includes(menu.id) ? 'white' : '#64748b',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px'
                                        }}>
                                            <i className={`fas ${menu.icon}`}></i>
                                        </div>
                                        <div style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{menu.name}</div>
                                        {newTemplate.menuIds?.includes(menu.id) && (
                                            <i className="fas fa-check-circle" style={{ color: '#5d5fef', fontSize: '16px' }}></i>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                Select Modules ({newTemplate.moduleIds?.length || 0} selected)
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                {modules.map(module => (
                                    <div
                                        key={module.id}
                                        onClick={() => toggleModule(module.id)}
                                        style={{
                                            padding: '12px',
                                            background: newTemplate.moduleIds?.includes(module.id) ? '#eff6ff' : '#f8fafc',
                                            border: newTemplate.moduleIds?.includes(module.id) ? '2px solid #5d5fef' : '1px solid #e2e8f0',
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
                                            background: newTemplate.moduleIds?.includes(module.id) ? '#5d5fef' : '#e2e8f0',
                                            color: newTemplate.moduleIds?.includes(module.id) ? 'white' : '#64748b',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px'
                                        }}>
                                            <i className={`fas ${module.icon}`}></i>
                                        </div>
                                        <div style={{ flex: 1, fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{module.title}</div>
                                        {newTemplate.moduleIds?.includes(module.id) && (
                                            <i className="fas fa-check-circle" style={{ color: '#5d5fef', fontSize: '16px' }}></i>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setViewMode('list')}
                                style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTemplate}
                                style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
                            >
                                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                                {selectedTemplate ? 'Update Template' : 'Create Template'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Bulk Assignment */}
                {viewMode === 'bulk' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '25px' }}>
                        {/* Assignment Criteria */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                Assignment Criteria
                            </h3>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Select Template *
                                </label>
                                <select
                                    value={bulkCriteria.templateId}
                                    onChange={(e) => setBulkCriteria({ ...bulkCriteria, templateId: e.target.value })}
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    <option value="">Choose a template...</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                    Assignment Type *
                                </label>
                                <select
                                    value={bulkCriteria.assignmentType}
                                    onChange={(e) => setBulkCriteria({ ...bulkCriteria, assignmentType: e.target.value as any })}
                                    style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                >
                                    <option value="state">By State</option>
                                    <option value="branch">By Branch</option>
                                    <option value="employeeIds">Select Specific Employees</option>
                                </select>
                            </div>

                            {bulkCriteria.assignmentType === 'state' && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                        Select State *
                                    </label>
                                    <select
                                        value={bulkCriteria.state}
                                        onChange={(e) => setBulkCriteria({ ...bulkCriteria, state: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                    >
                                        <option value="">Choose a state...</option>
                                        {states.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {bulkCriteria.assignmentType === 'branch' && (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                                        Select Branch *
                                    </label>
                                    <select
                                        value={bulkCriteria.branch}
                                        onChange={(e) => setBulkCriteria({ ...bulkCriteria, branch: e.target.value })}
                                        style={{ width: '100%', padding: '10px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
                                    >
                                        <option value="">Choose a branch...</option>
                                        {branches.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <button
                                onClick={handleBulkAssign}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: '#5d5fef',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginTop: '10px'
                                }}
                            >
                                <i className="fas fa-bolt" style={{ marginRight: '8px' }}></i>
                                Assign to Employees
                            </button>

                            {bulkResult && (
                                <div style={{ marginTop: '15px', padding: '12px', background: '#d1fae5', borderRadius: '8px', fontSize: '13px', color: '#065f46', whiteSpace: 'pre-wrap' }}>
                                    {bulkResult}
                                </div>
                            )}
                        </div>

                        {/* Employee Selection (for specific employees) */}
                        {bulkCriteria.assignmentType === 'employeeIds' && (
                            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                                        Select Employees ({selectedEmployeeIds.length} selected)
                                    </h3>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={selectAllEmployees}
                                            style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={clearEmployeeSelection}
                                            style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>
                                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                        {employees.map(emp => (
                                            <div
                                                key={emp.username}
                                                onClick={() => toggleEmployeeSelection(emp.username)}
                                                style={{
                                                    padding: '12px',
                                                    background: selectedEmployeeIds.includes(emp.username) ? '#eff6ff' : '#f8fafc',
                                                    border: selectedEmployeeIds.includes(emp.username) ? '2px solid #5d5fef' : '1px solid #e2e8f0',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{emp.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#5d5fef', fontWeight: '600' }}>{emp.username}</div>
                                                        <div style={{ fontSize: '11px', color: '#64748b' }}>{emp.branch}</div>
                                                    </div>
                                                    {selectedEmployeeIds.includes(emp.username) && (
                                                        <i className="fas fa-check-circle" style={{ color: '#5d5fef', fontSize: '18px' }}></i>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PermissionTemplateManager;
