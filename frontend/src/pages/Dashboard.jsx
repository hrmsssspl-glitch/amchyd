import React, { useState } from 'react';
import UserManagement from '../components/UserManagement';
import OrganizationMaster from '../components/OrganizationMaster';
import EmployeeMaster from '../components/EmployeeMaster';
import AssetMaster from '../components/AssetMaster';
import AmcInvoiceProjection from '../components/AmcInvoiceProjection';
import { Users, Building2, UserCircle, Database, LayoutDashboard, ChevronRight, BarChart3 } from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    const MenuButton = ({ id, label, icon: Icon }) => (
        <button
            className={`nav-link ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
            style={{ width: '100%', justifyContent: 'flex-start', background: 'none', border: 'none', cursor: 'pointer' }}
        >
            <Icon size={20} style={{ marginRight: '12px' }} />
            <span style={{ flexGrow: 1, textAlign: 'left' }}>{label}</span>
            <ChevronRight size={16} opacity={activeTab === id ? 1 : 0} />
        </button>
    );

    const getTitle = () => {
        if (activeTab === 'users') return 'User Management';
        if (activeTab === 'org') return 'Organization Master';
        if (activeTab === 'employee') return 'Employee Master';
        if (activeTab === 'asset') return 'Asset Master';
        return 'AMC Invoice Projection';
    };

    const getDescription = () => {
        if (activeTab === 'users') return 'Configure and manage your employee accounts';
        if (activeTab === 'org') return 'Configure and manage your organization details';
        if (activeTab === 'employee') return 'Manage detailed workforce information and compliance';
        if (activeTab === 'asset') return 'Manage AMC assets, contract periods, and billing milestones';
        return 'Revenue forecasting and payment tracking based on AMC milestones';
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                    <small style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Main Menu</small>
                </div>
                <nav>
                    <MenuButton id="users" label="User Management" icon={Users} />
                    <MenuButton id="org" label="Organization Master" icon={Building2} />
                    <MenuButton id="employee" label="Employee Master" icon={UserCircle} />
                    <MenuButton id="asset" label="Asset Master" icon={Database} />
                    <MenuButton id="invoice" label="AMC Invoice Projection" icon={BarChart3} />
                </nav>
            </aside>

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
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'org' && <OrganizationMaster />}
                        {activeTab === 'employee' && <EmployeeMaster />}
                        {activeTab === 'asset' && <AssetMaster />}
                        {activeTab === 'invoice' && <AmcInvoiceProjection />}
                    </div>
                </div>
            </main>
        </div>
    );
};


export default Dashboard;
