import React, { useState } from 'react';
import CompanyDetails from './CompanyDetails';
import BranchMaster from './BranchMaster';
import DeptDesigMaster from './DeptDesigMaster';
import LeaveTypeConfigMaster from './LeaveTypeConfigMaster';
import OrgReports from './OrgReports';
import { OrganizationData } from '../../types/organization';

const OrganizationMaster: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [orgData, setOrgData] = useState<OrganizationData>({
        company: {
            companyName: 'Srinivasa Sales and Service Pvt. Ltd.',
            companyCode: 'SSSPL001',
            cinGst: 'U12345DL2023PTC123456 / 07AAAAA0000A1Z5',
            registeredAddress: '123, Registered Plaza, New Delhi, 110001',
            corporateAddress: '456, Corporate Tower, Noida, UP, 201301',
            contactEmail: 'info@ssspl.com',
            contactPhone: '+91-11-23456789',
            establishmentYear: '2023',
            industryType: 'Services',
            panNumber: 'ABCDE1234F',
            websiteUrl: 'www.ssspl.com'
        },
        branches: [
            // Andhra Pradesh
            { id: '1', branchName: 'Vijayawada (Head Office)', branchCode: 'BR-AP-01', state: 'Andhra Pradesh', city: 'Vijayawada', address: 'Head Office', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap01@ssspl.com', operationalSince: '2023', unitType: 'Head Office', capacity: 500, gstNumber: '37AAAAA0000A1Z1', status: 'Active' },
            { id: '2', branchName: 'Autonagar', branchCode: 'BR-AP-02', state: 'Andhra Pradesh', city: 'Vijayawada', address: 'Autonagar', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap02@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z2', status: 'Active' },
            { id: '3', branchName: 'Bhimavaram', branchCode: 'BR-AP-03', state: 'Andhra Pradesh', city: 'Bhimavaram', address: 'Bhimavaram', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap03@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z3', status: 'Active' },
            { id: '4', branchName: 'Chimakuruthy', branchCode: 'BR-AP-04', state: 'Andhra Pradesh', city: 'Chimakuruthy', address: 'Chimakuruthy', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap04@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z4', status: 'Active' },
            { id: '5', branchName: 'Gajwaka', branchCode: 'BR-AP-05', state: 'Andhra Pradesh', city: 'Visakhapatnam', address: 'Gajwaka', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap05@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z5', status: 'Active' },
            { id: '6', branchName: 'Guntur', branchCode: 'BR-AP-06', state: 'Andhra Pradesh', city: 'Guntur', address: 'Guntur', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap06@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z6', status: 'Active' },
            { id: '7', branchName: 'Kakinada', branchCode: 'BR-AP-07', state: 'Andhra Pradesh', city: 'Kakinada', address: 'Kakinada', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap07@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z7', status: 'Active' },
            { id: '8', branchName: 'Rajahmundry', branchCode: 'BR-AP-08', state: 'Andhra Pradesh', city: 'Rajahmundry', address: 'Rajahmundry', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap08@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z8', status: 'Active' },
            { id: '9', branchName: 'Srikakulam', branchCode: 'BR-AP-09', state: 'Andhra Pradesh', city: 'Srikakulam', address: 'Srikakulam', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap09@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A1Z9', status: 'Active' },
            { id: '10', branchName: 'Tekkali', branchCode: 'BR-AP-10', state: 'Andhra Pradesh', city: 'Tekkali', address: 'Tekkali', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap10@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A110', status: 'Active' },
            { id: '11', branchName: 'Vishakapatnam', branchCode: 'BR-AP-11', state: 'Andhra Pradesh', city: 'Visakhapatnam', address: 'Vishakapatnam', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap11@ssspl.com', operationalSince: '2023', unitType: 'Regional Office', capacity: 100, gstNumber: '37AAAAA0000A111', status: 'Active' },
            { id: '12', branchName: 'Vijayanagaram', branchCode: 'BR-AP-12', state: 'Andhra Pradesh', city: 'Vijayanagaram', address: 'Vijayanagaram', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap12@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A112', status: 'Active' },
            { id: '13', branchName: 'KADAPA', branchCode: 'BR-AP-13', state: 'Andhra Pradesh', city: 'Kadapa', address: 'Kadapa', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap13@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A113', status: 'Active' },
            { id: '14', branchName: 'Kurnool', branchCode: 'BR-AP-14', state: 'Andhra Pradesh', city: 'Kurnool', address: 'Kurnool', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap14@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A114', status: 'Active' },
            { id: '15', branchName: 'Ananthapur', branchCode: 'BR-AP-15', state: 'Andhra Pradesh', city: 'Ananthapur', address: 'Ananthapur', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap15@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A115', status: 'Active' },
            { id: '16', branchName: 'Tirupathi', branchCode: 'BR-AP-16', state: 'Andhra Pradesh', city: 'Tirupathi', address: 'Tirupathi', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap16@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A116', status: 'Active' },
            { id: '17', branchName: 'Chittor', branchCode: 'BR-AP-17', state: 'Andhra Pradesh', city: 'Chittor', address: 'Chittor', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap17@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A117', status: 'Active' },
            { id: '18', branchName: 'Nellore', branchCode: 'BR-AP-18', state: 'Andhra Pradesh', city: 'Nellore', address: 'Nellore', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap18@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A118', status: 'Active' },
            { id: '19', branchName: 'Kothagudem', branchCode: 'BR-AP-19', state: 'Andhra Pradesh', city: 'Kothagudem', address: 'Kothagudem', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ap19@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '37AAAAA0000A119', status: 'Active' },

            // Telangana
            { id: '20', branchName: 'Hyderabad', branchCode: 'BR-TS-01', state: 'Telangana', city: 'Hyderabad', address: 'Hyderabad', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts01@ssspl.com', operationalSince: '2023', unitType: 'Regional Office', capacity: 200, gstNumber: '36AAAAA0000A1Z1', status: 'Active' },
            { id: '21', branchName: 'Karimnagar', branchCode: 'BR-TS-02', state: 'Telangana', city: 'Karimnagar', address: 'Karimnagar', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts02@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z2', status: 'Active' },
            { id: '22', branchName: 'Khammam', branchCode: 'BR-TS-03', state: 'Telangana', city: 'Khammam', address: 'Khammam', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts03@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z3', status: 'Active' },
            { id: '23', branchName: 'Nalgonda', branchCode: 'BR-TS-04', state: 'Telangana', city: 'Nalgonda', address: 'Nalgonda', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts04@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z4', status: 'Active' },
            { id: '24', branchName: 'Nizamabad', branchCode: 'BR-TS-05', state: 'Telangana', city: 'Nizamabad', address: 'Nizamabad', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts05@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z5', status: 'Active' },
            { id: '25', branchName: 'Warangal', branchCode: 'BR-TS-06', state: 'Telangana', city: 'Warangal', address: 'Warangal', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts06@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z6', status: 'Active' },
            { id: '26', branchName: 'Mahaboobnagar', branchCode: 'BR-TS-07', state: 'Telangana', city: 'Mahaboobnagar', address: 'Mahaboobnagar', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts07@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z7', status: 'Active' },
            { id: '27', branchName: 'Ramagundam', branchCode: 'BR-TS-08', state: 'Telangana', city: 'Ramagundam', address: 'Ramagundam', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts08@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z8', status: 'Active' },
            { id: '28', branchName: 'Uppal', branchCode: 'BR-TS-09', state: 'Telangana', city: 'Hyderabad', address: 'Uppal', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts09@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A1Z9', status: 'Active' },
            { id: '29', branchName: 'Balanagar', branchCode: 'BR-TS-10', state: 'Telangana', city: 'Hyderabad', address: 'Balanagar', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts10@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A110', status: 'Active' },
            { id: '30', branchName: 'Hyderguda', branchCode: 'BR-TS-11', state: 'Telangana', city: 'Hyderabad', address: 'Hyderguda', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts11@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A111', status: 'Active' },
            { id: '31', branchName: 'Katedan', branchCode: 'BR-TS-12', state: 'Telangana', city: 'Hyderabad', address: 'Katedan', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts12@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A112', status: 'Active' },
            { id: '32', branchName: 'Suryapet', branchCode: 'BR-TS-13', state: 'Telangana', city: 'Suryapet', address: 'Suryapet', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts13@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A113', status: 'Active' },
            { id: '33', branchName: 'Peddamberpet', branchCode: 'BR-TS-14', state: 'Telangana', city: 'Hyderabad', address: 'Peddamberpet', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts14@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A114', status: 'Active' },
            { id: '34', branchName: 'Jadcherla', branchCode: 'BR-TS-15', state: 'Telangana', city: 'Jadcherla', address: 'Jadcherla', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts15@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A115', status: 'Active' },
            { id: '35', branchName: 'Shamshabad', branchCode: 'BR-TS-16', state: 'Telangana', city: 'Hyderabad', address: 'Shamshabad', contactPerson: 'Admin', contactNumber: '0000000000', emailId: 'ts16@ssspl.com', operationalSince: '2023', unitType: 'Branch Office', capacity: 100, gstNumber: '36AAAAA0000A116', status: 'Active' }
        ],
        departments: [
            { id: '1', state: 'Andhra Pradesh', branch: 'Vijayawada (Head Office)', branchCode: 'BR-AP-01', departmentName: 'SALES DEPARTMENT', subDepartment: 'Regional Sales Manager', departmentCode: 'SD01', gradeLevel: 'L3', reportingHierarchy: 'Sales Head', location: 'Vijayawada (Head Office)', status: 'Active' }
        ],
        designations: [] // Merged into departments
    });

    React.useEffect(() => {
        const fetchOrganizationData = async () => {
            try {
                const res = await fetch('/api/organization/company');
                const data = await res.json();
                if (data && Object.keys(data).length > 0) {
                    setOrgData(prev => ({ ...prev, company: data }));
                }
            } catch (err) {
                console.error("Failed to fetch organization data", err);
            }
        };
        fetchOrganizationData();
    }, []);

    const steps = [
        { id: 1, title: 'Company Details', icon: 'fa-building' },
        { id: 2, title: 'Branch Master', icon: 'fa-map-marker-alt' },
        { id: 3, title: 'Dept & Designation', icon: 'fa-users-cog' },
        { id: 4, title: 'Leave Types', icon: 'fa-calendar-alt' },
        { id: 5, title: 'Reports', icon: 'fa-chart-pie' }
    ];

    const renderStep = () => {
        switch (currentStep) {
            case 1: return <CompanyDetails data={orgData.company} updateData={(val: any) => setOrgData({ ...orgData, company: { ...orgData.company, ...val } })} />;
            case 2: return <BranchMaster data={orgData.branches} updateData={(val: any) => setOrgData({ ...orgData, branches: val })} />;
            case 3: return (
                <DeptDesigMaster
                    deptData={orgData.departments}
                    updateDeptData={(val) => setOrgData({ ...orgData, departments: val })}
                    branches={orgData.branches}
                />
            );
            case 4: return <LeaveTypeConfigMaster />;
            case 5: return <OrgReports data={orgData} />;
            default: return null;
        }
    };

    return (
        <div className="module-container" style={{ padding: '20px', background: '#f0f2f5', minHeight: 'calc(100vh - 80px)' }}>
            {/* Header */}
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div>
                    <h2 style={{ margin: 0, color: '#1e293b', fontSize: '24px' }}>Organization Master</h2>
                    <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Configure company, branches, and departments</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" style={{ background: '#4f46e5', color: 'white', border: 'none' }} onClick={() => setCurrentStep(5)}>
                        <i className="fas fa-chart-line"></i> View Summary
                    </button>
                </div>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', background: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '20px', overflowX: 'auto' }}>
                {steps.map((step) => (
                    <div
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            cursor: 'pointer',
                            padding: '10px',
                            borderBottom: currentStep === step.id ? '3px solid #4f46e5' : '3px solid transparent',
                            color: currentStep === step.id ? '#4f46e5' : '#64748b',
                            transition: 'all 0.3s ease',
                            minWidth: '120px'
                        }}
                    >
                        <i className={`fas ${step.icon}`} style={{ fontSize: '20px', marginBottom: '8px' }}></i>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>{step.title}</span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="step-content">
                {renderStep()}
            </div>

            {/* Navigation Buttons */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button
                    className="btn btn-secondary"
                    disabled={currentStep === 1}
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    style={{ padding: '10px 25px' }}
                >
                    <i className="fas fa-arrow-left"></i> Previous
                </button>
                {currentStep < 5 && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        style={{ padding: '10px 25px', background: '#4f46e5' }}
                    >
                        Next <i className="fas fa-arrow-right"></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrganizationMaster;
