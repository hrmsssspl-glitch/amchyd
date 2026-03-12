import React, { useState } from 'react';
import './EmployeeMaster.css';
import PersonalContact from './PersonalContact';
import KYCBank from './KYCBank';
import EmploymentDetails from './EmploymentDetails';
import EducationDetails from './EducationDetails';
import ExperienceDetails from './ExperienceDetails';
import FamilyEmergency from './FamilyEmergency';
import MedicalLanguages from './MedicalLanguages';
import BulkEmployeeUpload from './BulkUpload';
import DocumentUpload from './DocumentUpload';
import CumminsTraining from './CumminsTraining';
import EmployeeReports from './EmployeeReports';
import {
    EmployeeMasterData,
    EmployeeDocuments,
    EmployeeTrainingDetails,
    EmployeePersonalDetails,
    EmployeeContactDetails,
    EmployeeKYCDetails,
    EmployeeBankDetails,
    EmployeeEmploymentDetails,
    Qualification,
    Experience,
    FamilyMember,
    EmergencyContact,
    MedicalDetails,
    LanguageSkills
} from '../../types/employee';
import { BRANCHES } from '../../data/branches';
import { getUserDetails } from '../../auth/authService';
import { employeeStorage } from '../../utils/employeeStorage';

const EmployeeMaster: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [allEmployees, setAllEmployees] = useState<EmployeeMasterData[]>(employeeStorage.getEmployees());

    const initialData: EmployeeMasterData = {
        personal: {
            surname: '',
            name: '',
            fatherName: '',
            motherName: '',
            nationality: 'Indian',
            religion: '',
            dob: '',
            gender: 'Male',
            maritalStatus: 'Single',
            physicalDisabilities: 'None',
            bloodGroup: '',
        },
        contact: {
            personalNumber: '',
            alternateContactNumber: '',
            personalEmail: '',
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
            empNo: '',
            doj: '',
            designation: '',
            department: '',
            branch: '',
            reportingManager: '',
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
        },
        documents: {},
        training: {
            cumminsTrainingType: '',
            trainingCompletedDate: ''
        }
    };

    const [employeeData, setEmployeeData] = useState<EmployeeMasterData>(initialData);

    const steps = [
        { number: 1, label: 'Overview' },
        { number: 2, label: 'Bulk Manage' },
        { number: 3, label: 'Personal & Contact' },
        { number: 4, label: 'KYC & Bank' },
        { number: 5, label: 'Employment' },
        { number: 6, label: 'Education' },
        { number: 7, label: 'Experience' },
        { number: 8, label: 'Family & Emergency' },
        { number: 9, label: 'Medical & Languages' },
        { number: 10, label: 'Docs & Training' },
        { number: 11, label: 'Reports' },
    ];

    const handleNext = () => {
        if (currentStep === 10) {
            const currentUser = getUserDetails();
            const newEmployee = {
                ...employeeData,
                id: employeeData.employment.empNo || `EMP${(allEmployees.length + 1).toString().padStart(3, '0')}`,
                createdDate: new Date().toISOString().split('T')[0],
                createdBy: currentUser ? currentUser.role : 'System'
            };

            const updatedEmployees = [...allEmployees, newEmployee];
            setAllEmployees(updatedEmployees);
            employeeStorage.saveEmployees(updatedEmployees);

            alert(`Employee ${newEmployee.id} saved successfully!`);
            setCurrentStep(11);
            setEmployeeData(initialData);
        } else if (currentStep === 11) {
            setCurrentStep(3);
        } else if (currentStep < 10) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updatePersonal = (d: Partial<EmployeePersonalDetails>) => setEmployeeData(p => ({ ...p, personal: { ...p.personal, ...d } }));
    const updateContact = (d: Partial<EmployeeContactDetails>) => setEmployeeData(p => ({ ...p, contact: { ...p.contact, ...d } }));
    const updateKYC = (d: Partial<EmployeeKYCDetails>) => setEmployeeData(p => ({ ...p, kyc: { ...p.kyc, ...d } }));
    const updateBank = (d: Partial<EmployeeBankDetails>) => setEmployeeData(p => ({ ...p, bank: { ...p.bank, ...d } }));
    const updateEmployment = (d: Partial<EmployeeEmploymentDetails>) => setEmployeeData(p => ({ ...p, employment: { ...p.employment, ...d } }));
    const updateEducation = (d: Qualification[]) => setEmployeeData(p => ({ ...p, education: d }));
    const updateExperience = (d: Experience[]) => setEmployeeData(p => ({ ...p, experience: d }));
    const updateFamily = (d: FamilyMember[]) => setEmployeeData(p => ({ ...p, family: d }));
    const updateEmergency = (d: EmergencyContact[]) => setEmployeeData(p => ({ ...p, emergency: d }));
    const updateMedical = (d: Partial<MedicalDetails>) => setEmployeeData(p => ({ ...p, medical: { ...p.medical, ...d } }));
    const updateLanguages = (d: Partial<LanguageSkills>) => setEmployeeData(p => ({ ...p, languages: { ...p.languages, ...d } }));
    const updateDocuments = (d: Partial<EmployeeDocuments>) => setEmployeeData(p => ({ ...p, documents: { ...p.documents, ...d } }));
    const updateTraining = (d: Partial<EmployeeTrainingDetails>) => setEmployeeData(p => ({ ...p, training: { ...p.training!, ...d } }));

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-section">
                        <h3 className="section-title">Employee Master Dashboard</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                            <div style={{ padding: '25px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ color: '#6366f1', marginBottom: '15px' }}><i className="fas fa-users-cog" style={{ fontSize: '24px' }}></i></div>
                                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Total Workforce</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginTop: '5px' }}>{allEmployees.length}</div>
                            </div>
                            <div style={{ padding: '25px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ color: '#10b981', marginBottom: '15px' }}><i className="fas fa-sitemap" style={{ fontSize: '24px' }}></i></div>
                                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Departments</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginTop: '5px' }}>{new Set(allEmployees.map(e => e.employment.department)).size}</div>
                            </div>
                            <div style={{ padding: '25px', background: 'white', border: '1.5px solid #f1f5f9', borderRadius: '24px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ color: '#f59e0b', marginBottom: '15px' }}><i className="fas fa-map-marker-alt" style={{ fontSize: '24px' }}></i></div>
                                <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Active Branches</div>
                                <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', marginTop: '5px' }}>{new Set(allEmployees.map(e => e.employment.branch)).size}</div>
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '35px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>Module Capabilities</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                        <i className="fas fa-id-card"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>Detailed Profiling</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Comprehensive entry for Personal, KYC, and Bank details.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                        <i className="fas fa-file-excel"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>Bulk Operations</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Import and Export your entire database via CSV.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                        <i className="fas fa-chart-bar"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>Real-time Reporting</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Instant access to filtered reports and documentation audits.</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                        <i className="fas fa-shield-alt"></i>
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', color: '#334155', fontSize: '14px' }}>Data Compliance</div>
                                        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>Automated tracking for training and statutory certificates.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return <BulkEmployeeUpload employees={allEmployees} onImport={(imported) => {
                    const updated = [...allEmployees, ...imported];
                    setAllEmployees(updated);
                    employeeStorage.saveEmployees(updated);
                }} />;
            case 3:
                return <PersonalContact
                    personal={employeeData.personal}
                    contact={employeeData.contact}
                    updatePersonal={updatePersonal}
                    updateContact={updateContact}
                />;
            case 4:
                return <KYCBank
                    kyc={employeeData.kyc}
                    bank={employeeData.bank}
                    updateKYC={updateKYC}
                    updateBank={updateBank}
                />;
            case 5:
                return <EmploymentDetails
                    data={employeeData.employment}
                    updateData={updateEmployment}
                    branches={BRANCHES}
                />;
            case 6:
                return <EducationDetails
                    data={employeeData.education}
                    updateData={updateEducation}
                />;
            case 7:
                return <ExperienceDetails
                    data={employeeData.experience}
                    updateData={updateExperience}
                />;
            case 8:
                return <FamilyEmergency
                    family={employeeData.family}
                    emergency={employeeData.emergency}
                    updateFamily={updateFamily}
                    updateEmergency={updateEmergency}
                />;
            case 9:
                return <MedicalLanguages
                    medical={employeeData.medical}
                    languages={employeeData.languages}
                    updateMedical={updateMedical}
                    updateLanguages={updateLanguages}
                />;
            case 10:
                return (
                    <>
                        <DocumentUpload data={employeeData.documents || {}} updateData={updateDocuments} />
                        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
                        <CumminsTraining data={employeeData.training || { cumminsTrainingType: '', trainingCompletedDate: '' }} updateData={updateTraining} />
                    </>
                );
            case 11:
                return <EmployeeReports employees={allEmployees} onImportClick={() => setCurrentStep(2)} branches={BRANCHES} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="employee-master-container">
            <div className="employee-master-card">
                <div className="employee-master-header">
                    <h2>Employee Master</h2>
                </div>

                <div className="step-indicator" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                            onClick={() => setCurrentStep(step.number)}
                            style={{ minWidth: '120px' }}
                        >
                            <div className="step-number">
                                {currentStep > step.number ? <i className="fas fa-check"></i> : step.number}
                            </div>
                            <div className="step-label">{step.label}</div>
                        </div>
                    ))}
                </div>

                <div className="form-content">
                    {renderStepContent()}

                    {currentStep >= 3 && currentStep <= 10 && (
                        <div className="form-note" style={{
                            marginTop: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#fffbeb',
                            border: '1.5px solid #feebc8',
                            padding: '15px',
                            borderRadius: '10px'
                        }}>
                            <i className="fas fa-info-circle"></i>
                            Note: All details must match official documents.
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleBack}
                        disabled={currentStep === 1 || currentStep === 11}
                    >
                        Previous
                    </button>
                    <button className="btn btn-primary" onClick={handleNext}>
                        {currentStep === 10 ? 'Save & Submit' : currentStep === 11 ? 'Add New Employee' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeMaster;
