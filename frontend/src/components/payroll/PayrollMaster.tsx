import React, { useState } from 'react';
import '../employee-master/EmployeeMaster.css'; // Reusing existing CSS
import SalaryStructure from './SalaryStructure';
import PayrollProcessingComponent from './PayrollProcessing';
import StatutoryDeductionsComponent from './StatutoryDeductions';
import PayslipView from './PayslipView';
import PayrollFlow from './PayrollFlow';
import PayrollReports from './PayrollReports';
import { PayrollData } from '../../types/payroll';

const PayrollMaster: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [payrollData, setPayrollData] = useState<PayrollData>({
        structure: {
            employeeId: '',
            employeeName: '',
            ctc: 0,
            grossSalary: 0,
            basicSalary: 0,
            hra: 0,
            specialAllowance: 0,
            conveyanceAllowance: 0,
            medicalAllowance: 0,
            otherAllowances: 0,
            groupHealthInsurance: 0,
            groupAccidentalInsurance: 0,
            travelReimbursementEligibility: false,
            bonusEligibility: false,
            incentiveEligibility: false,
            gratuityEligibility: false,
            pfEligibility: false,
            professionalTaxEligibility: false,
            incomeTaxEligibility: false,
            tdsEligibility: false,
            esiEligibility: false,
            shortPaidLastMonth: 0,
            excessPaidLastMonth: 0,
            arrears: 0,
            salaryAdvance: 0,
        },
        processing: {
            employeeId: '',
            employeeName: '',
            salaryMonth: '',
            payDays: 0,
            lopDays: 0,
            grossSalary: 0,
            totalDeductions: 0,
            netPay: 0,
            paymentMode: 'Bank',
            bankAccountNumber: '',
            ifscCode: '',
            branchName: '',
            branchAddress: '',
            aadhaarNumber: '',
            panNumber: '',
            uanNumber: '',
            pfNumber: '',
            esiNumber: '',
        },
        deductions: {
            pfEmployee: 0,
            pfEmployer: 0,
            esiEmployee: 0,
            esiEmployer: 0,
            professionalTax: 0,
            incomeTax: 0,
            tds: 0,
            labourWelfareFund: 0,
            salaryAdvanceRecovery: 0,
            tourAdvanceRecovery: 0,
            medicalAdvanceRecovery: 0,
            festivalAdvanceRecovery: 0,
            excessPaidRecovery: 0,
            groupHealthInsuranceEmployee: 0,
            groupAccidentalInsuranceEmployee: 0,
        }
    });

    const steps = [
        { number: 1, label: 'Overview' },
        { number: 2, label: 'Payroll Flow' },
        { number: 3, label: 'Salary Structure' },
        { number: 4, label: 'Payroll Processing' },
        { number: 5, label: 'Statutory Deductions' },
        { number: 6, label: 'Payslip View' },
        { number: 7, label: 'Reports' },
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            console.log('Final Payroll Data:', payrollData);
            alert('Payroll data processed successfully!');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateStructure = (data: Partial<PayrollData['structure']>) => {
        setPayrollData({ ...payrollData, structure: { ...payrollData.structure, ...data } });
    };

    const updateProcessing = (data: Partial<PayrollData['processing']>) => {
        setPayrollData({ ...payrollData, processing: { ...payrollData.processing, ...data } });
    };

    const updateDeductions = (data: Partial<PayrollData['deductions']>) => {
        setPayrollData({ ...payrollData, deductions: { ...payrollData.deductions, ...data } });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-section">
                        <h3>Payroll & Compensation Overview</h3>
                        <p>Automated salary processing with system-generated payslips, statutory compliance, and reports.</p>
                        <div className="form-note">
                            Please proceed to define Salary Structure or Process Monthly Payroll.
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button
                                className="btn btn-primary"
                                onClick={() => setCurrentStep(7)}
                            >
                                <i className="fas fa-chart-line"></i> View All Reports
                            </button>
                        </div>
                    </div>
                );
            case 2:
                return <PayrollFlow />;
            case 3:
                return <SalaryStructure data={payrollData.structure} updateData={updateStructure} />;
            case 4:
                return <PayrollProcessingComponent data={payrollData.processing} updateData={updateProcessing} />;
            case 5:
                return <StatutoryDeductionsComponent data={payrollData.deductions} updateData={updateDeductions} />;
            case 6:
                return <PayslipView data={payrollData} />;
            case 7:
                return <PayrollReports />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    return (
        <div className="employee-master-container">
            <div className="employee-master-card">
                <div className="employee-master-header">
                    <h2>Payroll & Compensation</h2>
                </div>

                <div className="step-indicator">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                            onClick={() => setCurrentStep(step.number)}
                        >
                            <div className="step-number">{currentStep > step.number ? '' : step.number}</div>
                            <div className="step-label">{step.label}</div>
                        </div>
                    ))}
                </div>

                <div className="form-content">
                    {renderStepContent()}
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={handleBack} disabled={currentStep === 1}>
                        Previous
                    </button>
                    {currentStep === steps.length ? (
                        <button className="btn btn-primary" onClick={handleNext}>Print / Email</button>
                    ) : (
                        <button className="btn btn-primary" onClick={handleNext}>Next</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayrollMaster;
