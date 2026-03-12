import React, { useState } from 'react';
import HeadcountReport from './HeadcountReport';
import AttendanceSummaryReport from './AttendanceSummaryReport';
import LeaveBalanceReport from './LeaveBalanceReport';
import PayrollSummaryReport from './PayrollSummaryReport';
import AttritionReport from './AttritionReport';
import PerformanceReport from './PerformanceReport';
import AnalyticsDashboard from './AnalyticsDashboard';
import { ReportsData } from '../../types/reports';

const ReportsMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('analytics');

    const [reportsData] = useState<ReportsData>({
        headcount: [
            { department: 'Operations', designation: 'Associate', male: 45, female: 30, permanent: 60, contract: 15, probation: 0, total: 75 },
            { department: 'IT', designation: 'Developer', male: 20, female: 10, permanent: 25, contract: 5, probation: 0, total: 30 },
            { department: 'HR', designation: 'Manager', male: 2, female: 8, permanent: 10, contract: 0, probation: 0, total: 10 },
        ],
        attendance: [
            { employeeId: 'EMP001', name: 'John Doe', department: 'Operations', workingDays: 22, present: 21, absent: 1, halfDay: 0, compOff: 0, overtimeHours: 5, lateMarks: 2 },
            { employeeId: 'EMP045', name: 'Sarah Smith', department: 'Sales', workingDays: 22, present: 22, absent: 0, halfDay: 0, compOff: 0, overtimeHours: 2, lateMarks: 0 },
        ],
        leaves: [
            { employeeId: 'EMP001', name: 'John Doe', cl: 2, sl: 4, el: 12, compOff: 1, paternityMaternity: 0, totalTaken: 5 },
        ],
        payroll: [
            { employeeId: 'EMP001', name: 'John Doe', department: 'Operations', grossSalary: 55000, deductions: 5000, netPay: 50000, pfContribution: 1800, esicContribution: 450, bonus: 0, incentives: 2000 },
        ],
        attrition: [
            { employeeId: 'EMP089', name: 'Mike Johnson', department: 'IT', designation: 'Developer', joiningDate: '2022-01-10', lastDay: '2024-01-20', exitType: 'Voluntary', reason: 'Compensation' },
        ],
        performance: [
            { employeeId: 'EMP001', name: 'John Doe', department: 'Operations', designation: 'Associate', rating: 4.5, increment: true, promotion: false, incentive: 5000 },
        ],
        kpis: [
            { label: 'Employee Turnover Rate', value: '5.2%', description: 'Monthly attrition vs headcount', trend: 'down' },
            { label: 'Average Attendance', value: '94.8%', description: 'Present days vs working days', trend: 'up' },
            { label: 'Leave Utilization', value: '62%', description: 'Leaves taken vs entitlement', trend: 'neutral' },
            { label: 'Payroll Cost / Emp', value: '₹48,500', description: 'Total payroll vs headcount', trend: 'up' },
        ]
    });

    const tabs = [
        { id: 'analytics', label: 'HR Analytics Dashboard', icon: 'fa-chart-network' },
        { id: 'headcount', label: 'Headcount Report', icon: 'fa-users' },
        { id: 'attendance', label: 'Attendance Summary', icon: 'fa-calendar-check' },
        { id: 'leaves', label: 'Leave Balance', icon: 'fa-calendar-minus' },
        { id: 'payroll', label: 'Payroll Summary', icon: 'fa-file-invoice-dollar' },
        { id: 'attrition', label: 'Attrition Analysis', icon: 'fa-user-slash' },
        { id: 'performance', label: 'Performance Analytics', icon: 'fa-star' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px', borderRadius: '20px', marginBottom: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <i className="fas fa-chart-line" style={{ marginRight: '15px', color: '#6366f1' }}></i>
                        HR Reports & Intelligence Dashboards
                    </h1>
                    <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Real-time Workforce Insights, Statutory MIS & Predictive Analytics</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                        <div style={{ fontSize: '12px', color: '#818cf8' }}>Global Headcount</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#818cf8' }}>115</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '10px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === tab.id ? '#6366f1' : 'white',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(99, 102, 241, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ animation: 'fadeIn 0.5s ease' }}>
                {activeTab === 'analytics' && <AnalyticsDashboard data={reportsData} />}
                {activeTab === 'headcount' && <HeadcountReport data={reportsData.headcount} />}
                {activeTab === 'attendance' && <AttendanceSummaryReport data={reportsData.attendance} />}
                {activeTab === 'leaves' && <LeaveBalanceReport data={reportsData.leaves} />}
                {activeTab === 'payroll' && <PayrollSummaryReport data={reportsData.payroll} />}
                {activeTab === 'attrition' && <AttritionReport data={reportsData.attrition} />}
                {activeTab === 'performance' && <PerformanceReport data={reportsData.performance} />}
            </div>
        </div>
    );
};

export default ReportsMaster;
