import React, { useState } from 'react';
import { TrainingData } from '../../types/training';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: TrainingData;
}

const TrainingReports: React.FC<Props> = ({ data }) => {
    const [reportType, setReportType] = useState('history');

    const handleExport = () => {
        let exportData: any[] = [];
        let fileName = 'Training_Report';

        if (reportType === 'history') {
            exportData = data.completions.map(c => ({
                'ID': c.employeeId,
                'Program': data.programs.find(p => p.id === c.programId)?.name,
                'Attendance': c.attendanceStatus,
                'Status': c.completionStatus,
                'Result': c.examResult || 'N/A'
            }));
            fileName = 'Employee_Training_History';
        } else if (reportType === 'effectiveness') {
            exportData = data.programs.map(p => {
                const totalNom = data.nominations.filter(n => n.programId === p.id).length;
                const completed = data.completions.filter(c => c.programId === p.id && c.completionStatus === 'Completed').length;
                return {
                    'Program': p.name,
                    'Total Nominated': totalNom,
                    'Completed': completed,
                    'Pass %': totalNom > 0 ? `${Math.round((completed / totalNom) * 100)}%` : '0%'
                };
            });
            fileName = 'Program_Effectiveness';
        }

        exportToCSV(exportData, fileName);
    };

    const reports = [
        { id: 'history', label: 'Employee Training History', icon: 'fa-history' },
        { id: 'effectiveness', label: 'Program Effectiveness', icon: 'fa-chart-line' },
        { id: 'certification', label: 'Certification Registry', icon: 'fa-certificate' },
        { id: 'coverage', label: 'Dept Training Coverage', icon: 'fa-sitemap' },
        { id: 'cummins', label: 'Cummins Training Report', icon: 'fa-external-link-alt' }
    ];

    return (
        <div style={{ background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>Analytical Reports & Skill Audits</h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button style={{ padding: '10px 20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                        <i className="fas fa-file-import" style={{ marginRight: '8px' }}></i> Import Training Records
                    </button>
                    <button onClick={handleExport} style={{ padding: '10px 25px', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)' }}>
                        <i className="fas fa-file-excel" style={{ marginRight: '8px' }}></i> Export All Data
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', overflowX: 'auto', paddingBottom: '5px' }}>
                {reports.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setReportType(r.id)}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '14px',
                            fontSize: '13px',
                            fontWeight: '700',
                            whiteSpace: 'nowrap',
                            background: reportType === r.id ? '#1e293b' : '#f8fafc',
                            color: reportType === r.id ? 'white' : '#64748b',
                            border: reportType === r.id ? 'none' : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <i className={`fas ${r.icon}`} style={{ marginRight: '10px' }}></i> {r.label}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {reportType === 'history' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Employee</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Program</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Result</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Final Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.completions.map((c, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.employeeId}</td>
                                    <td style={{ padding: '15px' }}>{data.programs.find(p => p.id === c.programId)?.name}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{c.completionStatus}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>
                                        <span style={{ color: c.examResult === 'Pass' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>{c.examResult}</span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: '800' }}>{c.score || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {reportType === 'effectiveness' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Training Program</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Nominated</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Completed</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Pass %</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>ROI Efficiency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.programs.map(p => {
                                const totalNom = data.nominations.filter(n => n.programId === p.id).length;
                                const completed = data.completions.filter(c => c.programId === p.id && c.completionStatus === 'Completed').length;
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.name}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>{totalNom}</td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>{completed}</td>
                                        <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold' }}>
                                            {totalNom > 0 ? Math.round((completed / totalNom) * 100) : 0}%
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'center' }}>
                                            <span style={{ color: '#10b981', fontWeight: 'bold' }}>HIGH</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {reportType === 'cummins' && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Employee ID</th>
                                <th style={{ padding: '15px', textAlign: 'left' }}>Cummins Promo ID</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Category</th>
                                <th style={{ padding: '15px', textAlign: 'center' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.cummins.map((c, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{c.employeeId}</td>
                                    <td style={{ padding: '15px' }}>{c.cumminsId}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{c.category}</td>
                                    <td style={{ padding: '15px', textAlign: 'center' }}>{c.completionStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TrainingReports;
