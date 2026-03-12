import { UserPermission } from '../types/permissions';

const STORAGE_KEY = 'hrms_user_permissions';

// Get all user-specific permissions
export const getUserPermissions = (): UserPermission[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (error) {
            console.error('Error parsing user permissions:', error);
            return [];
        }
    }
    return [];
};

// Get permissions for a specific user
export const getPermissionsByUserId = (userId: string): UserPermission | null => {
    const allPermissions = getUserPermissions();
    return allPermissions.find(p => p.userId === userId) || null;
};

// Save user permissions
export const saveUserPermission = (permission: UserPermission): void => {
    const allPermissions = getUserPermissions();
    const existingIndex = allPermissions.findIndex(p => p.userId === permission.userId);

    if (existingIndex >= 0) {
        allPermissions[existingIndex] = permission;
    } else {
        allPermissions.push(permission);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPermissions));
};

// Delete user permissions
export const deleteUserPermission = (userId: string): void => {
    const allPermissions = getUserPermissions();
    const filtered = allPermissions.filter(p => p.userId !== userId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

// Bulk update permissions
export const bulkUpdatePermissions = (permissions: UserPermission[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
};

// Check if user has specific menu access
export const hasMenuAccess = (userId: string, menuId: number, roleMenuIds: number[]): boolean => {
    const userPermission = getPermissionsByUserId(userId);

    // If user has specific permissions, use those
    if (userPermission) {
        return userPermission.menuIds.includes(menuId);
    }

    // Otherwise fall back to role-based permissions
    return roleMenuIds.includes(menuId);
};

// Check if user has specific module access
export const hasModuleAccess = (userId: string, moduleId: number, roleModuleIds: number[]): boolean => {
    const userPermission = getPermissionsByUserId(userId);

    // If user has specific permissions, use those
    if (userPermission) {
        return userPermission.moduleIds.includes(moduleId);
    }

    // Otherwise fall back to role-based permissions
    return roleModuleIds.includes(moduleId);
};

// Get effective menu IDs for a user (combines role and user-specific)
export const getEffectiveMenuIds = (userId: string, roleMenuIds: number[]): number[] => {
    const userPermission = getPermissionsByUserId(userId);

    // If user has specific permissions, use those exclusively
    if (userPermission) {
        return userPermission.menuIds;
    }

    // Otherwise use role-based permissions
    return roleMenuIds;
};

// Get effective module IDs for a user
export const getEffectiveModuleIds = (userId: string, roleModuleIds: number[]): number[] => {
    const userPermission = getPermissionsByUserId(userId);

    // If user has specific permissions, use those exclusively
    if (userPermission) {
        return userPermission.moduleIds;
    }

    // Otherwise use role-based permissions
    return roleModuleIds;
};
