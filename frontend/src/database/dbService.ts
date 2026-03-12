import { 
  Employee, Department, Attendance, Leave, Payroll, 
  PerformanceReview, Recruitment, Training, Asset,
  DisciplinaryCase, Grievance 
} from './dbSchema';

class DatabaseService {
  // Generic CRUD operations
  private getCollection<T>(collectionName: string): T[] {
    const data = localStorage.getItem(`hrms_${collectionName}`);
    return data ? JSON.parse(data) : [];
  }

  private setCollection<T>(collectionName: string, data: T[]): void {
    localStorage.setItem(`hrms_${collectionName}`, JSON.stringify(data));
  }

  // Employee Operations
  getEmployees(): Employee[] {
    return this.getCollection<Employee>('employees');
  }

  getEmployee(id: string): Employee | undefined {
    return this.getEmployees().find(emp => emp.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): Employee {
    const employees = this.getEmployees();
    const newEmployee: Employee = {
      ...employee,
      id: `EMP${String(employees.length + 1).padStart(3, '0')}`
    };
    employees.push(newEmployee);
    this.setCollection('employees', employees);
    return newEmployee;
  }

  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const employees = this.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    
    if (index === -1) return null;
    
    employees[index] = { ...employees[index], ...updates };
    this.setCollection('employees', employees);
    return employees[index];
  }

  deleteEmployee(id: string): boolean {
    const employees = this.getEmployees();
    const filtered = employees.filter(emp => emp.id !== id);
    
    if (filtered.length === employees.length) return false;
    
    this.setCollection('employees', filtered);
    return true;
  }

  // Department Operations
  getDepartments(): Department[] {
    return this.getCollection<Department>('departments');
  }

  getDepartment(id: string): Department | undefined {
    return this.getDepartments().find(dept => dept.id === id);
  }

  // Attendance Operations
  getAttendance(): Attendance[] {
    return this.getCollection<Attendance>('attendance');
  }

  getEmployeeAttendance(employeeId: string): Attendance[] {
    return this.getAttendance().filter(att => att.employeeId === employeeId);
  }

  getTodayAttendance(): Attendance[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendance().filter(att => att.date === today);
  }

  // Leave Operations
  getLeaves(): Leave[] {
    return this.getCollection<Leave>('leaves');
  }

  getPendingLeaves(): Leave[] {
    return this.getLeaves().filter(leave => leave.status === 'pending');
  }

  // Payroll Operations
  getPayroll(): Payroll[] {
    return this.getCollection<Payroll>('payroll');
  }

  getEmployeePayroll(employeeId: string): Payroll[] {
    return this.getPayroll().filter(pay => pay.employeeId === employeeId);
  }

  // Recruitment Operations
  getRecruitments(): Recruitment[] {
    return this.getCollection<Recruitment>('recruitments');
  }

  getActiveRecruitments(): Recruitment[] {
    return this.getRecruitments().filter(rec => rec.status === 'open');
  }

  // Training Operations
  getTrainings(): Training[] {
    return this.getCollection<Training>('trainings');
  }

  // Asset Operations
  getAssets(): Asset[] {
    return this.getCollection<Asset>('assets');
  }

  // Disciplinary Cases
  getDisciplinaryCases(): DisciplinaryCase[] {
    return this.getCollection<DisciplinaryCase>('disciplinaryCases');
  }

  // Grievances
  getGrievances(): Grievance[] {
    return this.getCollection<Grievance>('grievances');
  }

  // Performance Reviews
  getPerformanceReviews(): PerformanceReview[] {
    return this.getCollection<PerformanceReview>('performanceReviews');
  }

  // Dashboard Statistics
  getDashboardStats() {
    const employees = this.getEmployees();
    const attendance = this.getTodayAttendance();
    const pendingLeaves = this.getPendingLeaves();
    const activeRecruitments = this.getActiveRecruitments();
    const pendingReviews = this.getPerformanceReviews().filter(rev => rev.status === 'draft').length;

    return {
      totalEmployees: employees.length,
      departments: this.getDepartments().length,
      monthlyPayroll: employees.reduce((sum, emp) => sum + emp.salary, 0),
      todayAttendance: attendance.length > 0 
        ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
        : 0,
      pendingReviews,
      activeRecruitments: activeRecruitments.length,
      pendingLeaves: pendingLeaves.length,
      activeEmployees: employees.filter(emp => emp.status === 'active').length,
      onLeave: employees.filter(emp => emp.status === 'on-leave').length,
    };
  }

  // Search Functionality
  searchEmployees(query: string): Employee[] {
    const searchTerm = query.toLowerCase();
    return this.getEmployees().filter(emp =>
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.designation.toLowerCase().includes(searchTerm)
    );
  }

  // Get Employees by Department
  getEmployeesByDepartment(departmentId: string): Employee[] {
    const department = this.getDepartment(departmentId);
    if (!department) return [];
    
    return this.getEmployees().filter(emp => 
      emp.department.toLowerCase() === department.name.toLowerCase()
    );
  }

  // Get Manager's Team
  getManagerTeam(managerId: string): Employee[] {
    return this.getEmployees().filter(emp => 
      emp.managerId === managerId
    );
  }
}

// Export singleton instance
export const db = new DatabaseService();