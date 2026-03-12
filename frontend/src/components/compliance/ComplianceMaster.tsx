import React, { useState } from 'react';
import LicenseManagement from './LicenseManagement';
import PFESICReturns from './PFESICReturns';
import StatutoryPayments from './StatutoryPayments';
import LabourComplianceDesk from './LabourComplianceDesk';
import SafetyAccidents from './SafetyAccidents';
import ComplianceAuditDesk from './ComplianceAuditDesk';
import ComplianceReports from './ComplianceReports';
import { ComplianceData, ComplianceLicense } from '../../types/compliance';

const ComplianceMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('licenses');

    // Mock Data for demonstration
    const [complianceData, setComplianceData] = useState<ComplianceData>({
        licenses: [
            { id: 'LIC-001', type: 'Labour', number: 'RL/2024/005', validFrom: '2024-01-01', validTo: '2024-12-31', department: 'Operations', status: 'Active' },
            { id: 'LIC-002', type: 'Trade', number: 'TR/MH/102', validFrom: '2023-06-01', validTo: '2024-06-01', department: 'Admin', status: 'Active' }
        ],
        pfEsicReturns: [
            { employeeId: 'EMP001', employeeName: 'John Doe', pfNumber: 'MH/BAN/12345', returnMonth: 'Jan 2024', pfContribution: 4500, esicNumber: '3124567890', esicContribution: 1250, status: 'Submitted' }
        ],
        statutoryPayments: [
            { employeeId: 'EMP001', employeeName: 'John Doe', ptDeducted: 200, returnMonth: 'Jan 2024', bonusEligible: true, bonusPayable: 15000, bonusStatus: 'Paid' }
        ],
        labourCompliance: [
            { employeeId: 'EMP001', employeeName: 'John Doe', department: 'Operations', contractType: 'Permanent', checklist: ['ID Proof', 'Local Address'], documentSubmitted: true, verifiedBy: 'HR Admin', status: 'Compliant' }
        ],
        contractors: [
            { contractorName: 'Swift Outsourcing Ltd', employeeName: 'Amit Shah', type: 'Outsourced', startDate: '2024-01-01', endDate: '2024-06-30', employeeCount: 25, documentsSubmitted: 'Submitted', status: 'Compliant' }
        ],
        incidents: [
            { employeeId: 'EMP045', employeeName: 'Sarah Smith', date: '2024-02-10', type: 'Minor', location: 'Warehouse Section B', reportingManager: 'Rahul Verma', actionTaken: 'First aid applied, safety goggles mandated.', status: 'Closed' }
        ],
        audits: [
            { id: 'AUD-2024-01', type: 'Safety', period: 'Q1 2024', auditor: 'Safety First Consultants', findings: 'Exit signs missing in south wing.', status: 'Non-Compliant', actionTaken: 'Installed 5 new LED exit signs.', closureDate: '2024-02-15' }
        ]
    });

    const tabs = [
        { id: 'licenses', label: 'License & Reg.', icon: 'fa-id-card' },
        { id: 'returns', label: 'PF & ESIC Returns', icon: 'fa-university' },
        { id: 'payments', label: 'PT & Bonus', icon: 'fa-money-bill-wave' },
        { id: 'labour', label: 'Labour & Contracts', icon: 'fa-hard-hat' },
        { id: 'safety', label: 'Safety & Accidents', icon: 'fa-first-aid' },
        { id: 'audit', label: 'Audit Records', icon: 'fa-clipboard-check' },
        { id: 'reports', label: 'Statutory Reports', icon: 'fa-chart-line' }
    ];

    const handleAddLicense = (newLicense: ComplianceLicense) => {
        setComplianceData(prev => ({
            ...prev,
            licenses: [newLicense, ...prev.licenses]
        }));
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)', padding: '30px', borderRadius: '20px', marginBottom: '30px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px' }}>
                        <i className="fas fa-shield-alt" style={{ marginRight: '15px', color: '#10b981' }}></i>
                        HR Compliance & Statutory Reports
                    </h1>
                    <p style={{ margin: '10px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Regulatory Oversight, Statutory Filings & Safety Governance</p>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '10px 20px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ fontSize: '12px', color: '#34d399' }}>Compliance Score</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#34d399' }}>98%</div>
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
                            background: activeTab === tab.id ? '#10b981' : 'white',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
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
                {activeTab === 'licenses' && <LicenseManagement licenses={complianceData.licenses} onAddLicense={handleAddLicense} />}
                {activeTab === 'returns' && <PFESICReturns returns={complianceData.pfEsicReturns} />}
                {activeTab === 'payments' && <StatutoryPayments payments={complianceData.statutoryPayments} />}
                {activeTab === 'labour' && <LabourComplianceDesk labour={complianceData.labourCompliance} contractors={complianceData.contractors} />}
                {activeTab === 'safety' && <SafetyAccidents incidents={complianceData.incidents} />}
                {activeTab === 'audit' && <ComplianceAuditDesk audits={complianceData.audits} />}
                {activeTab === 'reports' && <ComplianceReports data={complianceData} />}
            </div>
        </div>
    );
};

export default ComplianceMaster;
