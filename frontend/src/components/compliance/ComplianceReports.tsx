import React, { useState } from 'react';
import { ComplianceData } from '../../types/compliance';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: ComplianceData;
}

const ComplianceReports: React.FC<Props> = ({ data }) => {
    const [selectedReport, setSelectedReport] = useState('pfesic');

    const handleExport = () => {
        let exportData: any[] = [];
        let filename = 'compliance_report';

        switch (selectedReport) {
            case 'pfesic':
                exportData = data.pfEsicReturns.map(r => ({
                    'Month': r.returnMonth,
                    'Employee ID': r.employeeId,
                    'Name': r.employeeName,
                    'PF Contribution': r.pfContribution,
                    'ESIC Contribution': r.esicContribution,
                    'Status': r.status
                }));
                filename = 'PF_ESIC_Monthly_Report';
                break;
            case 'bonus':
                exportData = data.statutoryPayments.map(p => ({
                    'Employee ID': p.employeeId,
                    'Name': p.employeeName,
                    'Bonus Eligible': p.bonusEligible ? 'Yes' : 'No',
                    'Bonus Amount': p.bonusPayable,
                    'Status': p.bonusStatus,
                    'Reason': p.nonPaymentReason || ''
                }));
                filename = 'Bonus_and_Non_Payment_Report';
                break;
            case 'labour':
                exportData = data.labourCompliance.map(l => ({
                    'Department': l.department,
                    'Employee Name': l.employeeName,
                    'Status': l.status,
                    'Verified By': l.verifiedBy
                }));
                filename = 'Labour_Compliance_Report';
                break;
        }

        exportToCSV(exportData, filename);
    };

    const reports = [
        { id: 'pfesic', label: 'PF / ESIC Monthly', icon: 'fa-university' },
        { id: 'bonus', label: 'Bonus & Non-Payment', icon: 'fa-gift' },
        { id: 'labour', label: 'Labour Compliance', icon: 'fa-hard-hat' },
        { id: 'contract', label: 'Contract Labour Report', icon: 'fa-users-cog' },
        { id: 'safety', label: 'Accident & Safety', icon: 'fa-first-aid' },
        { id: 'audit', label: 'Audit & Summary', icon: 'fa-clipboard-list' }
    ];

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '20px' }}>Compliance Reports Repository</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '10px 20px', background: '#334155', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-file-import"></i> Import Returns
                    </button>
                    <button
                        onClick={handleExport}
                        style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <i className="fas fa-file-excel"></i> Export CSV/Excel
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {reports.map(report => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            style={{
                                padding: '15px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: selectedReport === report.id ? '#10b981' : '#e2e8f0',
                                background: selectedReport === report.id ? '#ecfdf5' : 'white',
                                color: selectedReport === report.id ? '#059669' : '#64748b',
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
                    </div>

                    <div style={{ background: 'white', borderRadius: '15px', border: '1px solid #f1f5f9', padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', color: '#e2e8f0', marginBottom: '20px' }}>
                            <i className="fas fa-file-signature"></i>
                        </div>
                        <h5 style={{ margin: '0 0 10px 0', color: '#475569' }}>Statutory Data Ready</h5>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>All calculations are based on the latest government rules for PF, ESIC, and PT.</p>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>Active</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Audit Status</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>100%</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>PF Return Rate</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>Verified</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Labour Docs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplianceReports;
