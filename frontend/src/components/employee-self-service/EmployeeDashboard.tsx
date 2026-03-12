import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { getUserDetails } from '../../auth/authService';

const EmployeeDashboard: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'leave' | 'payroll' | 'profile' | 'performance' | 'training' | 'assets' | 'travel' | 'disciplinary' | 'grievance' | 'exit'>('overview');

    useEffect(() => {
        const user = getUserDetails();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    if (!currentUser) return <div>Loading...</div>;

    // Mock data - in real app, this would come from API filtered by currentUser.employeeId
    const employeeData = {
        name: currentUser.name,
        employeeId: currentUser.employeeId || currentUser.username,
        designation: 'Senior Executive',
        department: 'Human Resources',
        joiningDate: '2024-01-15',
        reportingTo: 'HR Manager',

        attendance: {
            present: 22,
            absent: 1,
            halfDay: 2,
            late: 3,
            totalDays: 25,
            percentage: 88
        },

        leaves: {
            casual: { total: 12, used: 5, balance: 7 },
            sick: { total: 10, used: 2, balance: 8 },
            earned: { total: 15, used: 0, balance: 15 },
            pending: 1
        },

        recentLeaves: [
            { id: 1, type: 'Casual Leave', from: '2026-02-15', to: '2026-02-16', days: 2, status: 'Approved', appliedOn: '2026-02-10' },
            { id: 2, type: 'Sick Leave', from: '2026-01-20', to: '2026-01-20', days: 1, status: 'Approved', appliedOn: '2026-01-19' },
            { id: 3, type: 'Casual Leave', from: '2026-03-01', to: '2026-03-02', days: 2, status: 'Pending', appliedOn: '2026-02-08' }
        ],

        salary: {
            basic: 35000,
            hra: 14000,
            conveyance: 1600,
            medical: 1250,
            specialAllowance: 8150,
            gross: 60000,
            pf: 4200,
            esi: 900,
            tax: 2500,
            netSalary: 52400
        },

        payslips: [
            { month: 'January 2026', netPay: 52400, status: 'Paid', date: '2026-02-01' },
            { month: 'December 2025', netPay: 52400, status: 'Paid', date: '2026-01-01' },
            { month: 'November 2025', netPay: 52400, status: 'Paid', date: '2025-12-01' }
        ],

        // New Module Data
        performance: {
            rating: 4.2,
            reviewPeriod: '2025-2026',
            goals: [
                { id: 1, title: 'Complete HR Compliance Training', status: 'Completed', progress: 100 },
                { id: 2, title: 'Reduce Recruitment Turnaround Time', status: 'In Progress', progress: 65 },
                { id: 3, title: 'Implement New Leave Policy', status: 'Pending', progress: 0 }
            ]
        },

        trainings: [
            { id: 1, title: 'Advanced React Patterns', date: '2026-03-10', status: 'Upcoming', type: 'Technical' },
            { id: 2, title: 'Workplace Safety Guidelines', date: '2026-01-20', status: 'Completed', type: 'Compliance' }
        ],

        assets: [
            { id: 1, item: 'MacBook Pro M2', assignedDate: '2024-01-15', returnDate: '-', status: 'Active' },
            { id: 2, item: 'Dell 27" Monitor', assignedDate: '2024-01-15', returnDate: '-', status: 'Active' }
        ],

        expenses: [
            { id: 1, category: 'Travel', amount: 4500, date: '2026-02-01', status: 'Approved', description: 'Client Visit - Hyderabad' },
            { id: 2, category: 'Food', amount: 1200, date: '2026-02-01', status: 'Pending', description: 'Team Lunch' }
        ],

        disciplinary: [], // No records is good news

        grievances: [
            { id: 1, subject: 'AC not working in cabin', submittedOn: '2026-01-10', status: 'Resolved' }
        ]
    };

    const tabButtonStyle = (isActive: boolean) => ({
        flex: 1,
        padding: '12px',
        background: 'transparent',
        color: isActive ? '#5d5fef' : '#64748b',
        border: 'none',
        borderBottom: isActive ? '3px solid #5d5fef' : '3px solid transparent',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        whiteSpace: 'nowrap' as const
    });

    const MenuIcon = ({ icon }: { icon: string }) => <i className={`fas ${icon}`} style={{ marginRight: '8px' }}></i>;

    return (
        <div style={{ padding: '30px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ background: 'white', padding: '25px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '700' }}>
                                <i className="fas fa-user-circle" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                My Dashboard
                            </h1>
                            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
                                Welcome back, <strong>{employeeData.name}</strong> ({employeeData.employeeId})
                            </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                <div><strong>Department:</strong> {employeeData.department}</div>
                                <div><strong>Designation:</strong> {employeeData.designation}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ background: 'white', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
                    <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', minWidth: 'max-content' }}>
                        <button onClick={() => setActiveTab('overview')} style={tabButtonStyle(activeTab === 'overview')}><MenuIcon icon="fa-th-large" />Overview</button>
                        <button onClick={() => setActiveTab('attendance')} style={tabButtonStyle(activeTab === 'attendance')}><MenuIcon icon="fa-calendar-check" />Attendance</button>
                        <button onClick={() => setActiveTab('leave')} style={tabButtonStyle(activeTab === 'leave')}><MenuIcon icon="fa-umbrella-beach" />Leaves</button>
                        <button onClick={() => setActiveTab('payroll')} style={tabButtonStyle(activeTab === 'payroll')}><MenuIcon icon="fa-money-bill-wave" />Payroll</button>
                        <button onClick={() => setActiveTab('performance')} style={tabButtonStyle(activeTab === 'performance')}><MenuIcon icon="fa-chart-line" />Performance</button>
                        <button onClick={() => setActiveTab('training')} style={tabButtonStyle(activeTab === 'training')}><MenuIcon icon="fa-chalkboard-teacher" />Training</button>
                        <button onClick={() => setActiveTab('assets')} style={tabButtonStyle(activeTab === 'assets')}><MenuIcon icon="fa-laptop" />Assets</button>
                        <button onClick={() => setActiveTab('travel')} style={tabButtonStyle(activeTab === 'travel')}><MenuIcon icon="fa-plane" />Travel</button>
                        <button onClick={() => setActiveTab('disciplinary')} style={tabButtonStyle(activeTab === 'disciplinary')}><MenuIcon icon="fa-gavel" />Disciplinary</button>
                        <button onClick={() => setActiveTab('grievance')} style={tabButtonStyle(activeTab === 'grievance')}><MenuIcon icon="fa-heart-broken" />Grievance</button>
                        <button onClick={() => setActiveTab('exit')} style={tabButtonStyle(activeTab === 'exit')}><MenuIcon icon="fa-sign-out-alt" />Exit</button>
                        <button onClick={() => setActiveTab('profile')} style={tabButtonStyle(activeTab === 'profile')}><MenuIcon icon="fa-user" />Profile</button>
                    </div>
                </div>

                {/* Tab Content */}
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Attendance This Month</div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>{employeeData.attendance.percentage}%</div>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>{employeeData.attendance.present}/{employeeData.attendance.totalDays} days</div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '25px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Leave Balance</div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>{employeeData.leaves.casual.balance + employeeData.leaves.sick.balance + employeeData.leaves.earned.balance}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Total available</div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '25px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>My Rating</div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>{employeeData.performance.rating}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Avg. Rating</div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '25px', borderRadius: '12px', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Net Salary</div>
                                <div style={{ fontSize: '32px', fontWeight: '700' }}>₹{employeeData.salary.netSalary.toLocaleString()}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>Current month</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>
                                    <i className="fas fa-history" style={{ marginRight: '10px', color: '#5d5fef' }}></i>
                                    Recent Activity
                                </h3>
                                {employeeData.recentLeaves.map((leave) => (
                                    <div key={leave.id} style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '12px', borderLeft: `4px solid ${leave.status === 'Approved' ? '#10b981' : leave.status === 'Pending' ? '#f59e0b' : '#ef4444'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <strong style={{ color: '#1e293b', fontSize: '14px' }}>{leave.type}</strong>
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: '600',
                                                background: leave.status === 'Approved' ? '#d1fae5' : leave.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                                                color: leave.status === 'Approved' ? '#065f46' : leave.status === 'Pending' ? '#92400e' : '#991b1b'
                                            }}>
                                                {leave.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                                            <div><i className="fas fa-calendar" style={{ marginRight: '6px', width: '14px' }}></i>{leave.from} to {leave.to} ({leave.days} days)</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Goals Snapshot */}
                            <div style={{ background: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', fontSize: '18px', fontWeight: '700' }}>
                                    <i className="fas fa-bullseye" style={{ marginRight: '10px', color: '#5d5fef' }}></i>
                                    My Goals
                                </h3>
                                {employeeData.performance.goals.map((goal) => (
                                    <div key={goal.id} style={{ marginBottom: '15px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '13px' }}>
                                            <span style={{ color: '#1e293b', fontWeight: '600' }}>{goal.title}</span>
                                            <span style={{ color: '#64748b' }}>{goal.progress}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{ width: `${goal.progress}%`, height: '100%', background: goal.progress === 100 ? '#10b981' : '#5d5fef', borderRadius: '4px' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-calendar-check" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            My Attendance Records
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ background: '#dbeafe', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e40af' }}>{employeeData.attendance.present}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Present</div>
                            </div>
                            <div style={{ background: '#fee2e2', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626' }}>{employeeData.attendance.absent}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Absent</div>
                            </div>
                            <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706' }}>{employeeData.attendance.halfDay}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Half Day</div>
                            </div>
                            <div style={{ background: '#fce7f3', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#be123c' }}>{employeeData.attendance.late}</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Late</div>
                            </div>
                            <div style={{ background: '#d1fae5', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
                                <div style={{ fontSize: '28px', fontWeight: '700', color: '#065f46' }}>{employeeData.attendance.percentage}%</div>
                                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Attendance</div>
                            </div>
                        </div>

                        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                            <i className="fas fa-info-circle" style={{ fontSize: '24px', color: '#0284c7', marginBottom: '10px' }}></i>
                            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '14px' }}>
                                This shows your attendance for the current month. For detailed daily records, contact HR.
                            </p>
                        </div>
                    </div>
                )}

                {/* Leave Tab */}
                {activeTab === 'leave' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                                <i className="fas fa-umbrella-beach" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                My Leave Management
                            </h2>
                            <button style={{
                                padding: '12px 24px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600'
                            }}>
                                <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                                Apply for Leave
                            </button>
                        </div>
                        {/* Leave Balance Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>Casual Leave</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>{employeeData.leaves.casual.balance}</div>
                                <div style={{ fontSize: '13px', opacity: 0.8 }}>Available out of {employeeData.leaves.casual.total}</div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>Sick Leave</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>{employeeData.leaves.sick.balance}</div>
                                <div style={{ fontSize: '13px', opacity: 0.8 }}>Available out of {employeeData.leaves.sick.total}</div>
                            </div>
                            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '25px', borderRadius: '12px', color: 'white' }}>
                                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '10px' }}>Earned Leave</div>
                                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>{employeeData.leaves.earned.balance}</div>
                                <div style={{ fontSize: '13px', opacity: 0.8 }}>Available out of {employeeData.leaves.earned.total}</div>
                            </div>
                        </div>
                        {/* Leave History Table... (Simplified for brevity as it's repetitive) */}
                    </div>
                )}

                {/* Payroll Tab */}
                {activeTab === 'payroll' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-money-bill-wave" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            My Salary Details
                        </h2>
                        {/* Details... */}
                        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '30px', borderRadius: '12px', color: 'white', marginBottom: '30px' }}>
                            <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '10px' }}>Current Month Net Salary</div>
                            <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '15px' }}>₹{employeeData.salary.netSalary.toLocaleString()}</div>
                        </div>
                    </div>
                )}

                {/* Performance Tab */}
                {activeTab === 'performance' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-chart-line" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            My Performance
                        </h2>
                        <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '10px', marginBottom: '20px' }}>
                            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>Goals & Objectives</div>
                            {employeeData.performance.goals.map((goal) => (
                                <div key={goal.id} style={{ marginBottom: '20px', background: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{goal.title}</div>
                                        <div style={{
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                            background: goal.status === 'Completed' ? '#d1fae5' : '#dbeafe', color: goal.status === 'Completed' ? '#065f46' : '#1e40af'
                                        }}>{goal.status}</div>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${goal.progress}%`, height: '100%', background: '#5d5fef', borderRadius: '4px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Training Tab */}
                {activeTab === 'training' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-chalkboard-teacher" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            My Trainings
                        </h2>
                        {employeeData.trainings.map((training) => (
                            <div key={training.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '15px' }}>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{training.title}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '5px' }}>Date: {training.date} • Type: {training.type}</div>
                                </div>
                                <div>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600',
                                        background: training.status === 'Completed' ? '#d1fae5' : '#ffedd5', color: training.status === 'Completed' ? '#065f46' : '#c2410b'
                                    }}>{training.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Assets Tab */}
                {activeTab === 'assets' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-laptop" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            My Assets
                        </h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Item</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Assigned Date</th>
                                    <th style={{ padding: '12px', textAlign: 'left', color: '#64748b' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeData.assets.map((asset) => (
                                    <tr key={asset.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px', fontWeight: '600' }}>{asset.item}</td>
                                        <td style={{ padding: '15px', color: '#64748b' }}>{asset.assignedDate}</td>
                                        <td style={{ padding: '15px' }}><span style={{ color: '#10b981', fontWeight: '600' }}>{asset.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Travel Tab */}
                {activeTab === 'travel' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                                <i className="fas fa-plane" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                My Travel & Expenses
                            </h2>
                            <button style={{ padding: '10px 20px', background: '#5d5fef', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>+ New Request</button>
                        </div>
                        {employeeData.expenses.map((expense) => (
                            <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '10px' }}>
                                <div>
                                    <div style={{ fontWeight: '700', color: '#1e293b' }}>{expense.category} - ₹{expense.amount}</div>
                                    <div style={{ fontSize: '13px', color: '#64748b' }}>{expense.description} • {expense.date}</div>
                                </div>
                                <div style={{
                                    color: expense.status === 'Approved' ? '#10b981' : '#f59e0b', fontWeight: '600', fontSize: '14px'
                                }}>{expense.status}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Disciplinary Tab */}
                {activeTab === 'disciplinary' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-gavel" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            Disciplinary Record
                        </h2>
                        {employeeData.disciplinary.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#10b981', marginBottom: '15px' }}></i>
                                <div style={{ fontSize: '16px', fontWeight: '600' }}>No Disciplinary Records</div>
                                <p>Keep up the good work!</p>
                            </div>
                        ) : (
                            <div>Records would appear here</div>
                        )}
                    </div>
                )}

                {/* Grievance Tab */}
                {activeTab === 'grievance' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                                <i className="fas fa-heart-broken" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                                My Grievances
                            </h2>
                            <button style={{ padding: '10px 20px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Report Issue</button>
                        </div>
                        {employeeData.grievances.map((item) => (
                            <div key={item.id} style={{ padding: '15px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                <div style={{ fontWeight: '700', color: '#1e293b', marginBottom: '5px' }}>{item.subject}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                                    <span>Submitted: {item.submittedOn}</span>
                                    <span style={{ color: '#10b981', fontWeight: '600' }}>{item.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Exit Tab */}
                {activeTab === 'exit' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-sign-out-alt" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            Exit Management
                        </h2>
                        <div style={{ padding: '30px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fda4af' }}>
                            <h3 style={{ color: '#be123c', marginTop: 0 }}>To Resign or View Exit Status</h3>
                            <p style={{ color: '#881337', marginBottom: '20px' }}>If you wish to initiate the resignation process, please click the button below. This action will notify HR and your reporting manager.</p>
                            <button style={{ padding: '12px 24px', background: '#be123c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                                Initiate Resignation
                            </button>
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h2 style={{ margin: '0 0 25px 0', color: '#1e293b', fontSize: '22px', fontWeight: '700' }}>
                            <i className="fas fa-user" style={{ marginRight: '12px', color: '#5d5fef' }}></i>
                            My Profile
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '180px',
                                    height: '180px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontSize: '64px',
                                    color: 'white',
                                    fontWeight: '700'
                                }}>
                                    {employeeData.name.charAt(0)}
                                </div>
                                <h3 style={{ margin: '0 0 5px 0', color: '#1e293b', fontSize: '20px', fontWeight: '700' }}>{employeeData.name}</h3>
                                <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>{employeeData.employeeId}</p>
                                <button style={{
                                    padding: '10px 20px',
                                    background: '#5d5fef',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '600'
                                }}>
                                    <i className="fas fa-camera" style={{ marginRight: '8px' }}></i>
                                    Change Photo
                                </button>
                            </div>

                            <div>
                                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                    <h4 style={{ margin: '0 0 15px 0', color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>Basic Information</h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        {[
                                            { label: 'Employee ID', value: employeeData.employeeId },
                                            { label: 'Designation', value: employeeData.designation },
                                            { label: 'Department', value: employeeData.department },
                                            { label: 'Joining Date', value: employeeData.joiningDate },
                                            { label: 'Reporting To', value: employeeData.reportingTo },
                                            { label: 'Work Location', value: currentUser.branch || 'Head Office' }
                                        ].map((item, idx) => (
                                            <div key={idx}>
                                                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                                                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
                                    <i className="fas fa-lock" style={{ fontSize: '24px', color: '#0284c7', marginBottom: '10px' }}></i>
                                    <p style={{ margin: 0, color: '#0c4a6e', fontSize: '14px' }}>
                                        To update your personal information, please contact HR department.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeDashboard;
