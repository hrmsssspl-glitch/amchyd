import React, { useState } from 'react';
import ProgramMaster from './ProgramMaster';
import NominationCenter from './NominationCenter';
import AssessmentTracker from './AssessmentTracker';
import CertificationVault from './CertificationVault';
import CumminsTrainingSync from './CumminsTrainingSync';
import TrainingReports from './TrainingReports';
import { TrainingData } from '../../types/training';

const TrainingMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('programs');

    // Mock Training Data
    const [trainingData, setTrainingData] = useState<TrainingData>({
        programs: [
            { id: 'TP001', name: 'Advanced React Architecture', type: 'Internal', trainerName: 'Tech Lead', objective: 'Skill', fromDate: '2024-02-15', toDate: '2024-02-17', duration: '3 Days', mode: 'Hybrid', applicableDepartment: 'IT', applicableDesignation: 'SDE', status: 'Planned' },
            { id: 'TP002', name: 'ISO 9001 Compliance', type: 'External', trainerName: 'Safety Audit Corp', objective: 'Compliance', fromDate: '2024-02-10', toDate: '2024-02-10', duration: '6 Hours', mode: 'Classroom', applicableDepartment: 'All', applicableDesignation: 'All', status: 'Completed' }
        ],
        nominations: [
            { id: 'NOM001', employeeId: 'EMP001', employeeName: 'John Doe', department: 'IT', designation: 'SDE-02', programId: 'TP001', programName: 'Advanced React Architecture', nominationDate: '2024-02-05', nominatedBy: 'Manager', approvalStatus: 'Approved' }
        ],
        completions: [
            { employeeId: 'EMP001', programId: 'TP002', attendanceStatus: 'Attended', completionStatus: 'Completed', completionDate: '2024-02-10', examConducted: true, examResult: 'Pass', score: '85%', evaluatedBy: 'Safety Auditor', evaluationDate: '2024-02-11' }
        ],
        certificates: [
            { id: 'CERT001', employeeId: 'EMP001', programId: 'TP002', isBestPerformance: true, certificateNumber: 'CERT-2024-001', issuedDate: '2024-02-12' }
        ],
        cummins: [
            { employeeId: 'EMP001', cumminsId: 'CUM-882', category: 'Product', nominationDate: '2024-01-20', completionStatus: 'Completed', certificationUploaded: true }
        ]
    });

    const tabs = [
        { id: 'programs', label: 'Program Master', icon: 'fa-graduation-cap' },
        { id: 'nominations', label: 'Nominations', icon: 'fa-user-tag' },
        { id: 'assessments', label: 'Attendance & Results', icon: 'fa-clipboard-check' },
        { id: 'certifications', label: 'Certification Vault', icon: 'fa-certificate' },
        { id: 'cummins', label: 'Cummins Sync', icon: 'fa-sync' },
        { id: 'reports', label: 'Reports', icon: 'fa-chart-pie' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'programs': return <ProgramMaster programs={trainingData.programs} />;
            case 'nominations': return <NominationCenter nominations={trainingData.nominations} programs={trainingData.programs} />;
            case 'assessments': return <AssessmentTracker completions={trainingData.completions} programs={trainingData.programs} />;
            case 'certifications': return <CertificationVault certificates={trainingData.certificates} programs={trainingData.programs} />;
            case 'cummins': return <CumminsTrainingSync data={trainingData.cummins} />;
            case 'reports': return <TrainingReports data={trainingData} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '24px', background: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
            {/* Premium Header */}
            <div style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', padding: '35px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '32px', fontWeight: '900', letterSpacing: '-1px' }}>Training & Development Hub</h2>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '16px', fontWeight: '500' }}>Empowering Growth through Structured Learning & Certifications</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: '15px 25px', borderRadius: '18px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <span style={{ fontSize: '12px', opacity: 0.8, display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>Skill Coverage</span>
                        <span style={{ fontSize: '24px', fontWeight: '800' }}>84.5%</span>
                    </div>
                </div>
            </div>

            {/* Glassmorphism Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', background: 'rgba(255,255,255,0.8)', padding: '8px', borderRadius: '20px', width: 'fit-content', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid white' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '14px 24px',
                            border: 'none',
                            borderRadius: '16px',
                            background: activeTab === tab.id ? '#4f46e5' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#64748b',
                            fontWeight: '700',
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            transform: activeTab === tab.id ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: activeTab === tab.id ? '0 10px 15px -3px rgba(79, 70, 229, 0.4)' : 'none'
                        }}
                    >
                        <i className={`fas ${tab.icon}`} style={{ fontSize: '18px' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dynamic Content Area */}
            <div className="training-content" style={{ animation: 'fadeIn 0.6s ease-out' }}>
                {renderContent()}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default TrainingMaster;
