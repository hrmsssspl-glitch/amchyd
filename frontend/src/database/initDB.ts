// initDB.ts
import { Employee } from './types'; // Adjust import path as needed

// Mock data for first names and last names
const firstNames = [
  'John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa', 
  'Michael', 'Jennifer', 'William', 'Elizabeth', 'James', 'Mary', 
  'Charles', 'Patricia', 'Thomas', 'Linda', 'Christopher', 'Barbara',
  'Daniel', 'Susan', 'Matthew', 'Jessica', 'Anthony', 'Sarah', 'Mark',
  'Karen', 'Paul', 'Nancy', 'Steven', 'Margaret', 'Andrew', 'Sandra'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King'
];

// Departments and designations
const departments = ['IT', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations'];
const designations = ['Executive', 'Associate', 'Specialist', 'Analyst', 'Coordinator'];
const statusOptions = ['active', 'active', 'active', 'on-leave', 'inactive']; // Weighted towards 'active'

// Generate a random date between 2020-2023
const getRandomDate = (): string => {
  const year = 2020 + Math.floor(Math.random() * 4); // 2020-2023
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate a random phone number
const getRandomPhone = (index: number): string => {
  const areaCode = Math.floor(Math.random() * 900) + 100; // 100-999
  const prefix = Math.floor(Math.random() * 900) + 100; // 100-999
  const lineNumber = String(1000 + index).slice(-4);
  return `+1-${areaCode}-${prefix}-${lineNumber}`;
};

// Generate a random salary based on role
const getRandomSalary = (designation: string): number => {
  const baseSalary = {
    'Executive': 80000,
    'Specialist': 60000,
    'Analyst': 55000,
    'Associate': 45000,
    'Coordinator': 40000
  }[designation] || 50000;
  
  return baseSalary + Math.floor(Math.random() * 20000);
};

// Initialize database with employees
export const initializeDatabase = (): Employee[] => {
  const employees: Employee[] = [
    {
      id: 'EMP001',
      employeeId: 'EMP001',
      firstname: 'Michael',
      lastname: 'Scott',
      email: 'michael.scott@company.com',
      phone: '+1-123-456-7890',
      department: 'Management',
      designation: 'Regional Manager',
      joinDate: '2018-03-15',
      salary: 85000,
      status: 'active',
      role: 'admin',
      managerId: undefined,
      profileImage: 'https://ui-avatars.com/api/?name=Michael+Scott&background=4A90E2&color=fff&size=128'
    },
    {
      id: 'EMP002',
      employeeId: 'EMP002',
      firstname: 'Dwight',
      lastname: 'Schrute',
      email: 'dwight.schrute@company.com',
      phone: '+1-123-456-7891',
      department: 'Sales',
      designation: 'Sales Executive',
      joinDate: '2019-06-20',
      salary: 65000,
      status: 'active',
      role: 'manager',
      managerId: 'EMP001',
      profileImage: 'https://ui-avatars.com/api/?name=Dwight+Schrute&background=FF6B6B&color=fff&size=128'
    },
    {
      id: 'EMP003',
      employeeId: 'EMP003',
      firstname: 'Jim',
      lastname: 'Halpert',
      email: 'jim.halpert@company.com',
      phone: '+1-123-456-7892',
      department: 'Sales',
      designation: 'Sales Executive',
      joinDate: '2019-08-10',
      salary: 62000,
      status: 'active',
      role: 'manager',
      managerId: 'EMP001',
      profileImage: 'https://ui-avatars.com/api/?name=Jim+Halpert&background=45B7D1&color=fff&size=128'
    },
    {
      id: 'EMP004',
      employeeId: 'EMP004',
      firstname: 'Pam',
      lastname: 'Beesly',
      email: 'pam.beesly@company.com',
      phone: '+1-123-456-7893',
      department: 'Administration',
      designation: 'Receptionist',
      joinDate: '2018-11-05',
      salary: 42000,
      status: 'active',
      role: 'employee',
      managerId: 'EMP001',
      profileImage: 'https://ui-avatars.com/api/?name=Pam+Beesly&background=96CEB4&color=fff&size=128'
    }
  ];

  // Generate additional employees
  const additionalEmployees = Array.from({ length: 240 }, (_, i) => {
    const firstNameIndex = Math.floor(Math.random() * firstNames.length);
    const lastNameIndex = Math.floor(Math.random() * lastNames.length);
    const deptIndex = i % departments.length;
    const designationIndex = i % designations.length;
    
    const department = departments[deptIndex];
    const designation = designations[designationIndex];
    const managerOptions = ['EMP001', 'EMP002', 'EMP003', undefined];
    const managerId = managerOptions[Math.floor(Math.random() * managerOptions.length)];
    
    // Determine role based on designation and managerId
    let role: 'employee' | 'manager' | 'admin' = 'employee';
    if (designation === 'Executive' && Math.random() > 0.7) {
      role = 'manager';
    }
    if (i === 0) role = 'admin'; // First additional employee as admin
    
    const employee: Employee = {
      id: `EMP${String(i + 5).padStart(3, '0')}`,
      employeeId: `EMP${String(i + 5).padStart(3, '0')}`,
      firstname: firstNames[firstNameIndex],
      lastname: lastNames[lastNameIndex],
      email: `${firstNames[firstNameIndex].toLowerCase()}.${lastNames[lastNameIndex].toLowerCase()}@company.com`,
      phone: getRandomPhone(i),
      department: department,
      designation: designation,
      joinDate: getRandomDate(),
      salary: getRandomSalary(designation),
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)] as any,
      role: role,
      managerId: managerId,
      profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstNames[firstNameIndex] + ' ' + lastNames[lastNameIndex])}&background=${Math.floor(Math.random()*16777215).toString(16)}&color=fff&size=128`
    };
    
    return employee;
  });

  return [...employees, ...additionalEmployees];
};

// Export the employees array
export const employees: Employee[] = initializeDatabase();

// Utility functions for database operations
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(emp => emp.id === id);
};

export const getEmployeesByDepartment = (department: string): Employee[] => {
  return employees.filter(emp => emp.department === department);
};

export const getSubordinates = (managerId: string): Employee[] => {
  return employees.filter(emp => emp.managerId === managerId);
};

export const getAllManagers = (): Employee[] => {
  return employees.filter(emp => emp.role === 'manager' || emp.role === 'admin');
};

export const getEmployeesByStatus = (status: string): Employee[] => {
  return employees.filter(emp => emp.status === status);
};

export default employees;