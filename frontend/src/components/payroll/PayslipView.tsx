import React from 'react';
import { PayrollData } from '../../types/payroll';

interface PayslipViewProps {
    data: PayrollData;
}

const PayslipView: React.FC<PayslipViewProps> = ({ data }) => {
    const { structure, processing, deductions } = data;

    const totalEarnings = (structure.basicSalary || 0) + (structure.hra || 0) + (structure.specialAllowance || 0) +
        (structure.conveyanceAllowance || 0) + (structure.medicalAllowance || 0) + (structure.otherAllowances || 0);

    const totalDeductions = (deductions.pfEmployee || 0) + (deductions.esiEmployee || 0) + (deductions.professionalTax || 0) +
        (deductions.incomeTax || 0) + (deductions.tds || 0) + (deductions.salaryAdvanceRecovery || 0) +
        (deductions.groupHealthInsuranceEmployee || 0);

    const netPay = totalEarnings - totalDeductions;

    return (
        <div className="form-section">
            <div className="payslip-container" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                <h2 style={{ textAlign: 'center', color: '#333' }}>MP HRMS - PAYSLIP</h2>
                <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>For the month of {processing.salaryMonth || 'MM-YYYY'}</h4>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <tbody>
                        <tr>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Employee ID:</td>
                            <td>{structure.employeeId}</td>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Name:</td>
                            <td>{structure.employeeName || processing.employeeName}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Department:</td>
                            <td>IT (Demo)</td>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Designation:</td>
                            <td>Developer (Demo)</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>PAN:</td>
                            <td>{processing.panNumber}</td>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Bank Account:</td>
                            <td>{processing.bankAccountNumber}</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>Pay Days:</td>
                            <td>{processing.payDays}</td>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>LOP Days:</td>
                            <td>{processing.lopDays}</td>
                        </tr>
                    </tbody>
                </table>

                <div style={{ display: 'flex', borderTop: '2px solid #333', borderBottom: '2px solid #333' }}>
                    <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '10px' }}>
                        <h4 style={{ textDecoration: 'underline' }}>EARNINGS</h4>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr><td>Basic Salary</td><td style={{ textAlign: 'right' }}>{structure.basicSalary?.toFixed(2)}</td></tr>
                                <tr><td>HRA</td><td style={{ textAlign: 'right' }}>{structure.hra?.toFixed(2)}</td></tr>
                                <tr><td>Special Allowance</td><td style={{ textAlign: 'right' }}>{structure.specialAllowance?.toFixed(2)}</td></tr>
                                <tr><td>Conveyance</td><td style={{ textAlign: 'right' }}>{structure.conveyanceAllowance?.toFixed(2)}</td></tr>
                                <tr><td>Medical</td><td style={{ textAlign: 'right' }}>{structure.medicalAllowance?.toFixed(2)}</td></tr>
                                <tr><td>Other Allowances</td><td style={{ textAlign: 'right' }}>{structure.otherAllowances?.toFixed(2)}</td></tr>
                                <tr style={{ fontWeight: 'bold', paddingTop: '10px' }}>
                                    <td>Total Earnings</td>
                                    <td style={{ textAlign: 'right' }}>{totalEarnings.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{ flex: 1, padding: '10px' }}>
                        <h4 style={{ textDecoration: 'underline' }}>DEDUCTIONS</h4>
                        <table style={{ width: '100%' }}>
                            <tbody>
                                <tr><td>PF (Employee)</td><td style={{ textAlign: 'right' }}>{deductions.pfEmployee?.toFixed(2)}</td></tr>
                                <tr><td>ESI (Employee)</td><td style={{ textAlign: 'right' }}>{deductions.esiEmployee?.toFixed(2)}</td></tr>
                                <tr><td>Professional Tax</td><td style={{ textAlign: 'right' }}>{deductions.professionalTax?.toFixed(2)}</td></tr>
                                <tr><td>TDS/Income Tax</td><td style={{ textAlign: 'right' }}>{(deductions.tds + deductions.incomeTax)?.toFixed(2)}</td></tr>
                                <tr><td>Health Insurance</td><td style={{ textAlign: 'right' }}>{deductions.groupHealthInsuranceEmployee?.toFixed(2)}</td></tr>
                                <tr><td>Advance Recovery</td><td style={{ textAlign: 'right' }}>{deductions.salaryAdvanceRecovery?.toFixed(2)}</td></tr>
                                <tr style={{ fontWeight: 'bold', paddingTop: '10px' }}>
                                    <td>Total Deductions</td>
                                    <td style={{ textAlign: 'right' }}>{totalDeductions.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h3>NET PAY: <span style={{ color: '#4CAF50' }}>{netPay.toFixed(2)}</span></h3>
                    <p>(Amount in words: ...)</p>
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
                    <p>This is a computer-generated payslip and does not require a signature.</p>
                </div>
            </div>
        </div>
    );
};

export default PayslipView;
