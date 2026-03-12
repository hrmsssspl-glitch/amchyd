import React, { useState } from 'react';
import { AttendanceReportData, UnifiedAttendanceRecord } from '../../types/attendance';
import { exportToCSV } from '../../utils/csvExport';
import { importFromCSV } from '../../utils/csvImport';

interface AttendanceReportsProps {
    data: AttendanceReportData;
}

const AttendanceReports: React.FC<AttendanceReportsProps> = ({ data }) => {
    const [reportView, setReportView] = useState<'unified' | 'categorized'>('unified');
    const [unifiedData, setUnifiedData] = useState<UnifiedAttendanceRecord[]>(data.unified);

    const handleExport = () => {
        exportToCSV(unifiedData, 'Master_Attendance_Report');
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const imported = await importFromCSV(file);
                // Basic mapping/validation logic could go here
                setUnifiedData(imported);
                alert('Attendance data imported successfully!');
            } catch (err) {
                alert('Failed to import CSV. Please check the file format.');
            }
        }
    };

    return (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Attendance Master Report (Unified)</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label className="btn btn-secondary" style={{ background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>
                        <i className="fas fa-file-import"></i> Import CSV
                        <input type="file" accept=".csv" onChange={handleImport} style={{ display: 'none' }} />
                    </label>
                    <button
                        onClick={handleExport}
                        style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-export"></i> Export Master Report
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto', maxHeight: '600px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    <thead style={{ background: '#f1f5f9', color: '#475569', position: 'sticky', top: 0 }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>EMP ID</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>Employee Name</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>In Time</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>Out Time</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>Working Hours</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>Status</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>Tracking</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>IP / Geo Location</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>Late Mark</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>OT Hours</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>OT Amount</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>CL Bal</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>SL Bal</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>EL Bal</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>CO Bal</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>Comp Off Work Date</th>
                            <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>Exception Issue</th>
                            <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #e2e8f0' }}>Pay Days (MTD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unifiedData.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{row.employeeId}</td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{row.employeeName}</td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{row.date}</td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{row.inTime}</td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{row.outTime}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.totalWorkingHours}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                    <span style={{ padding: '3px 6px', borderRadius: '4px', fontSize: '11px', background: row.status === 'Present' ? '#dcfce7' : '#fee2e2', color: row.status === 'Present' ? '#166534' : '#991b1b' }}>
                                        {row.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: row.trackingType === 'Manual' ? '#64748b' : '#3b82f6' }}>
                                        {row.trackingType}
                                    </span>
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                                    {row.trackingType === 'IP-Based' && <span><i className="fas fa-network-wired"></i> {row.ipAddress}</span>}
                                    {row.trackingType === 'Geo-Tag' && <span><i className="fas fa-map-marker-alt"></i> {row.locationName || `${row.latitude}, ${row.longitude}`}</span>}
                                    {row.trackingType === 'Manual' && <span><i className="fas fa-keyboard"></i> Manual</span>}
                                </td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.isLate ? '🚩 Yes' : '✅ No'}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.otHours || 0}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>₹{row.otAmount?.toLocaleString() || 0}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.clBalance || 0}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.slBalance || 0}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.elBalance || 0}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>{row.coBalance || 0}</td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{row.compOffWorkingDate || '-'}</td>
                                <td style={{ padding: '10px', border: '1px solid #e2e8f0', color: row.exceptionIssue ? '#ef4444' : 'inherit' }}>{row.exceptionIssue || '-'}</td>
                                <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #e2e8f0', fontWeight: 'bold' }}>{row.payDaysMonth || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fef3c7', fontSize: '13px' }}>
                <strong>Note:</strong> This report merges Daily Attendance, Leave Balances, OT, and Exceptions into a single master view. Use <b>Export</b> to download the data or <b>Import</b> to update records from a CSV file.
            </div>
        </div>
    );
};

export default AttendanceReports;
