import React, { useState } from 'react';
import LeaveApplicationForm from './LeaveApplicationForm';
import LeaveApprovals from './LeaveApprovals';
import LeaveBalances from './LeaveBalances';
import LeaveEncashmentForm from './LeaveEncashmentForm';
import LeaveReports from './LeaveReports';
import { LeaveApplication, LeaveBalance, LeaveEncashment } from '../../types/leave';
import { AuthContext } from '../../context/AuthContext';

const LeaveMaster: React.FC = () => {
    const { user } = React.useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('apply');
    const userRole = user?.role || 'employee';
    const isPowerUser = userRole === 'superadmin' || userRole === 'admin' || userRole === 'hr_manager';

    // Mock Data
    const [applications, setApplications] = useState<LeaveApplication[]>([
        {
            id: 'L001',
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            applicationDate: '2024-02-05',
            leaveType: 'CL',
            fromDate: '2024-02-10',
            fromHalf: 'Full',
            toDate: '2024-02-11',
            toHalf: 'Full',
            numberOfDays: 2,
            reason: 'Family Function',
            substituteId: 'EMP002',
            substituteName: 'Jane Smith',
            teamLeadStatus: 'Approved',
            reportingManagerStatus: 'Approved',
            hrStatus: 'Pending',
            overallStatus: 'Pending'
        },
        {
            id: 'L002',
            employeeId: 'EMP002',
            employeeName: 'Jane Smith',
            applicationDate: '2024-02-06',
            leaveType: 'SL',
            fromDate: '2024-02-07',
            fromHalf: 'Full',
            toDate: '2024-02-07',
            toHalf: 'Full',
            numberOfDays: 1,
            reason: 'High Fever',
            teamLeadStatus: 'Approved',
            reportingManagerStatus: 'Approved',
            hrStatus: 'Approved',
            overallStatus: 'Approved'
        }
    ]);

    const [balances, setBalances] = useState<LeaveBalance[]>([
        { employeeId: 'EMP001', employeeName: 'John Doe', cl: 8, sl: 12, el: 15, co: 2, total: 37 },
        { employeeId: 'EMP002', employeeName: 'Jane Smith', cl: 10, sl: 10, el: 18, co: 0, total: 38 }
    ]);

    const [encashments, setEncashments] = useState<LeaveEncashment[]>([
        {
            id: 'ENC001',
            employeeId: 'EMP001',
            employeeName: 'John Doe',
            leaveType: 'EL',
            openingBalance: 15,
            encashableLeaves: 7.5,
            requestedDays: 5,
            amount: 12500,
            status: 'Approved',
            payrollMonth: 'Feb 2024'
        }
    ]);

    const allTabs = [
        { id: 'apply', label: 'Apply Leave', icon: 'fa-paper-plane' },
        { id: 'approvals', label: 'Approvals', icon: 'fa-check-circle', powerOnly: true },
        { id: 'balances', label: 'Leave Balances', icon: 'fa-wallet' },
        { id: 'encashment', label: 'Leave Encashment', icon: 'fa-hand-holding-usd', powerOnly: true },
        { id: 'reports', label: 'Leave Reports', icon: 'fa-file-alt', powerOnly: true }
    ];

    const tabs = allTabs.filter(tab => !tab.powerOnly || isPowerUser);

    const renderContent = () => {
        // Safety check: if user navigates to restricted tab via direct interaction (if any) or if current tab is restricted
        if (!isPowerUser && (activeTab === 'approvals' || activeTab === 'reports' || activeTab === 'encashment')) {
            return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Access Restricted. Managers only.</div>;
        }

        switch (activeTab) {
            case 'apply': return <LeaveApplicationForm onSubmit={(app: LeaveApplication) => setApplications([app, ...applications])} />;
            case 'approvals': return <LeaveApprovals data={applications} onUpdate={(apps: LeaveApplication[]) => setApplications(apps)} />;
            case 'balances': return <LeaveBalances data={balances} />;
            case 'encashment': return <LeaveEncashmentForm data={encashments} onSubmit={(enc: LeaveEncashment) => setEncashments([enc, ...encashments])} />;
            case 'reports': return <LeaveReports applications={applications} balances={balances} encashments={encashments} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '20px', background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header */}
            <div style={{ marginBottom: '25px', background: 'white', padding: '20px 30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '26px', fontWeight: '800' }}>Leave Management System</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '15px' }}>Track requests, balances, and encashments</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Module Status</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>● Synced with Payroll</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', maxWidth: 'fit-content' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '8px',
                            background: activeTab === tab.id ? 'white' : 'transparent',
                            color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                            fontWeight: activeTab === tab.id ? '700' : '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default LeaveMaster;
