import React, { useState } from 'react';
import { OrganizationData } from '../../types/organization';
import { exportToCSV } from '../../utils/csvExport';

interface OrgReportsProps {
    data: OrganizationData;
}

const OrgReports: React.FC<OrgReportsProps> = ({ data }) => {
    const [activeReport, setActiveReport] = useState<'org' | 'branch' | 'dept' | 'summary'>('summary');

    const handleDownload = () => {
        let exportData: any[] = [];
        let fileName = 'Org_Report';

        switch (activeReport) {
            case 'org':
                exportData = [{ ...data.company }];
                fileName = 'Organization_Profile';
                break;
            case 'branch':
                exportData = data.branches;
                fileName = 'Branch_Report';
                break;
            case 'dept':
                exportData = data.departments;
                fileName = 'Dept_Designation_Report';
                break;
            case 'summary':
                exportData = data.branches.map(b => ({
                    Branch: b.branchName,
                    Entries: data.departments.filter(d => d.location === b.branchName).length,
                    Status: b.status
                }));
                fileName = 'Organization_Structure_Summary';
                break;
        }

        exportToCSV(exportData, fileName);
    };

    const tabs = [
        { id: 'summary', label: 'Structure Summary' },
        { id: 'org', label: 'Company Profile' },
        { id: 'branch', label: 'Branch List' },
        { id: 'dept', label: 'Dept & Designation List' }
    ];

    return (
        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1e293b' }}>
                    <i className="fas fa-chart-pie" style={{ color: '#4f46e5', marginRight: '10px' }}></i>
                    Organization Master Reports
                </h3>
                <button
                    onClick={handleDownload}
                    style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fas fa-file-csv"></i> Download CSV
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', overflowX: 'auto', paddingBottom: '5px' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveReport(tab.id as any)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '25px',
                            border: 'none',
                            background: activeReport === tab.id ? '#4f46e5' : '#f1f5f9',
                            color: activeReport === tab.id ? 'white' : '#64748b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '13px',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
                {activeReport === 'summary' && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ color: '#1e293b', marginBottom: '15px' }}>1. Organization Structure Summary</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead style={{ background: '#4f46e5', color: 'white' }}>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Branch</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Total Entries</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.branches.map((branch, idx) => (
                                    <tr key={idx} style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{branch.branchName}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{data.departments.filter(d => d.location === branch.branchName).length}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{branch.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeReport === 'org' && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ color: '#1e293b', marginBottom: '15px' }}>2. Company Profile Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                            {Object.entries(data.company).map(([key, value]) => (
                                <div key={key} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold', display: 'block' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{value as string}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeReport === 'branch' && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ color: '#1e293b', marginBottom: '15px' }}>3. Branch Information</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead style={{ background: '#4f46e5', color: 'white' }}>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Code</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Branch Name</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Location</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Unit Type</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.branches.map((b, idx) => (
                                    <tr key={idx} style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '12px' }}>{b.branchCode}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{b.branchName}</td>
                                        <td style={{ padding: '12px' }}>{b.city}, {b.state}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{b.unitType}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{b.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeReport === 'dept' && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ color: '#1e293b', marginBottom: '15px' }}>4. Dept & Designation Combined List</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead style={{ background: '#4f46e5', color: 'white' }}>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Dept / Sub-Dept</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Branch</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Grade</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.departments.map((d, idx) => (
                                    <tr key={idx} style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ fontWeight: 'bold' }}>{d.departmentName}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{d.subDepartment}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>{d.location} ({d.branchCode})</td>
                                        <td style={{ padding: '12px' }}>{d.gradeLevel || 'N/A'}</td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>{d.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgReports;
