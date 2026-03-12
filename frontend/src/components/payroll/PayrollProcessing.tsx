import React from 'react';
import { PayrollProcessing } from '../../types/payroll';

interface PayrollProcessingProps {
    data: PayrollProcessing;
    updateData: (data: Partial<PayrollProcessing>) => void;
}

const PayrollProcessingComponent: React.FC<PayrollProcessingProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;

        if (type === 'number') {
            finalValue = parseFloat(value) || 0;
        }

        updateData({ [name]: finalValue });
    };

    return (
        <div className="form-section">
            <h3>Payroll Processing (Monthly)</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <h4>Employee & Month Selection</h4>
                </div>
                <div className="form-group">
                    <label>Employee ID <span className="required">*</span></label>
                    <input
                        type="text"
                        name="employeeId"
                        className="form-control"
                        value={data.employeeId}
                        onChange={handleChange}
                        placeholder="Search"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Employee Name</label>
                    <input
                        type="text"
                        name="employeeName"
                        className="form-control read-only"
                        value={data.employeeName}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Salary Month (MM-YYYY) <span className="required">*</span></label>
                    <input
                        type="month"
                        name="salaryMonth"
                        className="form-control"
                        value={data.salaryMonth}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <h4>Attendance Data</h4>
                </div>
                <div className="form-group">
                    <label>Pay Days</label>
                    <input
                        type="number"
                        name="payDays"
                        className="form-control"
                        value={data.payDays}
                        onChange={handleChange}
                        placeholder="Auto Calc"
                    />
                </div>
                <div className="form-group">
                    <label>LOP Days (Loss of Pay)</label>
                    <input
                        type="number"
                        name="lopDays"
                        className="form-control"
                        value={data.lopDays}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <h4>Calculated Salary</h4>
                </div>
                <div className="form-group">
                    <label>Gross Salary</label>
                    <input
                        type="number"
                        name="grossSalary"
                        className="form-control read-only"
                        value={data.grossSalary}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Total Deductions</label>
                    <input
                        type="number"
                        name="totalDeductions"
                        className="form-control read-only"
                        value={data.totalDeductions}
                        readOnly
                    />
                </div>
                <div className="form-group">
                    <label>Net Pay</label>
                    <input
                        type="number"
                        name="netPay"
                        className="form-control read-only"
                        value={data.netPay}
                        readOnly
                    />
                </div>

                <div className="form-group full-width">
                    <h4>Payment Details</h4>
                </div>
                <div className="form-group">
                    <label>Payment Mode <span className="required">*</span></label>
                    <select
                        name="paymentMode"
                        className="form-control"
                        value={data.paymentMode}
                        onChange={handleChange}
                        required
                    >
                        <option value="Bank">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Bank Account Number</label>
                    <input
                        type="text"
                        name="bankAccountNumber"
                        className="form-control"
                        value={data.bankAccountNumber}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                        type="text"
                        name="ifscCode"
                        className="form-control"
                        value={data.ifscCode}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Branch Name</label>
                    <input
                        type="text"
                        name="branchName"
                        className="form-control"
                        value={data.branchName}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group full-width">
                    <label>Branch Address</label>
                    <div className="form-control non-input">{data.branchAddress || 'Not Fetched'}</div>
                </div>

                <div className="form-group full-width">
                    <h4>Auto Fetched IDs</h4>
                </div>
                <div className="form-group">
                    <label>Aadhaar</label>
                    <input type="text" value={data.aadhaarNumber} readOnly className="form-control read-only" />
                </div>
                <div className="form-group">
                    <label>PAN</label>
                    <input type="text" value={data.panNumber} readOnly className="form-control read-only" />
                </div>
                <div className="form-group">
                    <label>UAN</label>
                    <input type="text" value={data.uanNumber} readOnly className="form-control read-only" />
                </div>
                <div className="form-group">
                    <label>PF</label>
                    <input type="text" value={data.pfNumber} readOnly className="form-control read-only" />
                </div>
                <div className="form-group">
                    <label>ESI</label>
                    <input type="text" value={data.esiNumber} readOnly className="form-control read-only" />
                </div>

            </div>
        </div>
    );
};

export default PayrollProcessingComponent;
