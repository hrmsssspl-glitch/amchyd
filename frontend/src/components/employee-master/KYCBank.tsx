import React from 'react';
import { EmployeeKYCDetails, EmployeeBankDetails } from '../../types/employee';

interface Props {
    kyc: EmployeeKYCDetails;
    bank: EmployeeBankDetails;
    updateKYC: (data: Partial<EmployeeKYCDetails>) => void;
    updateBank: (data: Partial<EmployeeBankDetails>) => void;
}

const KYCBank: React.FC<Props> = ({ kyc, bank, updateKYC, updateBank }) => {
    return (
        <div className="form-section">
            <h3 className="section-title">Identity & KYC</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>PAN Number</label>
                    <input type="text" value={kyc.panNo} onChange={(e) => updateKYC({ panNo: e.target.value })} placeholder="ABCDE1234F" style={{ textTransform: 'uppercase' }} />
                </div>
                <div className="form-group">
                    <label>Aadhar Number</label>
                    <input type="text" value={kyc.aadharNo} onChange={(e) => updateKYC({ aadharNo: e.target.value })} placeholder="12-digit Aadhar No" />
                </div>
                <div className="form-group">
                    <label>Driving License Number</label>
                    <input type="text" value={kyc.drivingLicenseNo} onChange={(e) => updateKYC({ drivingLicenseNo: e.target.value })} placeholder="Enter DL No" />
                </div>
            </div>

            <h3 className="section-title" style={{ marginTop: '30px' }}>Bank Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Bank Name</label>
                    <input type="text" value={bank.bankName} onChange={(e) => updateBank({ bankName: e.target.value })} placeholder="Enter Bank Name" />
                </div>
                <div className="form-group">
                    <label>Account Number</label>
                    <input type="text" value={bank.accountNo} onChange={(e) => updateBank({ accountNo: e.target.value })} placeholder="Enter Account No" />
                </div>
                <div className="form-group">
                    <label>Bank Branch</label>
                    <input type="text" value={bank.branch} onChange={(e) => updateBank({ branch: e.target.value })} placeholder="Enter Branch Name" />
                </div>
                <div className="form-group">
                    <label>IFSC Code</label>
                    <input type="text" value={bank.ifscCode} onChange={(e) => updateBank({ ifscCode: e.target.value })} placeholder="ABCD0123456" style={{ textTransform: 'uppercase' }} />
                </div>
            </div>
        </div>
    );
};

export default KYCBank;
