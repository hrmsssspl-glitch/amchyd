import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import UserManagement from '../components/UserManagement';
import OrganizationMaster from '../components/OrganizationMaster';
import EmployeeMaster from '../components/EmployeeMaster';
import AssetMaster from '../components/AssetMaster';
import CumminsEngineMaster from '../components/CumminsEngineMaster';
import EngineAMCConversion from '../components/EngineAMCConversion';
import EngineFollowupReports from '../components/EngineFollowupReports';
import AmcInvoiceProjection from '../components/AmcInvoiceProjection';
import AssetInactiveStatus from '../components/AssetInactiveStatus';
import InactiveFollowupStatus from '../components/InactiveFollowupStatus';
import InactiveFollowupReports from '../components/InactiveFollowupReports';
import AMCMonthlyScheduler from '../components/AMCMonthlyScheduler';
import AnalyticsOverview from '../components/AnalyticsOverview';
import AmcBilling from '../components/AmcBilling';
import AdminTools from '../components/AdminTools';

// HRMS Imports
import PayrollMaster from '../components/payroll/PayrollMaster';
import AttendanceMaster from '../components/attendance/AttendanceMaster';
import LeaveMaster from '../components/attendance/LeaveMaster';
import RecruitmentMaster from '../components/recruitment/RecruitmentMaster';
import PerformanceMaster from '../components/pms/PerformanceMaster';
import TrainingMaster from '../components/training/TrainingMaster';
import TravelMaster from '../components/travel/TravelMaster';
import ComplianceMaster from '../components/compliance/ComplianceMaster';
import ReportsMaster from '../components/reports/ReportsMaster';
import EventMaster from '../components/events/EventMaster';
import TenderMaster from '../components/tender/TenderMaster';
import DisciplinaryMaster from '../components/disciplinary/DisciplinaryMaster';
import GrievanceMaster from '../components/grievance/GrievanceMaster';
import ExitMaster from '../components/exit/ExitMaster';
import { Users, Building2, UserCircle, Database, LayoutDashboard, ChevronRight, ChevronDown, BarChart3, ShieldOff, CalendarDays, PieChart, MessageSquareQuote, CreditCard, RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const isAdminUser = ['Super Admin', 'Admin'].includes(user?.role);
    const isServiceEngineer = user?.role === 'Service Engineer';

    // Default to 'overview' for most users, maybe 'scheduler' for engineers
    const [activeTab, setActiveTab] = useState(isServiceEngineer ? 'scheduler' : 'overview');

    const MenuButton = ({ id, label, icon: Icon, visible = true, isDropdownItem = false }) => {
        if (!visible) return null;
        const buttonClass = isDropdownItem ? 'nav-dropdown-item' : 'nav-item';
        return (
            <button
                className={`${buttonClass} ${activeTab === id ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(id);
                }}
                style={isDropdownItem ? {} : { padding: '0 1rem' }}
            >
                {Icon && <Icon size={isDropdownItem ? 16 : 18} />}
                <span>{label}</span>
            </button>
        );
    };

    const getTitle = () => {
        if (activeTab === 'overview') return 'Analytics Overview';
        if (activeTab === 'users') return 'User Management';
        if (activeTab === 'org') return 'Organization Master';
        if (activeTab === 'employee') return 'Employee Master';
        if (activeTab === 'engine') return 'Engine Master Details';
        if (activeTab === 'engine-inactive') return 'Engine AMC Conversion';
        if (activeTab === 'engine-reports') return 'Engine Followup Reports';
        if (activeTab === 'asset') return 'AMC Master Details';
        if (activeTab === 'inactive') return 'AMC Status View';
        if (activeTab === 'inactive-followup') return 'AMC Followup Status';
        if (activeTab === 'inactive-followup-reports') return 'AMC Followup Reports';
        if (activeTab === 'inactive-followup-reports') return 'Inactive Followup Reports';
        if (activeTab === 'scheduler') return 'AMC Monthly Scheduler';
        if (activeTab === 'invoice') return 'AMC Invoice Projection';
        if (activeTab === 'admin-tools') return 'Admin Tools';

        // HRMS Titles
        if (activeTab === 'hrms-payroll') return 'Payroll Management';
        if (activeTab === 'hrms-attendance') return 'Attendance Master';
        if (activeTab === 'hrms-leave') return 'Leave Management';
        if (activeTab === 'hrms-recruitment') return 'Recruitment Master';
        if (activeTab === 'hrms-pms') return 'Performance Management (PMS)';
        if (activeTab === 'hrms-training') return 'Training Management';
        if (activeTab === 'hrms-travel') return 'Travel Management';
        if (activeTab === 'hrms-compliance') return 'Compliance Master';
        if (activeTab === 'hrms-reports') return 'HRMS Reports';
        if (activeTab === 'hrms-events') return 'Event Management';
        if (activeTab === 'hrms-tender') return 'Tender Master';
        if (activeTab === 'hrms-disciplinary') return 'Disciplinary Actions';
        if (activeTab === 'hrms-grievance') return 'Grievance Handling';
        if (activeTab === 'hrms-exit') return 'Exit Management';

        return 'Application Dashboard';
    };

    const getDescription = () => {
        if (activeTab === 'overview') return 'High-level business intelligence and asset metrics';
        if (activeTab === 'users') return 'Configure and manage your employee accounts';
        if (activeTab === 'org') return 'Configure and manage your organization details';
        if (activeTab === 'employee') return 'Manage detailed workforce information and compliance';
        if (activeTab === 'engine') return 'Manage detailed engine records and history';
        if (activeTab === 'engine-inactive') return 'Track and manage engine conversion to AMC status';
        if (activeTab === 'engine-reports') return 'Day-wise follow-up activity report for engines';
        if (activeTab === 'asset') return 'Manage AMC master details, contract periods, and billing milestones';
        if (activeTab === 'inactive') return 'View and manage assets with inactive AMC status';
        if (activeTab === 'inactive-followup') return 'Track and manage follow-ups for inactive AMC assets';
        if (activeTab === 'inactive-followup-reports') return 'Day-wise follow-up activity report for AMC assets';
        if (activeTab === 'inactive-followup-reports') return 'Day-wise follow-up activity report for employees';
        if (activeTab === 'scheduler') return 'Monthly schedule for all live engines';
        if (activeTab === 'invoice') return 'Revenue forecasting and payment tracking based on AMC milestones';
        if (activeTab === 'amc-payments') return 'Track customer payments, view outstanding balances and settle invoices';
        if (activeTab === 'admin-tools') return 'Configure and manage application fields like States and Branches';

        // HRMS Descriptions
        if (activeTab.startsWith('hrms-')) return 'Human Resources Management System Module';

        return '';
    };

    return (
        <div className="dashboard-layout">
            <nav className="top-nav">
                <MenuButton id="overview" label="Overview" icon={PieChart} visible={!isServiceEngineer} />

                {isAdminUser && (
                    <div className={`nav-item ${['users', 'org', 'employee', 'admin-tools'].includes(activeTab) ? 'active' : ''}`}>
                        <Building2 size={18} />
                        <span>Administration</span>
                        <ChevronDown size={14} style={{ marginLeft: '4px', opacity: 0.7 }} />
                        <div className="nav-dropdown">
                            <MenuButton id="org" label="Organization Master" icon={Building2} isDropdownItem visible={isAdminUser} />
                            <MenuButton id="employee" label="Employee Master" icon={UserCircle} isDropdownItem visible={isAdminUser || ['HR Head'].includes(user?.role)} />
                            <MenuButton id="users" label="User Management" icon={Users} isDropdownItem visible={isAdminUser} />
                            <div className="nav-dropdown-divider"></div>
                            <div className="nav-dropdown-header">System Config</div>
                            <MenuButton id="admin-tools" label="Admin Tools" icon={RefreshCw} isDropdownItem visible={isAdminUser} />
                        </div>
                    </div>
                )}

                {isAdminUser && (
                    <div className={`nav-item ${['engine', 'engine-inactive', 'engine-reports', 'asset', 'inactive', 'inactive-followup', 'inactive-followup-reports', 'scheduler', 'invoice', 'amc-payments'].includes(activeTab) ? 'active' : ''}`}>
                        <Database size={18} />
                        <span>Engine Master</span>
                        <ChevronDown size={14} style={{ marginLeft: '4px', opacity: 0.7 }} />
                        <div className="nav-dropdown" style={{ minWidth: '240px' }}>
                            <MenuButton id="engine" label="Master Details" icon={Database} isDropdownItem visible={isAdminUser} />
                            <MenuButton id="engine-inactive" label="AMC Conversion" icon={ShieldOff} isDropdownItem visible={isAdminUser} />
                            <MenuButton id="engine-reports" label="Followup Reports" icon={BarChart3} isDropdownItem visible={isAdminUser} />

                            <div className="nav-dropdown-divider"></div>
                            <div className="nav-dropdown-header">AMC Master</div>
                            <MenuButton id="asset" label="Master Details" icon={Database} isDropdownItem />
                            <MenuButton id="inactive" label="Status View" icon={ShieldOff} isDropdownItem visible={!isServiceEngineer} />
                            <MenuButton id="inactive-followup" label="Followup Status" icon={MessageSquareQuote} isDropdownItem visible={!isServiceEngineer} />
                            <MenuButton id="inactive-followup-reports" label="Followup Reports" icon={BarChart3} isDropdownItem />

                            <div className="nav-dropdown-divider"></div>
                            <MenuButton id="scheduler" label="AMC Monthly Scheduler" icon={CalendarDays} isDropdownItem />
                            <MenuButton id="invoice" label="Invoice Projection" icon={BarChart3} isDropdownItem visible={!isServiceEngineer} />
                            <MenuButton id="amc-payments" label="AMC - Billing" icon={CreditCard} isDropdownItem visible={!isServiceEngineer} />
                        </div>
                    </div>
                )}

                {/* Core HRMS */}
                {isAdminUser && (
                    <div className={`nav-item ${['hrms-payroll', 'hrms-attendance', 'hrms-leave', 'hrms-recruitment', 'hrms-pms', 'hrms-training', 'hrms-reports'].includes(activeTab) ? 'active' : ''}`}>
                        <Users size={18} />
                        <span>Core HRMS</span>
                        <ChevronDown size={14} style={{ marginLeft: '4px', opacity: 0.7 }} />
                        <div className="nav-dropdown" style={{ minWidth: '220px' }}>
                            <MenuButton id="hrms-attendance" label="Attendance" isDropdownItem />
                            <MenuButton id="hrms-leave" label="Leave Master" isDropdownItem />
                            <MenuButton id="hrms-payroll" label="Payroll" isDropdownItem />
                            <MenuButton id="hrms-recruitment" label="Recruitment" isDropdownItem />
                            <MenuButton id="hrms-pms" label="Performance (PMS)" isDropdownItem />
                            <MenuButton id="hrms-training" label="Training" isDropdownItem />
                            <MenuButton id="hrms-reports" label="HRMS Reports" isDropdownItem />
                        </div>
                    </div>
                )}

                {/* HR Operations */}
                {isAdminUser && (
                    <div className={`nav-item ${['hrms-travel', 'hrms-compliance', 'hrms-events', 'hrms-tender', 'hrms-disciplinary', 'hrms-grievance', 'hrms-exit'].includes(activeTab) ? 'active' : ''}`}>
                        <Building2 size={18} />
                        <span>HR Ops</span>
                        <ChevronDown size={14} style={{ marginLeft: '4px', opacity: 0.7 }} />
                        <div className="nav-dropdown" style={{ minWidth: '220px' }}>
                            <MenuButton id="hrms-travel" label="Travel" isDropdownItem />
                            <MenuButton id="hrms-compliance" label="Compliance" isDropdownItem />
                            <MenuButton id="hrms-events" label="Events" isDropdownItem />
                            <MenuButton id="hrms-tender" label="Tenders" isDropdownItem />
                            <div className="nav-dropdown-divider"></div>
                            <div className="nav-dropdown-header">Employee Relations</div>
                            <MenuButton id="hrms-disciplinary" label="Disciplinary" isDropdownItem />
                            <MenuButton id="hrms-grievance" label="Grievances" isDropdownItem />
                            <MenuButton id="hrms-exit" label="Exit Management" isDropdownItem />
                        </div>
                    </div>
                )}
            </nav>

            <main className="main-content">
                <div className="container" style={{ padding: 0 }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                            {getTitle()}
                        </h1>
                        <p style={{ color: '#666', marginTop: '0.25rem' }}>
                            {getDescription()}
                        </p>
                    </div>

                    <div className="card" style={{ padding: '2rem' }}>
                        {activeTab === 'overview' && <AnalyticsOverview />}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'org' && <OrganizationMaster />}
                        {activeTab === 'employee' && <EmployeeMaster />}
                        {activeTab === 'engine' && <CumminsEngineMaster />}
                        {activeTab === 'engine-inactive' && <EngineAMCConversion />}
                        {activeTab === 'engine-reports' && <EngineFollowupReports />}
                        {activeTab === 'asset' && <AssetMaster />}
                        {activeTab === 'inactive' && <AssetInactiveStatus />}
                        {activeTab === 'inactive-followup' && <InactiveFollowupStatus />}
                        {activeTab === 'inactive-followup-reports' && <InactiveFollowupReports />}
                        {activeTab === 'scheduler' && <AMCMonthlyScheduler />}
                        {activeTab === 'invoice' && <AmcInvoiceProjection />}
                        {activeTab === 'amc-payments' && <AmcBilling />}
                        {activeTab === 'admin-tools' && <AdminTools />}

                        {/* HRMS Component Rendering */}
                        {activeTab === 'hrms-payroll' && <PayrollMaster />}
                        {activeTab === 'hrms-attendance' && <AttendanceMaster />}
                        {activeTab === 'hrms-leave' && <LeaveMaster />}
                        {activeTab === 'hrms-recruitment' && <RecruitmentMaster />}
                        {activeTab === 'hrms-pms' && <PerformanceMaster />}
                        {activeTab === 'hrms-training' && <TrainingMaster />}
                        {activeTab === 'hrms-travel' && <TravelMaster />}
                        {activeTab === 'hrms-compliance' && <ComplianceMaster />}
                        {activeTab === 'hrms-reports' && <ReportsMaster />}
                        {activeTab === 'hrms-events' && <EventMaster />}
                        {activeTab === 'hrms-tender' && <TenderMaster />}
                        {activeTab === 'hrms-disciplinary' && <DisciplinaryMaster />}
                        {activeTab === 'hrms-grievance' && <GrievanceMaster />}
                        {activeTab === 'hrms-exit' && <ExitMaster />}
                    </div>
                </div>
            </main>
        </div>
    );
};


export default Dashboard;
