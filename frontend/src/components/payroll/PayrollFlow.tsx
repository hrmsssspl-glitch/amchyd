import React from 'react';

const PayrollFlow: React.FC = () => {
    return (
        <div className="payroll-flow-container" style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
            <h3 style={{ color: '#6366f1', marginBottom: '20px', textAlign: 'center' }}>Payslip Generation Flow</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                <div className="flow-step">
                    <div className="flow-icon" style={{ background: '#e0e7ff', color: '#4f46e5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-fingerprint" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Attendance</div>
                </div>
                <div className="flow-arrow" style={{ color: '#cbd5e1', fontSize: '20px' }}>→</div>

                <div className="flow-step">
                    <div className="flow-icon" style={{ background: '#e0e7ff', color: '#4f46e5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-file-invoice-dollar" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Salary Structure</div>
                </div>
                <div className="flow-arrow" style={{ color: '#cbd5e1', fontSize: '20px' }}>→</div>

                <div className="flow-step">
                    <div className="flow-icon" style={{ background: '#e0e7ff', color: '#4f46e5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-calculator" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Deductions & Statutory</div>
                </div>
                <div className="flow-arrow" style={{ color: '#cbd5e1', fontSize: '20px' }}>→</div>

                <div className="flow-step">
                    <div className="flow-icon" style={{ background: '#e0e7ff', color: '#4f46e5', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-hand-holding-usd" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Net Pay Calculation</div>
                </div>
                <div className="flow-arrow" style={{ color: '#cbd5e1', fontSize: '20px' }}>→</div>

                <div className="flow-step">
                    <div className="flow-icon" style={{ background: '#dcfce7', color: '#16a34a', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-receipt" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Auto Payslip Generation</div>
                </div>
                <div className="flow-arrow" style={{ color: '#cbd5e1', fontSize: '20px' }}>→</div>

                <div className="flow-step">
                    <div className="flow-icon" style={{ background: '#ffedd5', color: '#ea580c', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <i className="fas fa-download" style={{ fontSize: '24px' }}></i>
                    </div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px' }}>Employee / HR Download</div>
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '6px', fontSize: '13px', color: '#64748b' }}>
                <strong>Controls & Rules:</strong>
                <ul style={{ paddingLeft: '20px', margin: '10px 0 0 0' }}>
                    <li>Salary structure defined employee-wise</li>
                    <li>Payroll processed month-wise</li>
                    <li>Payslip auto-generated after payroll lock</li>
                    <li>Only HR/Admin can process payroll</li>
                    <li>Employees can view & download payslip</li>
                    <li>All changes logged (audit trail)</li>
                </ul>
            </div>
        </div>
    );
};

export default PayrollFlow;
