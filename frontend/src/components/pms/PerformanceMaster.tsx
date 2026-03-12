import React, { useState } from 'react';
import PMSCycleConfig from './PMSCycleConfig';
import GoalSetting from './GoalSetting';
import AppraisalHub from './AppraisalHub';
import PerformanceReports from './PerformanceReports';
import { AppraisalRecord, PMSCycle, PMSData } from '../../types/pms';

const PerformanceMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('cycle');

    // Mock PMS Data
    const [pmsData, setPmsData] = useState<PMSData>({
        cycles: [
            { id: 'FY23-24', period: 'FY', fromDate: '2023-04-01', toDate: '2024-03-31', department: 'All', grade: 'All', status: 'In Progress' }
        ],
        kras: [
            { id: 'KRA001', employeeId: 'EMP001', name: 'Software Development', description: 'Deliver high quality code for HRMS', weightage: 60, startDate: '2023-04-01', endDate: '2024-03-31', approvalStatus: 'Approved' },
            { id: 'KRA002', employeeId: 'EMP001', name: 'Team Mentorship', description: 'Guidance to junior developers', weightage: 40, startDate: '2023-04-01', endDate: '2024-03-31', approvalStatus: 'Approved' }
        ],
        kpis: [
            { id: 'KPI1', kraId: 'KRA001', description: 'Bug-free deployment', target: '95', unit: '%', weightage: 50, method: 'Quantitative' }
        ],
        appraisals: [
            {
                id: 'APP001', employeeId: 'EMP001', employeeName: 'John Doe', cycleId: 'FY23-24', stage: 'Manager',
                selfRating: 4.5, selfComments: 'Exceeded targets in HRMS module.',
                managerRating: 4.2, managerComments: 'Excellent work, but needs to work on documentation.',
                strengths: 'Analytical skills, speed', improvementAreas: 'Technical documentation',
                submissionDate: '2024-02-01', promotionalRecommended: false, incrementPercentage: 12
            } as any
        ]
    });

    const tabs = [
        { id: 'cycle', label: 'Cycle Configuration', icon: 'fa-calendar-cog' },
        { id: 'goals', label: 'Goals & KRAs', icon: 'fa-bullseye' },
        { id: 'appraisals', label: 'Appraisal Workspace', icon: 'fa-chart-line' },
        { id: 'reports', label: 'PMS Intelligence', icon: 'fa-file-signature' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'cycle': return <PMSCycleConfig cycles={pmsData.cycles} />;
            case 'goals': return <GoalSetting kras={pmsData.kras} />;
            case 'appraisals': return <AppraisalHub appraisals={pmsData.appraisals} />;
            case 'reports': return <PerformanceReports data={pmsData} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '24px', background: '#f5f7fa', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px', background: 'white', padding: '25px 35px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: '8px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '28px', fontWeight: '800' }}>Performance Management System</h2>
                    <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '15px' }}>Structured evaluation & career progression framework</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ textAlign: 'center', background: '#eef2ff', padding: '10px 20px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                        <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 'bold', display: 'block' }}>ACTIVE CYCLE</span>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>FY 2023-24</span>
                    </div>
                </div>
            </div>

            {/* Sub-Header Navigation */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', background: '#fff', padding: '8px', borderRadius: '16px', width: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '14px 28px',
                            border: 'none',
                            borderRadius: '12px',
                            background: activeTab === tab.id ? '#6366f1' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === tab.id ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none'
                        }}
                    >
                        <i className={`fas ${tab.icon}`} style={{ fontSize: '18px' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dynamic View Area */}
            <div className="pms-view" style={{ animation: 'slideUp 0.4s ease-out' }}>
                {renderContent()}
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default PerformanceMaster;
