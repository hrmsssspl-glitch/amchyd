import { MenuItem, StatCard, Module, UserRole } from '../types';

// If you want to use database, uncomment this:
// import { db } from '../database/dbService';

export const menuItems: MenuItem[] = [
  { id: 1, name: 'Dashboard', icon: 'fa-tachometer-alt', active: true, roles: ['superadmin', 'admin', 'hr_manager', 'employee'] },
  { id: 2, name: 'User Management', icon: 'fa-user-friends', active: false, roles: ['superadmin', 'admin'] },
  { id: 3, name: 'Organization Master', icon: 'fa-sitemap', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 4, name: 'Employee Master', icon: 'fa-id-card', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 5, name: 'Payroll & Compensation', icon: 'fa-money-bill-wave', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 6, name: 'Attendance Management', icon: 'fa-calendar-check', active: false, roles: ['superadmin', 'admin', 'hr_manager', 'employee'] },
  { id: 7, name: 'Leave Management', icon: 'fa-calendar-alt', active: false, roles: ['superadmin', 'admin', 'hr_manager', 'employee'] },
  { id: 8, name: 'Recruitment & Onboarding', icon: 'fa-user-plus', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 9, name: 'Performance Management', icon: 'fa-chart-line', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 10, name: 'Training & Development', icon: 'fa-graduation-cap', active: false, roles: ['superadmin', 'admin', 'hr_manager', 'employee'] },
  { id: 11, name: 'Assets Management', icon: 'fa-laptop', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 12, name: 'Travel & Expense', icon: 'fa-plane', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 13, name: 'Disciplinary Management', icon: 'fa-gavel', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 14, name: 'Grievance Management', icon: 'fa-comments', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 15, name: 'Separation - Exit Management', icon: 'fa-door-open', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 16, name: 'HR Compliance & Statutory Reports', icon: 'fa-file-contract', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 17, name: 'HR Reports & Dashboards', icon: 'fa-chart-bar', active: false, roles: ['superadmin', 'admin', 'hr_manager'] },
  { id: 18, name: 'Event Management', icon: 'fa-calendar-day', active: false, roles: ['superadmin', 'admin', 'hr_manager', 'employee'] },
  { id: 19, name: 'Tender Menu', icon: 'fa-file-contract', active: false, roles: ['superadmin', 'admin', 'hr_manager', 'employee'] },
];

// Use dynamic stats if database is available, otherwise use static
export const getStatCards = (): StatCard[] => {
  // Uncomment when database is ready:
  // if (db) {
  //   const stats = db.getDashboardStats();
  //   return [
  //     { id: 1, title: 'Total Employees', value: stats.totalEmployees, icon: 'fa-users', color: '#5c6bc0' },
  //     { id: 2, title: 'Departments', value: stats.departments, icon: 'fa-sitemap', color: '#42a5f5' },
  //     { id: 3, title: 'Monthly Payroll', value: `$${stats.monthlyPayroll.toLocaleString()}`, icon: 'fa-money-bill-wave', color: '#66bb6a' },
  //     { id: 4, title: 'Today Attendance', value: `${stats.todayAttendance}%`, icon: 'fa-calendar-check', color: '#ffb74d' },
  //     { id: 5, title: 'Pending Reviews', value: stats.pendingReviews, icon: 'fa-clipboard-check', color: '#ef5350' },
  //   ];
  // }

  // Static fallback:
  return [
    { id: 1, title: 'Total Employees', value: 245, icon: 'fa-users', color: '#6366f1' },
    { id: 2, title: 'Open Recruitments', value: 8, icon: 'fa-user-plus', color: '#10b981' },
    { id: 3, title: 'Monthly Payroll', value: '₹ 18.5L', icon: 'fa-wallet', color: '#f59e0b' },
    { id: 4, title: 'Today Attendance', value: '94%', icon: 'fa-user-check', color: '#14b8a6' },
    { id: 5, title: 'Performance Goals', value: 156, icon: 'fa-bullseye', color: '#ec4899' },
    { id: 6, title: 'Skill Certifications', value: 42, icon: 'fa-award', color: '#8b5cf6' },
    { id: 7, title: 'Company Assets', value: 850, icon: 'fa-laptop-house', color: '#0ea5e9' },
    { id: 8, title: 'Pending Expenses', value: 12, icon: 'fa-receipt', color: '#ef4444' },
    { id: 9, title: 'Disciplinary Cases', value: 3, icon: 'fa-gavel', color: '#f97316' },
    { id: 10, title: 'Open Grievances', value: 2, icon: 'fa-comments', color: '#06b6d4' },
    { id: 11, title: 'Notice Period', value: 5, icon: 'fa-door-open', color: '#64748b' },
    { id: 12, title: 'Compliance Score', value: '98%', icon: 'fa-shield-check', color: '#22c55e' },
  ];
};

// For backward compatibility, export static version too
export const statCards: StatCard[] = getStatCards();

export const modules: Module[] = [
  {
    id: 1,
    title: 'User Management',
    icon: 'fa-user-cog',
    description: 'Manage system users and permissions',
    features: ['User roles & permissions', 'Access control', 'Login management'],
    roles: ['superadmin', 'admin']
  },
  {
    id: 2,
    title: 'Organization Master',
    icon: 'fa-building',
    description: 'Company structure and hierarchy',
    features: ['Departments management', 'Designations', 'Reporting structure'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 3,
    title: 'Employee Master',
    icon: 'fa-address-card',
    description: 'Core HR employee records',
    features: ['Employee profiles', 'Personal details', 'Employment history'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 4,
    title: 'Payroll & Compensation',
    icon: 'fa-money-check-alt',
    description: 'Salary and benefits management',
    features: ['Salary processing', 'Tax calculations', 'Bonus & incentives'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 5,
    title: 'Attendance Management',
    icon: 'fa-fingerprint',
    description: 'Track employee attendance',
    features: ['Time tracking', 'Shift management', 'Overtime calculation'],
    roles: ['superadmin', 'admin', 'hr_manager', 'employee']
  },
  {
    id: 6,
    title: 'Leave Management',
    icon: 'fa-calendar-minus',
    description: 'Manage employee leaves',
    features: ['Leave requests', 'Leave balance', 'Approval workflow'],
    roles: ['superadmin', 'admin', 'hr_manager', 'employee']
  },
  {
    id: 7,
    title: 'Recruitment & Onboarding',
    icon: 'fa-user-plus',
    description: 'Manage candidate pipeline and new hire onboarding',
    features: ['Candidate tracking', 'Interview scheduling', 'Offer management', 'Onboarding workflow'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 8,
    title: 'Performance Management',
    icon: 'fa-chart-line',
    description: 'KRA/KPI setting and employee appraisals',
    features: ['Goal setting', 'Appraisal cycles', 'Multi-level reviews', 'Performance linked rewards'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 9,
    title: 'Training & Development',
    icon: 'fa-graduation-cap',
    description: 'Skill development and certifications',
    features: ['Training programs', 'Nominations', 'Assessment & exams', 'Certification vault'],
    roles: ['superadmin', 'admin', 'hr_manager', 'employee']
  },
  {
    id: 10,
    title: 'Assets Management',
    icon: 'fa-laptop-house',
    description: 'Track company assets and allocations',
    features: ['Asset inventory', 'Issue/Return tracking', 'Condition monitoring', 'Recovery settlement'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 11,
    title: 'Travel & Expense',
    icon: 'fa-plane-departure',
    description: 'Manage business travel and reimbursements',
    features: ['Travel requests', 'Advance management', 'Expense claims', 'Policy compliance'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 12,
    title: 'Disciplinary Management',
    icon: 'fa-gavel',
    description: 'Handle employee disciplinary actions and procedures',
    features: ['Issue tracking', 'Hearing management', 'Action plans', 'Appeal process'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 13,
    title: 'Grievance Management',
    icon: 'fa-comments',
    description: 'Manage employee grievances and conflict resolution',
    features: ['Grievance registration', 'Investigation tracking', 'Resolution workflow', 'Feedback system'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 14,
    title: 'Separation - Exit Management',
    icon: 'fa-door-open',
    description: 'Manage employee separation and exit formalities',
    features: ['Exit interviews', 'Clearance process', 'Settlement calculation', 'Knowledge transfer'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 15,
    title: 'HR Compliance & Statutory Reports',
    icon: 'fa-file-shield',
    description: 'Ensure compliance with labor laws and generate statutory reports',
    features: ['Compliance tracking', 'Statutory filings', 'Audit trails', 'Legal documentation'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 16,
    title: 'HR Reports & Dashboards',
    icon: 'fa-chart-pie',
    description: 'Comprehensive HR analytics and reporting',
    features: ['Custom reports', 'Real-time dashboards', 'Trend analysis', 'Data visualization'],
    roles: ['superadmin', 'admin', 'hr_manager']
  },
  {
    id: 17,
    title: 'Event Management',
    icon: 'fa-bullhorn',
    description: 'Manage events, news and notifications',
    features: ['Create Events', 'Post News', 'Send Notifications'],
    roles: ['superadmin', 'admin', 'hr_manager', 'employee']
  },
  {
    id: 18,
    title: 'Tender Management',
    icon: 'fa-file-contract',
    description: 'Manage tenders and contracts',
    features: ['Tender Creation', 'Bid Management', 'EMD/BG Tracking'],
    roles: ['superadmin', 'admin', 'hr_manager', 'employee']
  },
];

// Use dynamic active recruitments if database is available
export const getActiveRecruitments = (): number => {
  // Uncomment when database is ready:
  // if (db) {
  //   return db.getActiveRecruitments().length;
  // }
  return 8;
};

// For backward compatibility
export const activeRecruitments = getActiveRecruitments();

// Default permissions for each role
export const defaultRolePermissions = {
  superadmin: {
    moduleIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  admin: {
    moduleIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    menuIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  hr_manager: {
    moduleIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    menuIds: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  employee: {
    moduleIds: [5, 6, 9, 17, 18],
    menuIds: [1, 6, 7, 10, 18, 19]
  }
};
