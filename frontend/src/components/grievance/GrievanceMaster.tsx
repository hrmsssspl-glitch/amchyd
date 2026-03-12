import React, { useState } from 'react';
import GrievanceRegistration from './GrievanceRegistration';
import GrievanceEnquiryDesk from './GrievanceEnquiryDesk';
import GrievanceActionHub from './GrievanceActionHub';
import GrievanceResolutionDesk from './GrievanceResolutionDesk';
import GrievanceReports from './GrievanceReports';
import { GrievanceData, Grievance } from '../../types/grievance';

const GrievanceMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('registration');

    // Mock Data for demonstration
    const [grievanceData, setGrievanceData] = useState<GrievanceData>({
        grievances: [
            { id: 'GR-2024-001', employeeId: 'EMP001', employeeName: 'John Doe', department: 'Operations', category: 'Work', description: 'Request for better ergonomic equipment', date: '2024-02-01', confidentiality: 'Normal', status: 'Under Review' },
            { id: 'GR-2024-002', employeeId: 'EMP045', employeeName: 'Sarah Smith', department: 'Sales', category: 'Behavior', description: 'Alleged bullying by supervisor', date: '2024-02-05', confidentiality: 'High', status: 'Open' },
            { id: 'GR-2024-003', employeeId: 'EMP089', employeeName: 'Mike Johnson', department: 'IT', category: 'Pay', description: 'Salary discrepancy for January', date: '2024-01-20', confidentiality: 'Normal', status: 'Closed' }
        ],
        enquiries: [
            { grievanceId: 'GR-2024-001', type: 'Internal', committeeMembers: ['HR Manager', 'Ops Head'], startDate: '2024-02-03', findings: 'Needs ergonomic chair upgrade.' }
        ],
        actions: [
            { grievanceId: 'GR-2024-003', actionType: 'Policy Change', description: 'Updated payroll calculation transparency', effectiveDate: '2024-02-01', approvedBy: 'Finance Director' }
        ],
        resolutions: [
            { grievanceId: 'GR-2024-003', status: 'Resolved', closureDate: '2024-01-25', employeeAcceptance: 'Accepted', remarks: 'Issue resolved through adjustment in next pay cycle.' }
        ]
    });

    const tabs = [
        { id: 'registration', label: 'Registration', icon: 'fa-id-badge' },
        { id: 'enquiry', label: 'Enquiry & Committee', icon: 'fa-users' },
        { id: 'action', label: 'Action Taken', icon: 'fa-gavel' },
        { id: 'resolution', label: 'Resolution & Closure', icon: 'fa-check-circle' },
        { id: 'reports', label: 'Grievance Reports', icon: 'fa-chart-pie' }
    ];

    const handleAddGrievance = (newGrievance: Grievance) => {
        setGrievanceData(prev => ({
            ...prev,
            grievances: [newGrievance, ...prev.grievances]
        }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #083344 0%, #164e63 100%)', padding: '30px', borderRadius: '20px', marginBottom: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <i className="fas fa-comments" style={{ marginRight: '15px', color: '#06b6d4' }}></i>
                        Grievance Management System
                    </h1>
                    <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Employee Concern Mechanism & Issue Resolution</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>Active Grievances</div>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{grievanceData.grievances.filter(g => g.status !== 'Closed').length}</div>
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
                            background: activeTab === tab.id ? '#06b6d4' : 'white',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(6, 182, 212, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
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
                {activeTab === 'registration' && <GrievanceRegistration grievances={grievanceData.grievances} onAddGrievance={handleAddGrievance} />}
                {activeTab === 'enquiry' && <GrievanceEnquiryDesk enquiries={grievanceData.enquiries} grievances={grievanceData.grievances} />}
                {activeTab === 'action' && <GrievanceActionHub actions={grievanceData.actions} grievances={grievanceData.grievances} />}
                {activeTab === 'resolution' && <GrievanceResolutionDesk resolutions={grievanceData.resolutions} grievances={grievanceData.grievances} />}
                {activeTab === 'reports' && <GrievanceReports data={grievanceData} />}
            </div>
        </div>
    );
};

export default GrievanceMaster;
