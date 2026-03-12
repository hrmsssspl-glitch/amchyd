export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  role: 'admin' | 'hr' | 'manager' | 'employee';
  managerId?: string;
  profileImage?: string;
  address?: string;
  emergencyContact?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headId?: string;
  employeeCount: number;
  budget: number;
  location: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'late';
  hoursWorked: number;
  overtime: number;
}

export interface Leave {
  id: string;
  employeeId: string;
  type: 'sick' | 'casual' | 'annual' | 'maternity' | 'paternity';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  rating: number;
  comments: string;
  goals: string[];
  status: 'draft' | 'submitted' | 'approved';
}

export interface Recruitment {
  id: string;
  position: string;
  department: string;
  experience: string;
  qualifications: string;
  skills: string[];
  status: 'open' | 'closed' | 'on-hold';
  applicants: number;
  postedDate: string;
  deadline: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  trainer: string;
  date: string;
  duration: string;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Asset {
  id: string;
  name: string;
  type: 'laptop' | 'mobile' | 'tablet' | 'accessory' | 'other';
  serialNumber: string;
  assignedTo?: string;
  purchaseDate: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  value: number;
}

export interface DisciplinaryCase {
  id: string;
  employeeId: string;
  type: 'warning' | 'suspension' | 'termination';
  reason: string;
  date: string;
  status: 'open' | 'resolved' | 'appealed';
  actions: string[];
  notes: string;
}

export interface Grievance {
  id: string;
  employeeId: string;
  type: 'workplace' | 'salary' | 'harassment' | 'other';
  description: string;
  date: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo?: string;
  resolution?: string;
}