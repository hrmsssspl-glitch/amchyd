export interface MenuItem {
  id: number;
  name: string;
  icon: string;
  active: boolean;
  roles: UserRole[]; // Which roles can see this menu
}

export interface StatCard {
  id: number;
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

export interface Module {
  id: number;
  title: string;
  icon: string;
  description: string;
  features: string[];
  roles: UserRole[]; // Which roles can see this module
}

export type UserRole =
  | 'superadmin'
  | 'admin'
  | 'hr_manager'
  | 'employee';

export interface User {
  username: string; // Employee ID for employees (e.g., EMP001)
  role: UserRole;
  name: string;
  password?: string; // Optional - only stored/displayed for superadmin
  employeeId?: string;
  state?: string;
  branch?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RolePermissions {
  [key: string]: {
    moduleIds: number[];
    menuIds: number[];
  };
}
