import React from 'react';
import { SalaryStructure as SalaryStructureType } from '../../types/payroll';

interface SalaryStructureProps {
    data: SalaryStructureType;
    updateData: (data: Partial<SalaryStructureType>) => void;
}

const SalaryStructure: React.FC<SalaryStructureProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        const isCheckbox = type === 'checkbox' || name.includes('Eligibility');

        // For checkboxes or select options mapping to boolean, handle logic here
        const checked = (e.target as HTMLInputElement).checked;

        let finalValue: any = value;
        if (isNumber) {
            finalValue = parseFloat(value) || 0;
        } else if (isCheckbox) {
            finalValue = checked;
        } else if (value === 'true') {
            finalValue = true;
        } else if (value === 'false') {
            finalValue = false;
        }

        updateData({ [name]: finalValue });
    };

    const calculateGross = () => {
        // Simple calculation logic for demo
        const total = (data.basicSalary || 0) + (data.hra || 0) + (data.specialAllowance || 0) +
            (data.conveyanceAllowance || 0) + (data.medicalAllowance || 0) + (data.otherAllowances || 0);
        return total;
    };

    return (
        <div className="form-section">
            <h3>Salary Structure (Employee Wise)</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <h4>Employee Identification</h4>
                </div>
                <div className="form-group">
                    <label>Employee ID <span className="required">*</span></label>
                    <input
                        type="text"
                        name="employeeId"
                        value={data.employeeId}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Search / Select"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Employee Name</label>
                    <input
                        type="text"
                        name="employeeName"
                        value={data.employeeName}
                        readOnly
                        className="form-control read-only"
                        placeholder="Auto-fetched"
                    />
                </div>

                <div className="form-group full-width">
                    <h4>Earnings Breakdown</h4>
                </div>
                <div className="form-group">
                    <label>CTC (Cost to Company) <span className="required">*</span></label>
                    <input
                        type="number"
                        name="ctc"
                        value={data.ctc}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Basic Salary <span className="required">*</span></label>
                    <input
                        type="number"
                        name="basicSalary"
                        value={data.basicSalary}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>HRA (House Rent Allowance)</label>
                    <input
                        type="number"
                        name="hra"
                        value={data.hra}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Special Allowance</label>
                    <input
                        type="number"
                        name="specialAllowance"
                        value={data.specialAllowance}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Conveyance Allowance</label>
                    <input
                        type="number"
                        name="conveyanceAllowance"
                        value={data.conveyanceAllowance}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Medical Allowance</label>
                    <input
                        type="number"
                        name="medicalAllowance"
                        value={data.medicalAllowance}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Other Allowances</label>
                    <input
                        type="number"
                        name="otherAllowances"
                        value={data.otherAllowances}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label><strong>Gross Salary (Calc)</strong></label>
                    <input
                        type="number"
                        value={calculateGross()}
                        readOnly
                        className="form-control read-only"
                    />
                </div>

                <div className="form-group full-width">
                    <h4>Employer Contributions & Benefits</h4>
                </div>
                <div className="form-group">
                    <label>Group Health Insurance</label>
                    <input type="number" name="groupHealthInsurance" value={data.groupHealthInsurance} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Group Accidental Insurance</label>
                    <input type="number" name="groupAccidentalInsurance" value={data.groupAccidentalInsurance} onChange={handleChange} className="form-control" />
                </div>

                <div className="form-group full-width">
                    <h4>Eligibilities</h4>
                    <div className="checkbox-grid">
                        <label><input type="checkbox" name="travelReimbursementEligibility" checked={data.travelReimbursementEligibility} onChange={handleChange} /> Travel Reimbursement</label>
                        <label><input type="checkbox" name="bonusEligibility" checked={data.bonusEligibility} onChange={handleChange} /> Bonus</label>
                        <label><input type="checkbox" name="incentiveEligibility" checked={data.incentiveEligibility} onChange={handleChange} /> Incentive</label>
                        <label><input type="checkbox" name="gratuityEligibility" checked={data.gratuityEligibility} onChange={handleChange} /> Gratuity</label>
                        <label><input type="checkbox" name="pfEligibility" checked={data.pfEligibility} onChange={handleChange} /> PF</label>
                        <label><input type="checkbox" name="professionalTaxEligibility" checked={data.professionalTaxEligibility} onChange={handleChange} /> Professional Tax</label>
                        <label><input type="checkbox" name="incomeTaxEligibility" checked={data.incomeTaxEligibility} onChange={handleChange} /> Income Tax</label>
                        <label><input type="checkbox" name="tdsEligibility" checked={data.tdsEligibility} onChange={handleChange} /> TDS</label>
                        <label><input type="checkbox" name="esiEligibility" checked={data.esiEligibility} onChange={handleChange} /> ESI</label>
                    </div>
                </div>

                <div className="form-group full-width">
                    <h4>Initial Adjustments</h4>
                </div>
                <div className="form-group">
                    <label>Short Paid Last Month</label>
                    <input type="number" name="shortPaidLastMonth" value={data.shortPaidLastMonth} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Excess Paid Last Month</label>
                    <input type="number" name="excessPaidLastMonth" value={data.excessPaidLastMonth} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Arrears</label>
                    <input type="number" name="arrears" value={data.arrears} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                    <label>Salary Advance</label>
                    <input type="number" name="salaryAdvance" value={data.salaryAdvance} onChange={handleChange} className="form-control" />
                </div>

            </div>
        </div>
    );
};

export default SalaryStructure;
