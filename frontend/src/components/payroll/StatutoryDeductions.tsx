import React from 'react';
import { StatutoryDeductions } from '../../types/payroll';

interface StatutoryDeductionsProps {
    data: StatutoryDeductions;
    updateData: (data: Partial<StatutoryDeductions>) => void;
}

const StatutoryDeductionsComponent: React.FC<StatutoryDeductionsProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;
        if (type === 'number') {
            finalValue = parseFloat(value) || 0;
        }
        updateData({ [name]: finalValue });
    };

    return (
        <div className="form-section">
            <h3>Statutory & Other Deductions</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <h4>Statutory Deductions</h4>
                </div>
                <div className="form-group">
                    <label>PF - Employee Contribution</label>
                    <input
                        type="number"
                        name="pfEmployee"
                        value={data.pfEmployee}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>PF - Employer Contribution</label>
                    <input
                        type="number"
                        name="pfEmployer"
                        value={data.pfEmployer}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>ESIC - Employee Contribution</label>
                    <input
                        type="number"
                        name="esiEmployee"
                        value={data.esiEmployee}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>ESIC - Employer Contribution</label>
                    <input
                        type="number"
                        name="esiEmployer"
                        value={data.esiEmployer}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Professional Tax</label>
                    <input
                        type="number"
                        name="professionalTax"
                        value={data.professionalTax}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Income Tax</label>
                    <input
                        type="number"
                        name="incomeTax"
                        value={data.incomeTax}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>TDS</label>
                    <input
                        type="number"
                        name="tds"
                        value={data.tds}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Labour Welfare Fund</label>
                    <input type="number" name="labourWelfareFund" value={data.labourWelfareFund} onChange={handleChange} className="form-control" />
                </div>

                <div className="form-group full-width">
                    <h4>Recoveries & Adjustments</h4>
                </div>
                <div className="form-group">
                    <label>Salary Advance Recovery</label>
                    <input type="number" name="salaryAdvanceRecovery" value={data.salaryAdvanceRecovery} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Tour Advance Recovery</label>
                    <input type="number" name="tourAdvanceRecovery" value={data.tourAdvanceRecovery} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Medical Advance Recovery</label>
                    <input type="number" name="medicalAdvanceRecovery" value={data.medicalAdvanceRecovery} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Festival Advance Recovery</label>
                    <input type="number" name="festivalAdvanceRecovery" value={data.festivalAdvanceRecovery} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Excess Paid Recovery</label>
                    <input type="number" name="excessPaidRecovery" value={data.excessPaidRecovery} onChange={handleChange} className="form-control" />
                </div>

                <div className="form-group full-width">
                    <h4>Insurance - Employee Share</h4>
                </div>
                <div className="form-group">
                    <label>Group Health Insurance</label>
                    <input type="number" name="groupHealthInsuranceEmployee" value={data.groupHealthInsuranceEmployee} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Group Accidental Insurance</label>
                    <input type="number" name="groupAccidentalInsuranceEmployee" value={data.groupAccidentalInsuranceEmployee} onChange={handleChange} className="form-control" />
                </div>

            </div>
        </div>
    );
};

export default StatutoryDeductionsComponent;
