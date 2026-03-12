// types.ts
export interface Employee {
  id: string;
  employeeId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'on-leave' | 'inactive';
  role: 'employee' | 'manager' | 'admin';
  managerId?: string;
  profileImage?: string;
}

export interface DepartmentSummary {
  department: string;
  count: number;
  totalSalary: number;
  avgSalary: number;
}

export interface ManagerSummary {
  managerId: string;
  managerName: string;
  teamSize: number;
  department: string;
}