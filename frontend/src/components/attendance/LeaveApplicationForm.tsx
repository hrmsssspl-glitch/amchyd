import React, { useState, useEffect } from 'react';
import { LeaveApplication, LeaveTypeCode } from '../../types/leave';
import { getLeaveTypes, LeaveTypeConfig } from '../../utils/leaveTypeStorage';

import { AuthContext } from '../../context/AuthContext';

interface Props {
    onSubmit: (app: LeaveApplication) => void;
}

const LeaveApplicationForm: React.FC<Props> = ({ onSubmit }) => {
    const { user } = React.useContext(AuthContext);
    const [formData, setFormData] = useState<Partial<LeaveApplication>>({
        employeeId: user?.employeeId || '',
        employeeName: user?.employeeName || '',
        applicationDate: new Date().toISOString().split('T')[0],
        leaveType: 'CL',
        fromHalf: 'Full',
        toHalf: 'Full',
        numberOfDays: 0,
        teamLeadStatus: 'Pending',
        reportingManagerStatus: 'Pending',
        hrStatus: 'Pending',
        overallStatus: 'Applied'
    });

    const [leaveTypes, setLeaveTypes] = useState<LeaveTypeConfig[]>([]);

    useEffect(() => {
        // Load only Active leave types
        const loadTypes = () => {
            const types = getLeaveTypes().filter(lt => lt.status === 'Active');
            setLeaveTypes(types);
        };

        loadTypes();
        window.addEventListener('leaveTypesUpdated', loadTypes);
        return () => window.removeEventListener('leaveTypesUpdated', loadTypes);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            id: `L${Math.floor(Math.random() * 1000)}`,
        } as LeaveApplication);
        alert('Leave application submitted successfully!');
    };

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '25px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-edit" style={{ color: '#4f46e5' }}></i>
                Leave Application Form (Employee Portal)
            </h3>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Employee ID & Name</label>
                        <input type="text" value={`${formData.employeeId} - ${formData.employeeName}`} disabled style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Application Date</label>
                        <input type="date" name="applicationDate" value={formData.applicationDate} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Leave Type (Attendance Synced)</label>
                        <select name="leaveType" value={formData.leaveType} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            {leaveTypes.map(lt => (
                                <option key={lt.code} value={lt.code}>{lt.code} - {lt.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>From Date</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="date" name="fromDate" value={formData.fromDate} onChange={handleChange} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <select name="fromHalf" value={formData.fromHalf} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <option value="Full">Full Day</option>
                                <option value="1st">1st Half</option>
                                <option value="2nd">2nd Half</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>To Date</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="date" name="toDate" value={formData.toDate} onChange={handleChange} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                            <select name="toHalf" value={formData.toHalf} onChange={handleChange} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <option value="Full">Full Day</option>
                                <option value="1st">1st Half</option>
                                <option value="2nd">2nd Half</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Number of Days</label>
                        <input type="number" name="numberOfDays" value={formData.numberOfDays} onChange={handleChange} placeholder="Calculated days" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Leave Substitute (Employee ID - Name)</label>
                        <input type="text" name="substituteName" value={formData.substituteName} onChange={handleChange} placeholder="e.g. EMP005 - Michael Scott" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </div>

                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>Reason for Leave</label>
                        <textarea name="reason" value={formData.reason} onChange={handleChange} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }} placeholder="Specify your reason clearly..."></textarea>
                    </div>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                    <button type="submit" style={{ padding: '12px 30px', borderRadius: '8px', background: '#4f46e5', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' }}>
                        Submit Application
                    </button>
                    <button type="reset" style={{ padding: '12px 30px', borderRadius: '8px', background: '#f1f5f9', color: '#64748b', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                        Clear Form
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LeaveApplicationForm;
