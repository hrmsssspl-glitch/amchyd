import React, { useState } from 'react';
import CaseRegistration from './CaseRegistration';
import ShowCauseNoticeDesk from './ShowCauseNoticeDesk';
import EnquiryEnclosure from './EnquiryEnclosure';
import DisciplinaryActionHub from './DisciplinaryActionHub';
import DisciplinaryReports from './DisciplinaryReports';
import { DisciplinaryData, DisciplinaryCase, ShowCauseNotice, EnquiryDetails } from '../../types/disciplinary';

const DisciplinaryMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('cases');

    // Mock Data for demonstration
    const [disciplinaryData, setDisciplinaryData] = useState<DisciplinaryData>({
        cases: [
            { id: 'DC-2024-001', employeeId: 'EMP001', employeeName: 'John Doe', department: 'Operations', complaintSource: 'Manager', description: 'Repeated unauthorized absences', complaintDate: '2024-02-01', severity: 'Major', status: 'Under Enquiry' },
            { id: 'DC-2024-002', employeeId: 'EMP045', employeeName: 'Sarah Smith', department: 'Sales', complaintSource: 'Internal', description: 'Misuse of company property', complaintDate: '2024-02-05', severity: 'Minor', status: 'Open' },
            { id: 'DC-2024-003', employeeId: 'EMP089', employeeName: 'Mike Johnson', department: 'IT', complaintSource: 'HR', description: 'Data breach protocol violation', complaintDate: '2024-01-20', severity: 'Critical', status: 'Closed' }
        ],
        notices: [
            { noticeNo: 'SCN-001', caseId: 'DC-2024-001', issueDate: '2024-02-02', responseDueDate: '2024-02-05', responseStatus: 'Submitted', hrRemarks: 'Awaiting committee review' }
        ],
        enquiries: [
            { caseId: 'DC-2024-001', type: 'Domestic', committeeMembers: ['HR Head', 'Legal Counsel'], startDate: '2024-02-06', findings: 'Evidence supports the complaint.' }
        ],
        actions: [
            { caseId: 'DC-2024-003', actionType: 'Suspension', description: '15-day suspension without pay', effectiveFrom: '2024-01-25', effectiveTo: '2024-02-09', approvalBy: 'Management' }
        ]
    });

    const tabs = [
        { id: 'cases', label: 'Case Registration', icon: 'fa-folder-plus' },
        { id: 'notices', label: 'Show Cause Notices', icon: 'fa-file-invoice' },
        { id: 'enquiry', label: 'Enquiry & Minutes', icon: 'fa-user-tie' },
        { id: 'action', label: 'Action & Closure', icon: 'fa-gavel' },
        { id: 'reports', label: 'Disciplinary Reports', icon: 'fa-chart-bar' }
    ];

    const handleAddCase = (newCase: DisciplinaryCase) => {
        setDisciplinaryData(prev => ({
            ...prev,
            cases: [newCase, ...prev.cases]
        }));
    };

    const handleAddNotice = (newNotice: ShowCauseNotice) => {
        setDisciplinaryData(prev => ({
            ...prev,
            notices: [newNotice, ...prev.notices]
        }));
    };

    const handleAddEnquiry = (newEnquiry: EnquiryDetails) => {
        setDisciplinaryData(prev => ({
            ...prev,
            enquiries: [newEnquiry, ...prev.enquiries],
            cases: prev.cases.map(c => c.id === newEnquiry.caseId ? { ...c, status: 'Under Enquiry' } : c)
        }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '30px', borderRadius: '20px', marginBottom: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <i className="fas fa-balance-scale" style={{ marginRight: '15px', color: '#f97316' }}></i>
                        Disciplinary Management System
                    </h1>
                    <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Corporate Governance & Employee Conduct Oversight</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', opacity: 0.7 }}>Active Cases</div>
                        <div style={{ fontSize: '20px', fontWeight: 700 }}>{disciplinaryData.cases.filter(c => c.status !== 'Closed').length}</div>
                    </div>
                    <div style={{ background: 'rgba(249, 115, 22, 0.2)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                        <div style={{ fontSize: '12px', color: '#fb923c' }}>Critical Severity</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#fb923c' }}>{disciplinaryData.cases.filter(c => c.severity === 'Critical' && c.status !== 'Closed').length}</div>
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
                            background: activeTab === tab.id ? '#f97316' : 'white',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(249, 115, 22, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
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
                {activeTab === 'cases' && <CaseRegistration cases={disciplinaryData.cases} onAddCase={handleAddCase} />}
                {activeTab === 'notices' && <ShowCauseNoticeDesk notices={disciplinaryData.notices} cases={disciplinaryData.cases} onAddNotice={handleAddNotice} />}
                {activeTab === 'enquiry' && <EnquiryEnclosure enquiries={disciplinaryData.enquiries} cases={disciplinaryData.cases} onAddEnquiry={handleAddEnquiry} />}
                {activeTab === 'action' && <DisciplinaryActionHub actions={disciplinaryData.actions} cases={disciplinaryData.cases} />}
                {activeTab === 'reports' && <DisciplinaryReports data={disciplinaryData} />}
            </div>
        </div>
    );
};

export default DisciplinaryMaster;
