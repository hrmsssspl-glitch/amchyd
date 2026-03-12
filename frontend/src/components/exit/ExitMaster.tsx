import React, { useState } from 'react';
import ExitRegistration from './ExitRegistration';
import ExitInterview from './ExitInterview';
import ClearanceDesk from './ClearanceDesk';
import FnFSettlement from './FnFSettlement';
import ExperienceLetters from './ExperienceLetters';
import ExitReports from './ExitReports';
import { SeparationData, ExitRecord } from '../../types/exit';

const ExitMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('registration');

    // Mock Data for demonstration
    const [separationData, setSeparationData] = useState<SeparationData>({
        exits: [
            { id: 'EMP001', name: 'John Doe', department: 'Operations', designation: 'Sr. Associate', employmentType: 'Permanent', resignationDate: '2024-01-15', lastWorkingDay: '2024-02-15', noticePeriod: 30, exitType: 'Voluntary', status: 'In Process' },
            { id: 'EMP045', name: 'Sarah Smith', department: 'Sales', designation: 'Manager', employmentType: 'Permanent', resignationDate: '2024-02-01', lastWorkingDay: '2024-03-01', noticePeriod: 30, exitType: 'Voluntary', status: 'In Process' },
            { id: 'EMP089', name: 'Mike Johnson', department: 'IT', designation: 'Developer', employmentType: 'Permanent', resignationDate: '2023-12-20', lastWorkingDay: '2024-01-20', noticePeriod: 30, exitType: 'Voluntary', status: 'Closed' }
        ],
        interviews: [
            { employeeId: 'EMP089', interviewDate: '2024-01-18', interviewedBy: 'HR Head', feedback: 'Very positive tenure.', reasonForLeaving: 'Compensation', rejoiningEligibility: 'Yes' }
        ],
        clearances: [
            { employeeId: 'EMP089', asset: 'Completed', payroll: 'Completed', finance: 'Completed', hr: 'Completed', itAdmin: 'Completed', totalStatus: 'Cleared' },
            { employeeId: 'EMP001', asset: 'Pending', payroll: 'Completed', finance: 'Pending', hr: 'Pending', itAdmin: 'Pending', totalStatus: 'Pending' }
        ],
        settlements: [
            { employeeId: 'EMP089', salaryTillLastDay: 45000, leaveEncashment: 12000, gratuity: 0, bonusIncentives: 5000, deductions: 2000, netPayable: 60000, paymentDate: '2024-01-25', status: 'Completed' }
        ],
        letters: [
            { employeeId: 'EMP089', relievingIssued: true, experienceIssued: true, letterDate: '2024-01-20', letterReference: 'REL/2024/001' }
        ]
    });

    const tabs = [
        { id: 'registration', label: 'Exit Master', icon: 'fa-user-minus' },
        { id: 'interview', label: 'Exit Interview', icon: 'fa-comments-alt' },
        { id: 'clearance', label: 'No Dues Clearance', icon: 'fa-file-signature' },
        { id: 'ff', label: 'F&F Settlement', icon: 'fa-calculator' },
        { id: 'letters', label: 'Relieving Letters', icon: 'fa-certificate' },
        { id: 'reports', label: 'Separation Reports', icon: 'fa-chart-bar' }
    ];

    const handleAddExit = (newExit: ExitRecord) => {
        setSeparationData(prev => ({
            ...prev,
            exits: [newExit, ...prev.exits]
        }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', padding: '30px', borderRadius: '20px', marginBottom: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <i className="fas fa-door-open" style={{ marginRight: '15px', color: '#f43f5e' }}></i>
                        Separation & Exit Management
                    </h1>
                    <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Offboarding Governance, Clearance & Final Settlement</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>Active Exits</div>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{separationData.exits.filter(e => e.status !== 'Closed').length}</div>
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
                            background: activeTab === tab.id ? '#f43f5e' : 'white',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(244, 63, 94, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
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
                {activeTab === 'registration' && <ExitRegistration exits={separationData.exits} onAddExit={handleAddExit} />}
                {activeTab === 'interview' && <ExitInterview interviews={separationData.interviews} exits={separationData.exits} />}
                {activeTab === 'clearance' && <ClearanceDesk clearances={separationData.clearances} exits={separationData.exits} />}
                {activeTab === 'ff' && <FnFSettlement settlements={separationData.settlements} exits={separationData.exits} />}
                {activeTab === 'letters' && <ExperienceLetters letters={separationData.letters} exits={separationData.exits} />}
                {activeTab === 'reports' && <ExitReports data={separationData} />}
            </div>
        </div>
    );
};

export default ExitMaster;
