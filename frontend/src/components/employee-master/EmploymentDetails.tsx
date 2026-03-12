import React from 'react';
import { EmployeeEmploymentDetails, EmploymentRolls } from '../../types/employee';

interface Props {
    data: EmployeeEmploymentDetails;
    updateData: (data: Partial<EmployeeEmploymentDetails>) => void;
    branches: any[];
}

const EmploymentDetails: React.FC<Props> = ({ data, updateData, branches }) => {
    const [isCustomDept, setIsCustomDept] = React.useState(
        data.department && !['ADMIN DEPARTMENT', 'ACCOUNTS & FINANCE', 'HR DEPARTMENT', 'SALES DEPARTMENT', 'TECHNOLOGY', 'OPERATIONS'].includes(data.department)
    );
    const [isCustomRole, setIsCustomRole] = React.useState(
        data.rolls && !['On Roll', 'Off roll', 'railway', 'Contract'].includes(data.rolls)
    );

    return (
        <div className="form-section">
            <h3 className="section-title">Employment Details</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label>Employee Number (Emp No)</label>
                    <input type="text" value={data.empNo} onChange={(e) => updateData({ empNo: e.target.value })} placeholder="Enter Emp ID" />
                </div>
                <div className="form-group">
                    <label>Date of Joining (DOJ)</label>
                    <input type="date" value={data.doj} onChange={(e) => updateData({ doj: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Designation</label>
                    <input type="text" value={data.designation} onChange={(e) => updateData({ designation: e.target.value })} placeholder="Enter Designation" />
                </div>
                <div className="form-group">
                    <label>Department</label>
                    {!isCustomDept ? (
                        <select value={data.department} onChange={(e) => {
                            if (e.target.value === 'CUSTOM_DEPT') {
                                setIsCustomDept(true);
                                updateData({ department: '' });
                            } else {
                                updateData({ department: e.target.value });
                            }
                        }}>
                            <option value="">Select Department</option>
                            <option value="ADMIN DEPARTMENT">ADMIN DEPARTMENT</option>
                            <option value="ACCOUNTS & FINANCE">ACCOUNTS & FINANCE</option>
                            <option value="HR DEPARTMENT">HR DEPARTMENT</option>
                            <option value="SALES DEPARTMENT">SALES DEPARTMENT</option>
                            <option value="TECHNOLOGY">TECHNOLOGY</option>
                            <option value="OPERATIONS">OPERATIONS</option>
                            <option value="CUSTOM_DEPT">Other/Custom...</option>
                        </select>
                    ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                value={data.department}
                                onChange={(e) => updateData({ department: e.target.value })}
                                placeholder="Enter Department"
                            />
                            <button type="button" onClick={() => setIsCustomDept(false)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0 8px' }}>✕</button>
                        </div>
                    )}
                </div>
                <div className="form-group">
                    <label>Branch</label>
                    <select value={data.branch} onChange={(e) => updateData({ branch: e.target.value })}>
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                            <option key={branch.branch_code} value={branch.branch_name}>{branch.branch_name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Reporting Manager</label>
                    <input type="text" value={data.reportingManager} onChange={(e) => updateData({ reportingManager: e.target.value })} placeholder="Manager Name" />
                </div>
                <div className="form-group">
                    <label>Rolls (Employment Category)</label>
                    {!isCustomRole ? (
                        <select value={data.rolls} onChange={(e) => {
                            if (e.target.value === 'CUSTOM_ROLE') {
                                setIsCustomRole(true);
                                updateData({ rolls: '' });
                            } else {
                                updateData({ rolls: e.target.value });
                            }
                        }}>
                            <option value="On Roll">On Roll</option>
                            <option value="Off roll">Off roll</option>
                            <option value="railway">Railway</option>
                            <option value="Contract">Contract</option>
                            <option value="CUSTOM_ROLE">Other/Custom...</option>
                        </select>
                    ) : (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                value={data.rolls}
                                onChange={(e) => updateData({ rolls: e.target.value })}
                                placeholder="Enter Category"
                            />
                            <button type="button" onClick={() => setIsCustomRole(false)} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '0 8px' }}>✕</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmploymentDetails;
