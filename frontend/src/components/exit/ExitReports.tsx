import React, { useState } from 'react';
import { SeparationData } from '../../types/exit';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: SeparationData;
}

const ExitReports: React.FC<Props> = ({ data }) => {
    const [selectedReport, setSelectedReport] = useState('summary');

    const handleExport = () => {
        let exportData: any[] = [];
        let filename = 'exit_report';

        switch (selectedReport) {
            case 'summary':
                exportData = data.exits.map(e => ({
                    'Employee ID': e.id,
                    'Name': e.name,
                    'Department': e.department,
                    'Designation': e.designation,
                    'Last Working Day': e.lastWorkingDay,
                    'Status': e.status
                }));
                filename = 'Employee_Exit_Report';
                break;
            case 'fnf':
                exportData = data.settlements.map(s => {
                    const emp = data.exits.find(e => e.id === s.employeeId);
                    return {
                        'Employee ID': s.employeeId,
                        'Name': emp?.name || 'N/A',
                        'Salary': s.salaryTillLastDay,
                        'Leave Encashment': s.leaveEncashment,
                        'Gratuity': s.gratuity,
                        'Bonus': s.bonusIncentives,
                        'Deductions': s.deductions,
                        'Net Pay': s.netPayable,
                        'Status': s.status
                    };
                });
                filename = 'Full_and_Final_Settlement_Report';
                break;
            case 'clearance':
                exportData = data.clearances.map(c => {
                    const emp = data.exits.find(e => e.id === c.employeeId);
                    return {
                        'Employee ID': c.employeeId,
                        'Name': emp?.name || 'N/A',
                        'Asset': c.asset,
                        'Payroll': c.payroll,
                        'HR': c.hr,
                        'Finance': c.finance,
                        'IT/Admin': c.itAdmin,
                        'Overall Status': c.totalStatus
                    };
                });
                filename = 'No_Dues_Clearance_Report';
                break;
            case 'feedback':
                exportData = data.interviews.map(i => {
                    const emp = data.exits.find(e => e.id === i.employeeId);
                    return {
                        'Employee ID': i.employeeId,
                        'Name': emp?.name || 'N/A',
                        'Reason': i.reasonForLeaving,
                        'Feedback': i.feedback,
                        'Rejoining Eligible': i.rejoiningEligibility
                    };
                });
                filename = 'Exit_Interview_Feedback_Report';
                break;
        }

        exportToCSV(exportData, filename);
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px' }}>Separation Reports & Analytics</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        style={{ padding: '10px 20px', background: '#475569', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-import"></i> Import CSV
                    </button>
                    <button
                        onClick={handleExport}
                        style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-excel"></i> Export CSV/Excel
                    </button>
                    <button style={{ padding: '10px 20px', background: '#312e81', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-print"></i> Print PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                        { id: 'summary', label: 'Employee Exit Report', icon: 'fa-user-minus' },
                        { id: 'fnf', label: 'Full & Final Report', icon: 'fa-file-invoice-dollar' },
                        { id: 'clearance', label: 'No-Dues Clearance Report', icon: 'fa-clipboard-check' },
                        { id: 'feedback', label: 'Exit Interview Feedback', icon: 'fa-comment-alt-lines' },
                        { id: 'dept', label: 'Dept-wise Exit Analysis', icon: 'fa-chart-network' }
                    ].map(report => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            style={{
                                padding: '15px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: selectedReport === report.id ? '#f43f5e' : '#e2e8f0',
                                background: selectedReport === report.id ? '#fff1f2' : 'white',
                                color: selectedReport === report.id ? '#e11d48' : '#64748b',
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
                        <h4 style={{ margin: 0, color: '#1e1b4b' }}>Preview: {selectedReport.replace(/-/g, ' ').toUpperCase()}</h4>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Real-time feed</span>
                    </div>

                    <div style={{ background: 'white', borderRadius: '15px', border: '1px solid #f1f5f9', padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', color: '#e2e8f0', marginBottom: '20px' }}>
                            <i className="fas fa-file-export"></i>
                        </div>
                        <h5 style={{ margin: '0 0 10px 0', color: '#475569' }}>Consolidated Data Ready</h5>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Download official separation records for compliance and accounting in Excel format.</p>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e1b4b' }}>{data.exits.length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Exits</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{data.exits.filter(e => e.status === 'Closed').length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Settled</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b' }}>{data.exits.filter(e => e.status !== 'Closed').length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>In Process</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExitReports;
