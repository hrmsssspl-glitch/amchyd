import { User } from '../types';

export const INITIAL_USERS: User[] = [
    { username: 'superadmin', role: 'superadmin', name: 'Master Super Admin', password: 'admin123' },
    { username: 'admin', role: 'admin', name: 'Main Admin', password: 'admin123' },
    { username: 'hr.manager', role: 'hr_manager', name: 'HR Operations Manager', password: 'hr123' },
    { username: 'EMP001', role: 'employee', name: 'Rajesh Kumar', employeeId: 'EMP001', state: 'Andhra Pradesh', branch: 'Vijayawada (Head Office)', password: 'emp123' },
    { username: 'EMP002', role: 'employee', name: 'Priya Sharma', employeeId: 'EMP002', state: 'Telangana', branch: 'Hyderabad', password: 'emp123' },
    { username: 'EMP003', role: 'employee', name: 'Amit Patel', employeeId: 'EMP003', state: 'Andhra Pradesh', branch: 'Visakhapatnam', password: 'emp123' },
];
