import React, { useState } from 'react';
import { DailyAttendance, AttendanceStatus, LeaveCode } from '../../types/attendance';

interface DailyAttendanceProps {
    data: DailyAttendance;
    updateData: (data: Partial<DailyAttendance>) => void;
}

const DailyAttendanceForm: React.FC<DailyAttendanceProps> = ({ data, updateData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;
        if (type === 'checkbox') {
            finalValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            finalValue = parseFloat(value);
        }
        updateData({ [name]: finalValue });
    };

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', color: '#1e293b' }}>Daily Attendance Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Employee ID</label>
                    <input type="text" name="employeeId" value={data.employeeId} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Employee Name</label>
                    <input type="text" name="employeeName" value={data.employeeName} readOnly className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Attendance Date</label>
                    <input type="date" name="date" value={data.date} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Shift Name</label>
                    <input type="text" name="shiftName" value={data.shiftName} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>In Time</label>
                    <input type="time" name="inTime" value={data.inTime} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Out Time</label>
                    <input type="time" name="outTime" value={data.outTime} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Total Working Hours</label>
                    <input type="number" name="totalWorkingHours" value={data.totalWorkingHours} readOnly className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }} />
                </div>

                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Status</label>
                    <select name="status" value={data.status} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half Day Present">Half Day Present</option>
                        <option value="Half Day Absent">Half Day Absent</option>
                        <option value="Leave">Leave</option>
                        <option value="Compensatory Off">Compensatory Off</option>
                        <option value="Compensatory Working">Compensatory Working</option>
                    </select>
                </div>

                {data.status === 'Leave' && (
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Leave Type</label>
                        <select name="leaveType" value={data.leaveType || ''} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                            <option value="">Select</option>
                            <option value="CL">CL</option>
                            <option value="SL">SL</option>
                            <option value="EL">EL</option>
                            <option value="OD">OD</option>
                            {/* ... other leave types */}
                        </select>
                    </div>
                )}
                <div className="form-group">
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Tracking Method</label>
                    <select name="trackingType" value={data.trackingType} onChange={handleChange} className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="Manual">Manual Entry</option>
                        <option value="IP-Based">IP-Based Login</option>
                        <option value="Geo-Tag">Geo-Tagging (GPS)</option>
                        <option value="Biometric">Biometric Sync</option>
                    </select>
                </div>

                {data.trackingType === 'IP-Based' && (
                    <div className="form-group">
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Login IP Address</label>
                        <input type="text" name="ipAddress" value={data.ipAddress || ''} onChange={handleChange} placeholder="e.g. 192.168.1.10" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                    </div>
                )}

                {data.trackingType === 'Geo-Tag' && (
                    <>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Latitude</label>
                            <input type="number" name="latitude" value={data.latitude || ''} onChange={handleChange} step="any" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Longitude</label>
                            <input type="number" name="longitude" value={data.longitude || ''} onChange={handleChange} step="any" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#64748b', marginBottom: '5px' }}>Location Name / Address</label>
                            <input type="text" name="locationName" value={data.locationName || ''} onChange={handleChange} placeholder="e.g. Noida Office / Client Site" className="form-control" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        </div>
                    </>
                )}
            </div>

            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                    <input type="checkbox" name="isLate" checked={data.isLate} onChange={handleChange} />
                    Late Mark
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                    <input type="checkbox" name="isEarlyEntry" checked={data.isEarlyEntry} onChange={handleChange} />
                    Early Entry
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
                    <input type="checkbox" name="isEarlyExit" checked={data.isEarlyExit} onChange={handleChange} />
                    Early Exit
                </label>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1e293b' }}>Attendance Capture Tools</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="btn btn-secondary"
                        style={{ background: '#3b82f6', color: 'white', border: 'none', fontSize: '12px' }}
                        onClick={() => updateData({ trackingType: 'IP-Based', ipAddress: '157.34.12.89', status: 'Present' })}
                    >
                        <i className="fas fa-network-wired"></i> Detect IP Login
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ background: '#10b981', color: 'white', border: 'none', fontSize: '12px' }}
                        onClick={() => updateData({ trackingType: 'Geo-Tag', latitude: 28.6139, longitude: 77.2090, locationName: 'HQ Office, Delhi', status: 'Present' })}
                    >
                        <i className="fas fa-map-marker-alt"></i> Fetch Geo-Tag
                    </button>
                    <button
                        className="btn btn-secondary"
                        style={{ background: '#64748b', color: 'white', border: 'none', fontSize: '12px' }}
                        onClick={() => updateData({ trackingType: 'Manual', ipAddress: '', latitude: undefined, longitude: undefined, locationName: '', status: 'Present' })}
                    >
                        <i className="fas fa-keyboard"></i> Manual Presence
                    </button>
                </div>
            </div>

            {(data.shortageOfHours || data.isLate) && (
                <div style={{ marginTop: '15px', color: '#ef4444', fontSize: '13px', fontWeight: 'bold', display: 'flex', gap: '10px' }}>
                    {data.shortageOfHours && <span>⚠️ Shortage of Hours Detected!</span>}
                    {data.isLate && <span>📝 Late Mark Flagged</span>}
                </div>
            )}
        </div>
    );
};

export default DailyAttendanceForm;
