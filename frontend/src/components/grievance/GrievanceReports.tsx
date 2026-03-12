import React, { useState } from 'react';
import { GrievanceData } from '../../types/grievance';
import { exportToCSV } from '../../utils/csvExport';

interface Props {
    data: GrievanceData;
}

const GrievanceReports: React.FC<Props> = ({ data }) => {
    const [selectedReport, setSelectedReport] = useState('register');

    const handleExport = () => {
        let exportData: any[] = [];
        let filename = 'grievance_report';

        switch (selectedReport) {
            case 'register':
                exportData = data.grievances.map(g => ({
                    'Grievance ID': g.id,
                    'Employee ID': g.employeeId,
                    'Employee Name': g.employeeName,
                    'Category': g.category,
                    'Date': g.date,
                    'Status': g.status
                }));
                filename = 'Grievance_Register_Report';
                break;
            case 'category':
                const categories = ['Work', 'Pay', 'Behavior', 'Policy', 'Harassment'];
                exportData = categories.map(cat => ({
                    'Category': cat,
                    'Total': data.grievances.filter(g => g.category === cat).length,
                    'Resolved': data.grievances.filter(g => g.category === cat && g.status === 'Closed').length,
                    'Pending': data.grievances.filter(g => g.category === cat && g.status !== 'Closed').length
                }));
                filename = 'Category_wise_Grievance_Report';
                break;
            case 'dept':
                const departments = Array.from(new Set(data.grievances.map(g => g.department)));
                exportData = departments.map(dept => ({
                    'Department': dept,
                    'Total': data.grievances.filter(g => g.department === dept).length,
                    'Closed': data.grievances.filter(g => g.department === dept && g.status === 'Closed').length,
                    'Pending': data.grievances.filter(g => g.department === dept && g.status !== 'Closed').length
                }));
                filename = 'Department_wise_Grievance_Report';
                break;
        }

        exportToCSV(exportData, filename);
    };

    return (
        <div style={{ background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h3 style={{ margin: 0, color: '#164e63', fontSize: '20px' }}>Grievance Reports & Analytics</h3>
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
                    <button style={{ padding: '10px 20px', background: '#0e7490', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-print"></i> Print PDF
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                        { id: 'register', label: 'Grievance Register Report', icon: 'fa-clipboard-list' },
                        { id: 'category', label: 'Category-wise Report', icon: 'fa-tags' },
                        { id: 'resolution', label: 'Time to Resolution', icon: 'fa-stopwatch' },
                        { id: 'status', label: 'Open vs Closed Analytics', icon: 'fa-chart-pie' },
                        { id: 'dept', label: 'Department-wise Analysis', icon: 'fa-building' }
                    ].map(report => (
                        <button
                            key={report.id}
                            onClick={() => setSelectedReport(report.id)}
                            style={{
                                padding: '15px',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: selectedReport === report.id ? '#06b6d4' : '#e2e8f0',
                                background: selectedReport === report.id ? '#ecfeff' : 'white',
                                color: selectedReport === report.id ? '#0891b2' : '#64748b',
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
                        <h4 style={{ margin: 0, color: '#164e63' }}>Preview: {selectedReport.replace(/-/g, ' ').toUpperCase()}</h4>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Live data feed</span>
                    </div>

                    <div style={{ background: 'white', borderRadius: '15px', border: '1px solid #f1f5f9', padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', color: '#e2e8f0', marginBottom: '20px' }}>
                            <i className="fas fa-chart-bar"></i>
                        </div>
                        <h5 style={{ margin: '0 0 10px 0', color: '#475569' }}>Data Ready for Export</h5>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Analyze multi-year grievance trends with specialized CSV/Excel downloads.</p>

                        <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{data.grievances.length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Cases</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>{data.grievances.filter(g => g.status === 'Closed').length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Resolved</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '24px', fontWeight: 800, color: '#06b6d4' }}>{data.grievances.filter(g => g.status !== 'Closed').length}</div>
                                <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Pending</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrievanceReports;
