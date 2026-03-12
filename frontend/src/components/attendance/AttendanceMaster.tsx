import React, { useState } from 'react';
import '../employee-master/EmployeeMaster.css'; // Reusing layout styles
import AttendanceFlow from './AttendanceFlow';
import LeaveTypesMaster from './LeaveTypesMaster';
import DailyAttendanceForm from './DailyAttendance';
import AttendanceReports from './AttendanceReports';
import { DailyAttendance, AttendanceReportData } from '../../types/attendance';
import { getUserDetails } from '../../auth/authService';

const AttendanceMaster: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const userRole = getUserDetails()?.role || 'employee';
    const isPowerUser = userRole === 'superadmin' || userRole === 'admin' || userRole === 'hr_manager';

    // Dummy Data for Daily Attendance Form
    const [dailyData, setDailyData] = useState<DailyAttendance>({
        id: '1',
        employeeId: '',
        employeeName: '',
        date: new Date().toISOString().split('T')[0],
        inTime: '',
        outTime: '',
        totalWorkingHours: 0,
        shiftName: 'General',
        isLate: false,
        isEarlyEntry: false,
        isEarlyExit: false,
        shortageOfHours: false,
        status: 'Present',
        isCompensatoryWorking: false,
        isCompensatoryOff: false,
        trackingType: 'Manual'
    });

    // Dummy Report Data
    const reportData: AttendanceReportData = {
        daily: [
            { id: '1', employeeId: 'EMP001', employeeName: 'John Doe', date: '2024-02-01', inTime: '09:00', outTime: '18:00', totalWorkingHours: 9, shiftName: 'General', status: 'Present', isLate: false, isEarlyEntry: false, isEarlyExit: false, shortageOfHours: false, isCompensatoryOff: false, isCompensatoryWorking: false, trackingType: 'Manual' },
            { id: '2', employeeId: 'EMP002', employeeName: 'Jane Smith', date: '2024-02-01', inTime: '09:30', outTime: '18:30', totalWorkingHours: 9, shiftName: 'General', status: 'Present', isLate: true, isEarlyEntry: false, isEarlyExit: false, shortageOfHours: false, isCompensatoryOff: false, isCompensatoryWorking: false, trackingType: 'IP-Based', ipAddress: '192.168.1.45' },
        ],
        monthly: [
            { employeeId: 'EMP001', employeeName: 'John Doe', month: 'Jan 2024', presentDays: 22, absentDays: 0, halfDays: 0, leaveDays: 0, payDays: 22, lopDays: 0 },
            { employeeId: 'EMP002', employeeName: 'Jane Smith', month: 'Jan 2024', presentDays: 20, absentDays: 1, halfDays: 0, leaveDays: 1, payDays: 21, lopDays: 1 },
        ],
        lateEarly: [
            { employeeId: 'EMP002', name: 'Jane Smith', date: '2024-02-01', late: true, early: false }
        ],
        extraHours: [],
        leaveBalances: [
            { employeeId: 'EMP001', employeeName: 'John Doe', cl: 10, sl: 10, el: 15, co: 2, total: 37 }
        ],
        compOffs: [],
        exceptions: [],
        unified: [
            {
                id: '1',
                employeeId: 'EMP001',
                employeeName: 'John Doe',
                date: '2024-02-01',
                inTime: '09:00',
                outTime: '18:00',
                totalWorkingHours: 9,
                status: 'Present',
                shiftName: 'General',
                isLate: false,
                isEarlyEntry: false,
                isEarlyExit: false,
                shortageOfHours: false,
                trackingType: 'Manual',
                otHours: 1,
                otAmount: 500,
                clBalance: 10,
                slBalance: 10,
                elBalance: 15,
                coBalance: 2,
                payDaysMonth: 22
            },
            {
                id: '2',
                employeeId: 'EMP002',
                employeeName: 'Jane Smith',
                date: '2024-02-01',
                inTime: '09:30',
                outTime: '18:30',
                totalWorkingHours: 9,
                status: 'Present',
                shiftName: 'General',
                isLate: true,
                isEarlyEntry: false,
                isEarlyExit: false,
                shortageOfHours: false,
                trackingType: 'Geo-Tag',
                latitude: 28.6139,
                longitude: 77.2090,
                locationName: 'HQ Office, Delhi',
                otHours: 0,
                otAmount: 0,
                clBalance: 8,
                slBalance: 12,
                elBalance: 10,
                coBalance: 0,
                payDaysMonth: 21,
                exceptionIssue: 'Late Entry',
                exceptionRemarks: 'Commute delay'
            }
        ]
    };

    const updateDailyData = (data: Partial<DailyAttendance>) => {
        setDailyData({ ...dailyData, ...data });
    };

    const allSteps = [
        { number: 1, label: 'Overview & Flow' },
        { number: 2, label: 'Daily Attendance' },
        { number: 3, label: 'Leave Master', powerOnly: true },
        { number: 4, label: 'Reports', powerOnly: true },
    ];

    const steps = allSteps.filter(step => !step.powerOnly || isPowerUser);

    const renderStepContent = () => {
        // Safety check
        if (!isPowerUser && (currentStep === 3 || currentStep === 4)) {
            return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Access Restricted. Managers only.</div>;
        }

        switch (currentStep) {
            case 1:
                return (
                    <>
                        <div className="form-section">
                            <h3>Attendance Management Overview</h3>
                            <p>Tracks daily attendance, working hours, overtime, and leave, integrated with payroll.</p>
                            {isPowerUser && (
                                <div style={{ marginTop: '10px' }}>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ background: '#4f46e5', color: 'white', border: 'none' }}
                                        onClick={() => setCurrentStep(4)}
                                    >
                                        <i className="fas fa-chart-line"></i> View All Reports
                                    </button>
                                </div>
                            )}
                        </div>
                        <AttendanceFlow />
                    </>
                );
            case 2:
                return <DailyAttendanceForm data={dailyData} updateData={updateDailyData} />;
            case 3:
                return <LeaveTypesMaster />;
            case 4:
                return <AttendanceReports data={reportData} />;
            default:
                return <div>Unknown Step</div>;
        }
    };

    const handleStepClick = (stepNumber: number) => {
        const step = allSteps.find(s => s.number === stepNumber);
        if (step && (!step.powerOnly || isPowerUser)) {
            setCurrentStep(stepNumber);
        }
    };

    return (
        <div className="employee-master-container">
            <div className="employee-master-card">
                <div className="employee-master-header">
                    <h2>Attendance Management</h2>
                </div>

                <div className="step-indicator">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className={`step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                            onClick={() => handleStepClick(step.number)}
                        >
                            <div className="step-number">{currentStep > step.number ? '' : allSteps.indexOf(step) + 1}</div>
                            <div className="step-label">{step.label}</div>
                        </div>
                    ))}
                </div>

                <div className="form-content">
                    {renderStepContent()}
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(prev => {
                        const idx = steps.findIndex(s => s.number === prev);
                        return idx > 0 ? steps[idx - 1].number : prev;
                    })} disabled={currentStep === steps[0].number}>
                        Previous
                    </button>
                    {currentStep !== steps[steps.length - 1].number && (
                        <button className="btn btn-primary" onClick={() => setCurrentStep(prev => {
                            const idx = steps.findIndex(s => s.number === prev);
                            return idx < steps.length - 1 ? steps[idx + 1].number : prev;
                        })}>
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendanceMaster;
