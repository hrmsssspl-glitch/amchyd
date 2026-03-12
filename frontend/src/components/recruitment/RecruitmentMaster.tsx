import React, { useState } from 'react';
import { Candidate, RecruitmentData } from '../../types/recruitment';
import CandidatePipeline from './CandidatePipeline';
import InterviewPanel from './InterviewPanel';
import OfferStation from './OfferStation';
import OnboardingWorkflow from './OnboardingWorkflow';
import RecruitmentReports from './RecruitmentReports';
import { employeeStorage } from '../../utils/employeeStorage';
import { EmployeeMasterData } from '../../types/employee';

const RecruitmentMaster: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pipeline');

    // Mock Data for Recruitment
    const [recData, setRecData] = useState<RecruitmentData>({
        candidates: [
            {
                id: 'C001', name: 'Alice Smith', email: 'alice@example.com', phone: '9876543210',
                experience: 5, relevantExperience: 4, source: 'Portal', currentCompany: 'Tech Corp',
                currentCTC: 1200000, expectedCTC: 1500000, jobCode: 'SDE-02', status: 'Selected',
                idProofs: ['Aadhar', 'PAN']
            },
            {
                id: 'C002', name: 'Bob Wilson', email: 'bob@example.com', phone: '8765432109',
                experience: 3, relevantExperience: 3, source: 'Referral', currentCompany: 'Soft Solutions',
                currentCTC: 800000, expectedCTC: 1000000, jobCode: 'SDE-01', status: 'Interview Scheduled',
                idProofs: ['Aadhar']
            }
        ],
        interviews: [
            { candidateId: 'C001', interviewDate: '2024-02-01', panel: ['HR Head', 'Tech Lead'], status: 'Cleared', remarks: 'Good technical skills', selectionStatus: 'Selected' }
        ],
        offers: [
            { candidateId: 'C001', employeeId: 'EMP245', offeredSalary: 1400000, hikePercentage: 16.6, expectedDOJ: '2024-03-01', issueDate: '2024-02-05', status: 'Accepted' }
        ],
        checklists: [
            {
                candidateId: 'C001', offerAccepted: true, appointmentLetterIssued: true, idProofSubmitted: true,
                qualificationCertificates: true, experienceCertificate: true, paySlips: true, bankStatement: true,
                addressProof: true, bankDetails: true, pfEsiDeclaration: true, inductionCompleted: false,
                uniformIssued: false, safetyKitIssued: false, idCardIssued: false
            }
        ]
    });

    const handleActivateEmployee = (candidateId: string) => {
        const candidate = recData.candidates.find(c => c.id === candidateId);
        const offer = recData.offers.find(o => o.candidateId === candidateId);

        if (!candidate || !offer) {
            alert('Candidate or Offer details not found!');
            return;
        }

        // Check if already exists in storage to avoid duplicates
        const existing = employeeStorage.getEmployees();
        if (existing.find(e => e.id === offer.employeeId)) {
            alert('This employee is already activated in the Master database!');
            return;
        }

        // Transform Recruitment Data to Employee Master Data
        const newEmployee: EmployeeMasterData = {
            id: offer.employeeId,
            createdDate: new Date().toISOString().split('T')[0],
            createdBy: 'Recruitment Module',
            personal: {
                surname: '',
                name: candidate.name,
                fatherName: '',
                motherName: '',
                nationality: 'Indian',
                religion: '',
                dob: '1990-01-01', // Default
                gender: 'Male', // Default
                maritalStatus: 'Single',
                physicalDisabilities: 'None',
                bloodGroup: '',
            },
            contact: {
                personalNumber: candidate.phone,
                alternateContactNumber: '',
                personalEmail: candidate.email,
                officialEmail: '',
                presentAddress: '',
                permanentAddress: '',
                permanentAddressContactNumber: '',
            },
            kyc: {
                panNo: '',
                aadharNo: '',
                drivingLicenseNo: '',
            },
            employment: {
                empNo: offer.employeeId,
                doj: offer.expectedDOJ,
                designation: candidate.jobCode,
                department: candidate.jobCode.includes('SDE') ? 'TECHNOLOGY' : 'OPERATIONS',
                branch: 'Pune',
                reportingManager: 'HR Manager',
                rolls: 'On Roll',
            },
            bank: {
                bankName: '',
                accountNo: '',
                branch: '',
                ifscCode: '',
            },
            education: [],
            experience: [],
            family: [],
            emergency: [],
            medical: {
                allergic: '',
                bloodPressure: '',
                sugar: '',
                eyeSight: '',
                majorIllness: '',
            },
            languages: {
                telugu: false,
                english: false,
                hindi: false,
            }
        };

        employeeStorage.addEmployee(newEmployee);

        // Update candidate status to 'Joined'
        setRecData({
            ...recData,
            candidates: recData.candidates.map(c => c.id === candidateId ? { ...c, status: 'Joined' } : c)
        });

        alert(`Successfully activated ${candidate.name} (ID: ${offer.employeeId}) in Employee Master!`);
    };

    const tabs = [
        { id: 'pipeline', label: 'Candidate Pipeline', icon: 'fa-users-rays' },
        { id: 'interviews', label: 'Interview Tracking', icon: 'fa-calendar-check' },
        { id: 'offers', label: 'Offer Management', icon: 'fa-envelope-open-text' },
        { id: 'onboarding', label: 'Onboarding Helpdesk', icon: 'fa-user-check' },
        { id: 'reports', label: 'Analytics & Reports', icon: 'fa-chart-histogram' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'pipeline': return <CandidatePipeline candidates={recData.candidates} setCandidates={(c: Candidate[]) => setRecData({ ...recData, candidates: c })} />;
            case 'interviews': return <InterviewPanel data={recData} />;
            case 'offers': return <OfferStation data={recData} />;
            case 'onboarding': return <OnboardingWorkflow data={recData} onActivate={handleActivateEmployee} />;
            case 'reports': return <RecruitmentReports data={recData} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '24px', background: '#f0f4f8', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header Area */}
            <div style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px' }}>Recruitment & Onboarding Excellence</h2>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.8, fontSize: '15px' }}>Acquire talent and streamline the joining journey</p>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div className="stat-pill" style={{ background: 'rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <span style={{ fontSize: '11px', display: 'block', textTransform: 'uppercase', opacity: 0.6 }}>Active Requisitions</span>
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>12 Open Jobs</span>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', background: '#e2e8f0', padding: '8px', borderRadius: '16px', width: 'fit-content' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '12px',
                            background: activeTab === tab.id ? '#4f46e5' : 'transparent',
                            color: activeTab === tab.id ? 'white' : '#475569',
                            fontWeight: '700',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: activeTab === tab.id ? '0 4px 6px -1px rgba(79, 70, 229, 0.3)' : 'none'
                        }}
                    >
                        <i className={`fas ${tab.icon}`} style={{ fontSize: '16px' }}></i>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Dynamic Content */}
            <div className="recruitment-content" style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                {renderContent()}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default RecruitmentMaster;
