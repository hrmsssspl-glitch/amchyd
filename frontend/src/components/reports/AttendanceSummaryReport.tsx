import React from 'react';
import { AttendanceSummary } from '../../types/reports';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: AttendanceSummary[];
}

const AttendanceSummaryReport: React.FC<Props> = ({ data }) => {
    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Monthly Attendance Summary</h3>
                <button
                    onClick={() => exportToCSV(data, 'Attendance_Summary')}
                    style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-excel"></i> Export CSV
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px', color: '#64748b' }}>Employee</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Working Days</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Present</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Absent</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>Half Day</th>
                            <th style={{ padding: '15px', color: '#64748b' }}>OT Hours</th>
                            <th style={{ padding: '15px', color: '#64748b', fontWeight: 800 }}>Late Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((a, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                                <td style={{ padding: '15px' }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{a.name}</div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{a.employeeId} • {a.department}</div>
                                </td>
                                <td style={{ padding: '15px' }}>{a.workingDays}</td>
                                <td style={{ padding: '15px', color: '#166534', fontWeight: 700 }}>{a.present}</td>
                                <td style={{ padding: '15px', color: '#dc2626' }}>{a.absent}</td>
                                <td style={{ padding: '15px' }}>{a.halfDay}</td>
                                <td style={{ padding: '15px', color: '#6366f1', fontWeight: 700 }}>{a.overtimeHours}h</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        background: a.lateMarks > 2 ? '#fff1f2' : '#f1f5f9',
                                        color: a.lateMarks > 2 ? '#be123c' : '#475569'
                                    }}>{a.lateMarks}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceSummaryReport;
