import React, { useState } from 'react';
import { LeaveEncashment } from '../../types/leave';

interface Props {
    data: LeaveEncashment[];
    onSubmit: (enc: LeaveEncashment) => void;
}

const LeaveEncashmentForm: React.FC<Props> = ({ data, onSubmit }) => {
    const [formData, setFormData] = useState<Partial<LeaveEncashment>>({
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        leaveType: 'EL',
        openingBalance: 15,
        encashableLeaves: 7.5,
        requestedDays: 0,
        amount: 0,
        payrollMonth: 'Mar 2024'
    });

    const calculateAmount = (days: number) => {
        // Mock calculation: (Basic / 26) * days
        const basic = 65000;
        return Math.round((basic / 26) * days);
    };

    const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const days = parseFloat(e.target.value);
        setFormData(prev => ({
            ...prev,
            requestedDays: days,
            amount: calculateAmount(days)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: `ENC${Math.floor(Math.random() * 1000)}`,
            status: 'Pending'
        } as LeaveEncashment);
        alert('Encashment request submitted!');
    };

    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px' }}>
                <i className="fas fa-hand-holding-usd" style={{ color: '#4f46e5' }}></i>
                Leave Encashment Registry
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
                {/* Form */}
                <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Employee Details</label>
                        <input type="text" value={`${formData.employeeId} - ${formData.employeeName}`} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Opening Balance (EL)</label>
                            <div style={{ padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold' }}>{formData.openingBalance}</div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Encashable (Max 50%)</label>
                            <div style={{ padding: '10px', background: '#fff', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 'bold', color: '#10b981' }}>{formData.encashableLeaves}</div>
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Days Requested</label>
                        <input type="number" step="0.5" max={formData.encashableLeaves} onChange={handleDaysChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #4f46e5', fontSize: '16px', fontWeight: 'bold' }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Encashment Amount (Auto Calc)</label>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#4f46e5' }}>₹ {formData.amount?.toLocaleString()}</div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>(Basic Salary / 26) * Requested Days</span>
                    </div>

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#64748b', marginBottom: '5px' }}>Payroll Month</label>
                        <select value={formData.payrollMonth} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <option>Mar 2024</option>
                            <option>Apr 2024 (F&F Settlement)</option>
                        </select>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Request Encashment
                    </button>
                </form>

                {/* List */}
                <div style={{ overflowX: 'auto' }}>
                    <h4 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#475569' }}>Recent Encashment Requests</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead style={{ background: '#f1f5f9' }}>
                            <tr>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Days</th>
                                <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(enc => (
                                <tr key={enc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px' }}>{enc.id} - {enc.payrollMonth}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>{enc.requestedDays}</td>
                                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>₹{enc.amount.toLocaleString()}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <span style={{ padding: '3px 8px', borderRadius: '10px', background: '#dcfce7', color: '#166534' }}>{enc.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveEncashmentForm;
