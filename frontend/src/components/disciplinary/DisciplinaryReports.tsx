import React, { useState } from 'react';
import { DisciplinaryData } from '../../types/disciplinary';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: DisciplinaryData;
}

const DisciplinaryReports: React.FC<Props> = ({ data }) => {
    const [selectedReport, setSelectedReport] = useState('register');

    const handleExport = () => {
        let exportData: any[] = [];
        let filename = 'disciplinary_report';

        switch (selectedReport) {
            case 'register':
                exportData = data.cases.map(c => ({
                    'Case ID': c.id,
                    'Employee ID': c.employeeId,
                    'Employee Name': c.employeeName,
                    'Complaint Date': c.complaintDate,
                    'Severity': c.severity,
                    'Status': c.status
                }));
                filename = 'Disciplinary_Case_Register';
                break;
            case 'notices':
                exportData = data.notices.map(n => ({
                    'Notice No': n.noticeNo,
                    'Case ID': n.caseId,
                    'Issue Date': n.issueDate,
                    'Due Date': n.responseDueDate,
                    'Response Status': n.responseStatus
                }));
                filename = 'Show_Cause_Notice_Report';
                break;
            case 'actions':
                exportData = data.actions.map(a => ({
                    'Case ID': a.caseId,
                    'Action Type': a.actionType,
                    'Effective From': a.effectiveFrom,
                    'Effective To': a.effectiveTo || 'N/A',
                    'Approved By': a.approvalBy
                }));
                filename = 'Disciplinary_Action_Report';
                break;
        }

        exportToCSV(exportData, filename);
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Disciplinary Reports & Data Insight</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleExport}
                        style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-excel"></i> Export CSV/Excel
                    </button>
                    <button style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-print"></i> Print PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                        { id: 'register', label: 'Disciplinary Case Register', icon: 'fa-table' },
                        { id: 'notices', label: 'Show Cause Notice Report', icon: 'fa-paper-plane' },
                        { id: 'actions', label: 'Disciplinary Action Report', icon: 'fa-gavel' },
                        { id: 'summary', label: 'Open vs Closed Cases', icon: 'fa-chart-pie' },
                        { id: 'dept', label: 'Department-wise Disciplinary', icon: 'fa-building' }
                    ].map(report => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            style={{
                                padding: '15px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: selectedReport === report.id ? '#6366f1' : '#e2e8f0',
                                background: selectedReport === report.id ? '#eef2ff' : 'white',
                                color: selectedReport === report.id ? '#4f46e5' : '#64748b',
                                textAlign: 'left',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <i className={`fas ${report.icon}`}></i>
                            {report.label}
                        </button>
                    ))}
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '25px', minHeight: '400px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h4 style={{ margin: 0, color: '#1e293b' }}>Preview: {selectedReport.replace(/-/g, ' ').toUpperCase()}</h4>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Real-time live data feed</span>
                    </div>

                    <div style={{ background: 'white', borderRadius: '15px', border: '1px solid #f1f5f9', padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', color: '#e2e8f0', marginBottom: '20px' }}>
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h5 style={{ margin: '0 0 10px 0', color: '#475569' }}>Ready for Generation</h5>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Click the export buttons above to download the full multi-year report in high-speed Excel/CSV format.</p>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{data.cases.length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Records</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{data.cases.filter(c => c.status === 'Closed').length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Closed</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{data.cases.filter(c => c.status !== 'Closed').length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Pending</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisciplinaryReports;
