import { User, LoginCredentials } from '../types';

// Mock user database (in real app, this would come from an API)
const mockUsers = [
  {
    username: 'superadmin',
    password: 'admin123',
    role: 'superadmin' as const,
    name: 'Master Super Admin'
  },
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin' as const,
    name: 'Main Admin'
  },
  {
    username: 'hr.manager',
    password: 'hr123',
    role: 'hr_manager' as const,
    name: 'HR Operations Manager'
  },
  {
    username: 'EMP001',
    password: 'emp123',
    role: 'employee' as const,
    name: 'Rajesh Kumar',
    employeeId: 'EMP001',
    state: 'Andhra Pradesh',
    branch: 'Vijayawada (Head Office)'
  },
  {
    username: 'EMP002',
    password: 'emp123',
    role: 'employee' as const,
    name: 'Priya Sharma',
    employeeId: 'EMP002',
    state: 'Telangana',
    branch: 'Hyderabad'
  },
  {
    username: 'EMP003',
    password: 'emp123',
    role: 'employee' as const,
    name: 'Amit Patel',
    employeeId: 'EMP003',
    state: 'Andhra Pradesh',
    branch: 'Visakhapatnam'
  },
];

// Mock API call to authenticate user
export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        resolve(null);
      }
    }, 1000); // Simulate network delay
  });
};

// Check if user is authenticated (check localStorage)
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('hrms_auth') !== null;
};

// Get current user from localStorage
export const getUserDetails = (): User | null => {
  const userStr = localStorage.getItem('hrms_auth');
  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('hrms_auth');
};